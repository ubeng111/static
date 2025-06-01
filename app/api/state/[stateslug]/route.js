import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Setup koneksi pool ke database
const pool = new Pool({
  connectionString: 'postgresql://iwan:bUq8DFcXvg1yRFU9iLGhww@messy-coyote-10965.j77.aws-ap-southeast-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
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
const LIMIT = 13;

export async function GET(req, { params }) {
  const { stateslug } = params;

  if (!stateslug) {
    return new Response(JSON.stringify({ message: 'State slug is required' }), {
      status: 400,
    });
  }

  // Ambil parameter 'page' dari URL, default ke 1 jika tidak ada
  const url = new URL(req.url);
  let page = parseInt(url.searchParams.get('page') || '1', 10);

  // Validasi nomor halaman
  if (page && page < 1) {
    return new Response(JSON.stringify({ message: 'Halaman harus berupa angka positif' }), {
      status: 400,
    });
  }

  // Check cache first
  const cacheKey = `hotels_${stateslug}_page_${page}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    console.log('Returning cached data');
    return new Response(JSON.stringify(cachedData), { status: 200 });
  }

  // Hitung offset berdasarkan halaman yang diminta
  const offset = (page - 1) * LIMIT;

  const client = await pool.connect();

  try {
    // Query untuk mendapatkan data hotel dan total hotels dalam satu query
    const query = `
      WITH hotel_data AS (
        SELECT * FROM public.hotels 
        WHERE stateslug = $1
        ORDER BY id ASC
        LIMIT $2 OFFSET $3
      ),
      hotel_count AS (
        SELECT COUNT(*) AS total FROM public.hotels WHERE stateslug = $1
      )
      SELECT 
        hotel_data.*, 
        hotel_count.total
      FROM hotel_data, hotel_count;
    `;
    const result = await client.query(query, [stateslug, LIMIT, offset]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Tidak ada hotel ditemukan untuk stateslug ini' }), {
        status: 404,
      });
    }

    const totalHotels = parseInt(result.rows[0].total, 10);
    const totalPages = Math.ceil(totalHotels / LIMIT);

    // Query untuk mendapatkan related cities berdasarkan state yang sama
    const relatedstateQuery = `
      SELECT DISTINCT city, stateslug, state, country 
      FROM public.hotels
      WHERE stateslug = $1
      AND city != '' 
      LIMIT 40
    `;
    const relatedstateResult = await client.query(relatedstateQuery, [stateslug]);

    // Construct the response data
    const response = {
      hotels: result.rows.slice(0, -1),  // Remove the extra 'total' field from the response
      relatedstate: relatedstateResult.rows,
      pagination: {
        page: page || 1,
        totalPages,
        totalHotels,
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
