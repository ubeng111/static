import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Buat instance pool untuk koneksi reusable
const pool = new Pool({
  connectionString: 'postgresql://iwan:4Pqahaa5tZKsYgUeYO7Raw@subtle-cuscus-11598.j77.aws-ap-southeast-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
  ssl: {
    ca: fs.readFileSync(path.resolve('certs', 'root.crt')),
    rejectUnauthorized: true,
  },
});

// Implementasi cache sederhana
const cache = {};
const cacheTTL = 60 * 60 * 1000; // Cache 1 jam
const pageSize = 40; // Jumlah related hotels per halaman

function getCache(key) {
  const cachedData = cache[key];
  if (cachedData && (Date.now() - cachedData.timestamp) < cacheTTL) {
    return cachedData.data;
  }
  return null;
}

function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() };
}

// Cache untuk melacak halaman terakhir per hotelslug
const pageCache = {};

export async function GET(request, { params }) {
  try {
    const { hotelslug } = await params;
    const url = new URL(request.url);
    const reset = url.searchParams.get('reset') === 'true'; // Parameter untuk reset cache
    const page = parseInt(url.searchParams.get('page')) || 1;

    if (!hotelslug) {
      return new Response(JSON.stringify({ message: 'Hotel slug diperlukan' }), { status: 400 });
    }

    // Kunci cache untuk data hotel
    const cacheKey = `${hotelslug}:page${page}`;
    const cachedData = getCache(cacheKey);
    if (cachedData && !reset) {
      console.log('Mengembalikan data dari cache');
      return new Response(JSON.stringify(cachedData), { status: 200 });
    }

    // Query untuk mengambil data hotel berdasarkan hotelslug
    const hotelResult = await pool.query('SELECT * FROM public.hotels WHERE hotelslug = $1', [hotelslug]);

    if (hotelResult.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Hotel tidak ditemukan' }), { status: 404 });
    }

    // Inisialisasi pageCache untuk hotelslug jika belum ada atau reset diminta
    if (!pageCache[hotelslug] || reset) {
      pageCache[hotelslug] = { currentPage: 0 };
    }

    // Tentukan offset untuk pagination
    const offset = (page - 1) * pageSize;

    // Query untuk mengambil related hotels berdasarkan numberOfReviews terbanyak
    const relatedHotelsQuery = `
      SELECT * FROM public.hotels
      WHERE cityslug = $1
      AND hotelslug != $2
      ORDER BY numberOfReviews DESC, hotelslug ASC
      LIMIT $3 OFFSET $4;
    `;
    const relatedHotelsResult = await pool.query(relatedHotelsQuery, [
      hotelResult.rows[0].cityslug,
      hotelslug,
      pageSize,
      offset,
    ]);

    const relatedHotels = relatedHotelsResult.rows.length > 0 ? relatedHotelsResult.rows : [];

    // Perbarui pageCache
    pageCache[hotelslug].currentPage = page;

    // Hitung apakah masih ada hotel lain yang tersedia
    const remainingHotelsQuery = `
      SELECT COUNT(*) as count FROM public.hotels
      WHERE cityslug = $1
      AND hotelslug != $2;
    `;
    const remainingHotelsResult = await pool.query(remainingHotelsQuery, [
      hotelResult.rows[0].cityslug,
      hotelslug,
    ]);
    const hasNextPage = parseInt(remainingHotelsResult.rows[0].count) > offset + relatedHotels.length;

    // Susun data respons
    const response = {
      hotel: hotelResult.rows[0],
      relatedHotels,
      currentPage: page,
      hasNextPage,
    };

    // Simpan ke cache
    setCache(cacheKey, response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saat mengambil data hotel:', error.message, error.stack);
    return new Response(JSON.stringify({ message: 'Kesalahan server internal', error: error.message }), { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { hotelslug } = await params;

    if (!hotelslug) {
      return new Response(JSON.stringify({ message: 'Hotel slug diperlukan' }), { status: 400 });
    }

    // Ambil halaman berikutnya dari pageCache
    const currentPage = pageCache[hotelslug]?.currentPage || 0;
    const nextPage = currentPage + 1;

    // Redirect ke endpoint GET dengan parameter halaman
    const redirectUrl = `/api/hotels/${hotelslug}?page=${nextPage}`;
    return new Response(null, {
      status: 307,
      headers: { Location: redirectUrl },
    });
  } catch (error) {
    console.error('Error saat mengambil halaman berikutnya:', error.message, error.stack);
    return new Response(JSON.stringify({ message: 'Kesalahan server internal', error: error.message }), { status: 500 });
  }
}