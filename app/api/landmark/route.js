// app/api/landmark/route.js (API Route for POST requests)

import { Pool } from 'pg';
// import fs from 'fs'; // Hapus impor ini
// import path from 'path'; // Hapus impor ini
import 'dotenv/config'; // Impor dotenv untuk memuat .env
import { gzipSync } from 'zlib'; // Digunakan untuk kompresi respons jika diperlukan

// --- PERUBAHAN PENTING DI SINI: Menggunakan variabel lingkungan untuk sertifikat CA ---
const caCert = process.env.DATABASE_CA_CERT; // Ambil konten sertifikat dari variabel lingkungan

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: caCert
    ? {
        ca: caCert,
        rejectUnauthorized: true, // `rejectUnauthorized: true` adalah default yang aman
      }
    : false, // Jika `caCert` tidak ada, `false` berarti tidak menggunakan SSL atau SSL akan dihandle oleh connection string
});
// --- AKHIR PERUBAHAN PENTING ---

const AGODA_API_URL = process.env.AGODA_API_URL || "http://affiliateapi7643.agoda.com/affiliateservice/lt_v1";
const SITE_ID = process.env.AGODA_SITE_ID;
const API_KEY = process.env.AGODA_API_KEY;

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function POST(req) {
  let client; // Deklarasikan client di luar try block untuk akses di finally
  try {
    console.log('SERVER DEBUG [route.js]: POST request received at /api/landmark');

    const body = await req.json();
    console.log('SERVER DEBUG [route.js]: Request body parsed:', body);

    const {
      landmark_slug,
      checkInDate: clientCheckInDate,
      checkOutDate: clientCheckOutDate,
      numberOfAdults: clientAdults,
      numberOfChildren: clientChildren,
      numberOfRooms: clientRooms,
      currency: clientCurrency,
      language: clientLanguage, // <-- Ini nilai 'language' yang datang dari frontend
      maxResult: clientMaxResult,
      sortBy: clientSortBy,
    } = body;

    console.log('SERVER DEBUG [route.js]: Destructured landmark_slug:', landmark_slug);
    console.log('SERVER DEBUG [route.js]: Destructured clientCurrency:', clientCurrency);
    console.log('SERVER DEBUG [route.js]: Destructured clientLanguage:', clientLanguage); // Tambah log ini

    const checkInDate = clientCheckInDate || getTodayDate();
    const checkOutDate = clientCheckOutDate || getTomorrowDate();
    const numberOfAdults = clientAdults !== undefined ? clientAdults : 2;
    const numberOfChildren = clientChildren !== undefined ? clientChildren : 0;
    const numberOfRooms = clientRooms !== undefined ? clientRooms : 1;
    const currency = clientCurrency || 'USD';
    
    // --- KOREKSI DI SINI ---
    let language = clientLanguage || 'en-us'; // Default jika clientLanguage kosong

    // Validasi tambahan untuk memastikan panjang language
    if (typeof language !== 'string' || language.length < 5) {
        console.warn(`SERVER WARN [route.js]: clientLanguage "${clientLanguage}" tidak valid atau terlalu pendek. Menggunakan default 'en-us'.`);
        language = 'en-us'; // Pastikan selalu minimal 5 karakter
    }
    // --- AKHIR KOREKSI ---

    const maxResult = clientMaxResult || 100;
    const sortBy = clientSortBy || 'Recommended';

    console.log('SERVER DEBUG [route.js]: Final currency used for API:', currency);
    console.log('SERVER DEBUG [route.js]: Final language used for API:', language); // Tambah log ini
    console.log('SERVER DEBUG [route.js]: Final language length:', language.length); // Tambah log ini

    if (typeof landmark_slug !== 'string' || landmark_slug.trim() === '') {
      console.error('SERVER ERROR [route.js]: Validation failed - landmark_slug is missing or empty.');
      return new Response(
        JSON.stringify({ message: 'Slug landmark diperlukan di body permintaan.' }),
        { status: 400 }
      );
    }
    if (!checkInDate || !checkOutDate) {
        console.error('SERVER ERROR [route.js]: Validation failed - Check-in or check-out date invalid after default.');
        return new Response(
            JSON.stringify({ message: 'Tanggal check-in dan check-out tidak valid setelah default.' }),
            { status: 500 }
        );
    }

    client = await pool.connect(); // Ambil koneksi dari pool di dalam handler
    let landmarkName = 'Not found';
    let city_id;
    let cityName = 'Unknown City';
    let category = 'Hotels';

    try {
      console.log('SERVER DEBUG [route.js]: Querying DB for landmark details.');
      const landmarkQuery = `
        SELECT name AS landmark_name, city_id, city AS city_name, category
        FROM landmarks
        WHERE slug = $1
        LIMIT 1
      `;
      const landmarkResult = await client.query(landmarkQuery, [landmark_slug]);

      if (!landmarkResult.rows.length) {
        console.error('SERVER ERROR [route.js]: Landmark not found in database for slug:', landmark_slug);
        return new Response(
          JSON.stringify({ message: 'Landmark tidak ditemukan di database.' }),
          { status: 404 }
        );
      }

      const landmark = landmarkResult.rows[0];
      landmarkName = landmark.landmark_name;
      city_id = landmark.city_id;
      cityName = landmark.city_name || 'Unknown City';
      category = landmark.category || 'Hotels';
      console.log('SERVER DEBUG [route.js]: Landmark found:', { landmarkName, city_id, cityName, category });

    } finally {
      // client.release() akan dipanggil di finally block terluar
    }

    const payload = {
      criteria: {
        additional: {
          currency,
          language, // <-- Ini yang akan dikirim ke Agoda
          maxResult,
          occupancy: {
            numberOfAdult: numberOfAdults,
            numberOfChildren: numberOfChildren,
          },
          sortBy,
        },
        checkInDate,
        checkOutDate,
        cityId: parseInt(city_id, 10),
      },
    };

    console.log('SERVER DEBUG [route.js]: Sending payload to Agoda API:', JSON.stringify(payload, null, 2));

    const response = await fetch(AGODA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip,deflate',
        Authorization: `${SITE_ID}:${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('SERVER DEBUG [route.js]: Received response from Agoda API:', data);

    if (!response.ok || data.error) {
      const errorMessage = data.error?.message || 'Error API Agoda tidak diketahui';
      const statusCode = response.status || 500;
      console.error(`SERVER ERROR [route.js]: Agoda API error (${statusCode}):`, errorMessage, data);
      return new Response(
        JSON.stringify({ message: `Error Agoda: ${errorMessage}` }),
        { status: statusCode }
      );
    }

    const hotels = (data.results || []).map((hotel) => ({
      hotelId: hotel.hotelId,
      hotelName: hotel.hotelName,
      imageURL: hotel.imageURL,
      reviewScore: hotel.reviewScore,
      reviewCount: hotel.reviewCount,
      starRating: hotel.starRating,
      landingURL: hotel.landingURL,
      dailyRate: hotel.dailyRate,
      discountPercentage: hotel.discountPercentage,
      freeWifi: hotel.freeWifi,
      landmarkName,
      cityName,
    }));

    // Kompresi respons jika diinginkan (opsional, tergantung kebutuhan API ini)
    const compressedResponse = gzipSync(JSON.stringify({ hotels, landmarkName, cityName, category }));
    
    return new Response(compressedResponse, {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip', // Beri tahu klien bahwa respons dikompresi gzip
      },
    });
  } catch (error) {
    console.error('SERVER FATAL ERROR [route.js]: Uncaught exception in POST /api/landmark:', error);
    return new Response(JSON.stringify({ message: 'Terjadi kesalahan server internal yang tidak terduga.' }), { status: 500 });
  } finally {
    if (client) { // Pastikan client ada sebelum dilepaskan
      client.release();
    }
  }
}