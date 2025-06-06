import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Validate environment variable
if (!process.env.DATABASE_URL_SUBTLE_CUSCUS) {
  throw new Error('DATABASE_URL_SUBTLE_CUSCUS is not defined');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: {
    ca: fs.readFileSync(path.resolve('certs', 'root.crt')),
  },
});

// Implementasi cache sederhana menggunakan objek in-memory
const cache = {};
const cacheTTL = 60 * 60 * 1000; // Cache expiration time in milliseconds (1 hour)

// Fungsi untuk mendapatkan data dari cache
function getCache(key) {
  const cachedData = cache[key];
  if (cachedData && (Date.now() - cachedData.timestamp) < cacheTTL) {
    return cachedData.data;
  }
  return null;
}

// Fungsi untuk menyimpan data ke cache
function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() };
}

// Batasan pagination
const LIMIT = parseInt(process.env.HOTELS_PER_PAGE || '12', 10);

export async function GET(req, { params }) {
  const { stateslug } = params;

  if (!stateslug) {
    return new Response(JSON.stringify({ message: 'State slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Ambil parameter 'page' dari URL, default ke 1 jika tidak ada
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  // Validasi nomor halaman
  if (page < 1 || isNaN(page)) {
    return new Response(JSON.stringify({ message: 'Halaman harus berupa angka positif' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check cache first
  const cacheKey = `hotels_${stateslug}_page_${page}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    console.log('Returning cached data');
    return new Response(JSON.stringify(cachedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Hitung offset berdasarkan halaman yang diminta
  const offset = (page - 1) * LIMIT;

  const client = await pool.connect();

  try {
    // Query untuk mendapatkan data hotel, total hotels, dan breadcrumb data
    const query = `
      WITH hotel_data AS (
        SELECT id, title, city, state, country, category, categoryslug, countryslug, stateslug, cityslug, hotelslug,
               img, location, ratings, numberOfReviews, numberrooms, overview, city_id, latitude, longitude
        FROM public.hotels 
        WHERE stateslug = $1
        ORDER BY id ASC
        LIMIT $2 OFFSET $3
      ),
      hotel_count AS (
        SELECT COUNT(*) AS total FROM public.hotels WHERE stateslug = $1
      ),
      breadcrumb_data AS (
        SELECT DISTINCT country, state, countryslug, stateslug
        FROM public.hotels
        WHERE stateslug = $1
        LIMIT 1
      )
      SELECT 
        hotel_data.*,
        hotel_count.total,
        breadcrumb_data.country,
        breadcrumb_data.state,
        breadcrumb_data.countryslug,
        breadcrumb_data.stateslug
      FROM hotel_data, hotel_count, breadcrumb_data;
    `;
    const result = await client.query(query, [stateslug, LIMIT, offset]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Tidak ada hotel ditemukan untuk stateslug ini' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const totalHotels = parseInt(result.rows[0].total, 10);
    const totalPages = Math.ceil(totalHotels / LIMIT);

    // Query untuk mendapatkan related cities berdasarkan state yang sama
    const relatedstateQuery = `
      SELECT DISTINCT city, city_id, cityslug, stateslug, state, country, countryslug
      FROM public.hotels
      WHERE stateslug = $1 AND city != ''
      ORDER BY city ASC
      LIMIT 40
    `;
    const relatedstateResult = await client.query(relatedstateQuery, [stateslug]);

    // Construct the response data
    const response = {
      hotels: result.rows.map(row => ({
        id: row.id,
        title: row.title,
        city: row.city,
        state: row.state,
        country: row.country,
        category: row.category,
        categoryslug: row.categoryslug,
        countryslug: row.countryslug,
        stateslug: row.stateslug,
        cityslug: row.cityslug,
        hotelslug: row.hotelslug,
        img: row.img,
        location: row.location,
        ratings: row.ratings,
        numberOfReviews: row.numberOfReviews,
        numberrooms: row.numberrooms,
        overview: row.overview,
        city_id: row.city_id,
        latitude: row.latitude,
        longitude: row.longitude,
      })),
      relatedstate: relatedstateResult.rows,
      pagination: {
        page: page || 1,
        totalPages,
        totalHotels,
      },
      breadcrumb: {
        country: result.rows[0].country,
        state: result.rows[0].state,
        countryslug: result.rows[0].countryslug,
        stateslug: result.rows[0].stateslug,
      },
    };

    // Cache the result for future use
    setCache(cacheKey, response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Terjadi error saat menjalankan query', error.stack);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    // Pastikan koneksi dilepas setelah penggunaan
    client.release();
  }
}

// Tutup koneksi pool ketika aplikasi selesai
export async function closeDb() {
  await pool.end();
}