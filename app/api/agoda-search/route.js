import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; // Impor dotenv untuk memuat .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve('certs', 'root.crt')) },
});

const AGODA_API_URL = process.env.AGODA_API_URL;
const SITE_ID = process.env.AGODA_SITE_ID;
const API_KEY = process.env.AGODA_API_KEY;

export async function POST(req) {
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
      console.warn(`SERVER WARN [route.js]: Incoming language "${clientLanguage}" is invalid or too short. Falling back to default 'en-us'.`);
      language = 'en-us'; // Paksa ke 'en-us' jika tidak valid atau terlalu pendek
    }
    // --- End Perbaikan untuk language ---

    if (!city_id || !checkInDate || !checkOutDate) {
      return new Response(
        JSON.stringify({ message: 'City ID, tanggal check-in, dan check-out diperlukan' }),
        { status: 400 }
      );
    }

    const client = await pool.connect();
    let cityName = 'Not found';
    try {
      const cityQuery = 'SELECT city FROM public.hotels WHERE city_id = $1 LIMIT 1';
      const cityResult = await client.query(cityQuery, [city_id]);
      cityName = cityResult.rows[0]?.city || cityName;
    } finally {
      client.release();
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
      cityName,
    }));

    return new Response(JSON.stringify({ hotels, cityName }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: 'Error server' }), { status: 500 });
  }
}