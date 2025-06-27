// app/api/search-hotels/route.js

import { Pool } from 'pg';
// import fs from 'fs'; // Hapus impor ini
// import path from 'path'; // Hapus impor ini
import 'dotenv/config'; // Impor dotenv untuk memuat .env

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

const AGODA_API_URL = process.env.AGODA_API_URL;
const SITE_ID = process.env.AGODA_SITE_ID;
const API_KEY = process.env.AGODA_API_KEY;

export async function POST(req) {
  let client; // Deklarasikan client di luar try block untuk akses di finally
  try {
    const body = await req.json();
    const {
      city_id,
      checkInDate,
      checkOutDate,
      numberOfAdults = 2,
      numberOfChildren = 0,
      numberOfRooms = 1,
      currency = 'USD',
      language: clientLanguage, // Ambil language dari body sebagai clientLanguage
    } = body;

    // --- Start Perbaikan untuk language ---
    let language = clientLanguage || 'en-us'; // Gunakan 'en-us' sebagai default

    // Validasi panjang string language
    if (typeof language !== 'string' || language.length < 5) {
      console.warn(`SERVER WARN [search-hotels/route.js]: Incoming language "${clientLanguage}" is invalid or too short. Falling back to default 'en-us'.`);
      language = 'en-us'; // Paksa ke 'en-us' jika tidak valid atau terlalu pendek
    }
    // --- End Perbaikan untuk language ---

    if (!city_id || !checkInDate || !checkOutDate) {
      console.error('SERVER ERROR [search-hotels/route.js]: City ID, check-in, or check-out date are missing from request body.');
      return new Response(
        JSON.stringify({ message: 'City ID, tanggal check-in, dan check-out diperlukan' }),
        { status: 400 }
      );
    }

    client = await pool.connect(); // Ambil koneksi dari pool di dalam handler
    let cityName = 'Not found';
    try {
      const cityQuery = 'SELECT city FROM public.hotels WHERE city_id = $1 LIMIT 1';
      const cityResult = await client.query(cityQuery, [city_id]);
      cityName = cityResult.rows[0]?.city || cityName;
    } catch (dbError) {
      console.error('SERVER ERROR [search-hotels/route.js]: Gagal mengambil nama kota dari database:', dbError.message);
      // Lanjutkan dengan 'Not found' untuk cityName jika ada error DB
    } finally {
      // client.release() akan dipanggil di finally block terluar
    }


    const payload = {
      criteria: {
        additional: {
          currency,
          language, // Gunakan nilai 'language' yang sudah divalidasi
          maxResult: 100,
          occupancy: { numberOfAdult: numberOfAdults, numberOfChildren: numberOfChildren },
          sortBy: 'Recommended',
        },
        checkInDate,
        checkOutDate,
        cityId: parseInt(city_id, 10),
      },
    };

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
    if (!response.ok || data.error) {
      console.error('SERVER ERROR [search-hotels/route.js]: Agoda API response not OK or contains error:', data.error?.message || response.statusText);
      return new Response(
        JSON.stringify({ message: data.error?.message || 'Error API Agoda' }),
        { status: response.status }
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
      cityName, // city name from DB
    }));

    return new Response(JSON.stringify({ hotels, cityName }), { status: 200 });
  } catch (error) {
    console.error('SERVER FATAL ERROR [search-hotels/route.js]: Uncaught error in POST handler:', error);
    return new Response(JSON.stringify({ message: 'Error server' }), { status: 500 });
  } finally {
    if (client) { // Pastikan client ada sebelum dilepaskan
      client.release();
    }
  }
}