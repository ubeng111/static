// route.js

import { Pool } from 'pg';
// import fs from 'fs'; // Hapus impor ini
// import path from 'path'; // Hapus impor ini
import 'dotenv/config';

// --- PERUBAHAN PENTING DI SINI: Menggunakan variabel lingkungan untuk sertifikat CA ---
const caCert = process.env.DATABASE_CA_CERT; // Ambil konten sertifikat dari variabel lingkungan

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: caCert ? { ca: caCert } : { rejectUnauthorized: false }, // Jika caCert ada, gunakan. Jika tidak, HATI-HATI dengan `rejectUnauthorized: false` di produksi.
});
// --- AKHIR PERUBAHAN PENTING ---

const cache = {};
const cacheTTL = 60 * 60 * 1000; // 1 hour

function getCache(key) {
  const cachedData = cache[key];
  if (cachedData && Date.now() - cachedData.timestamp < cacheTTL) {
    return cachedData.data;
  }
  return null;
}

function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() };
}

const LIMIT = 12;

export async function GET(req, { params }) {
  // --- MULAI PERUBAHAN DI SINI ---
  // `params` sudah objek, tidak perlu `await params`
  const { categoryslug, countryslug, stateslug, cityslug } = params; 
  // --- AKHIR PERUBAHAN ---

  if (!categoryslug || !countryslug || !stateslug || !cityslug) {
    return new Response(JSON.stringify({ message: 'All slugs are required' }), { status: 400 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  if (page < 1) {
    return new Response(JSON.stringify({ message: 'Page must be a positive number' }), { status: 400 });
  }

  const cacheKey = `hotels_${categoryslug}_${countryslug}_${stateslug}_${cityslug}_page_${page}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return new Response(JSON.stringify(cachedData), { status: 200 });
  }

  const offset = (page - 1) * LIMIT;
  const client = await pool.connect();

  try {
    const validateHierarchy = await client.query(
      `SELECT 1 FROM public.hotels WHERE categoryslug = $1 AND countryslug = $2 AND stateslug = $3 AND cityslug = $4 LIMIT 1`,
      [categoryslug, countryslug, stateslug, cityslug]
    );
    if (validateHierarchy.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Invalid hierarchy' }), { status: 400 });
    }

    const query = `
      WITH hotel_data AS (
        SELECT id, title, city, state, country, category, categoryslug, countryslug, stateslug, cityslug, hotelslug, img, location, ratings, numberOfReviews, numberrooms, overview, city_id, latitude, longitude
        FROM public.hotels
        WHERE categoryslug = $1 AND countryslug = $2 AND stateslug = $3 AND cityslug = $4
        ORDER BY id ASC
        LIMIT $5 OFFSET $6
      ),
      hotel_count AS (
        SELECT COUNT(*) AS total FROM public.hotels
        WHERE categoryslug = $1 AND countryslug = $2 AND stateslug = $3 AND cityslug = $4
      )
      SELECT hotel_data.*, hotel_count.total
      FROM hotel_data, hotel_count;
    `;

    const result = await client.query(query, [categoryslug, countryslug, stateslug, cityslug, LIMIT, offset]);

    // Memfilter baris yang hanya berisi data hotel yang relevan dan menghapus properti 'total'
    const hotels = result.rows.filter(row => row.id !== undefined).map(({ total, ...hotel }) => hotel);

    if (hotels.length === 0) {
      return new Response(JSON.stringify({ message: 'No hotels found for this city' }), { status: 404 });
    }

    const totalHotels = parseInt(result.rows[0].total, 10);
    const totalPages = Math.ceil(totalHotels / LIMIT);

    const relatedCityQuery = `
      SELECT DISTINCT city, cityslug
      FROM public.hotels
      WHERE categoryslug = $1 AND countryslug = $2 AND stateslug = $3 AND cityslug != $4 AND city IS NOT NULL AND city != ''
      LIMIT 40
    `;
    const relatedCityResult = await client.query(relatedCityQuery, [categoryslug, countryslug, stateslug, cityslug]);

    const response = {
      hotels: JSON.parse(JSON.stringify(hotels)),
      relatedcity: JSON.parse(JSON.stringify(relatedCityResult.rows)),
      pagination: { page, totalPages, totalHotels },
    };

    setCache(cacheKey, response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error executing query', error.stack);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  } finally {
    client.release();
  }
}

export async function closeDb() {
  await pool.end();
}