import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: process.env.NODE_ENV === 'production' ? {
    ca: fs.existsSync(path.resolve('certs', 'root.crt'))
      ? fs.readFileSync(path.resolve('certs', 'root.crt'))
      : undefined,
    rejectUnauthorized: true,
  } : false,
});

// Tes koneksi database
pool.connect((err) => {
  if (err) {
    console.error('Gagal terhubung ke database:', err.message);
  } else {
    console.log('Berhasil terhubung ke database');
  }
});

const cache = {};
const cacheTTL = 60 * 60 * 1000; // Cache 1 jam
const pageSize = 40;

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

const pageCache = {};

export async function GET(request, { params }) {
  try {
    const { categoryslug, countryslug, stateslug, cityslug, hotelslug } = await params;
    const url = new URL(request.url);
    const reset = url.searchParams.get('reset') === 'true';
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    if (!categoryslug || !countryslug || !stateslug || !cityslug || !hotelslug) {
      return new Response(JSON.stringify({ message: 'Semua parameter slug diperlukan' }), { status: 400 });
    }

    const cacheKey = `${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}:page${page}`;
    const cachedData = getCache(cacheKey);
    if (cachedData && !reset) {
      console.log('Mengembalikan data dari cache');
      return new Response(JSON.stringify(cachedData), { status: 200 });
    }

    const hotelResult = await pool.query(
      'SELECT * FROM public.hotels WHERE hotelslug = $1 AND categoryslug = $2 AND countryslug = $3 AND stateslug = $4 AND cityslug = $5',
      [hotelslug, categoryslug, countryslug, stateslug, cityslug]
    );

    if (hotelResult.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Hotel tidak ditemukan' }), { status: 404 });
    }

    if (!pageCache[hotelslug] || reset) {
      pageCache[hotelslug] = { currentPage: 0 };
    }

    const offset = (page - 1) * pageSize;

    const relatedHotelsQuery = `
      SELECT * FROM public.hotels
      WHERE cityslug = $1
      AND categoryslug = $2
      AND hotelslug != $3
      ORDER BY numberOfReviews DESC, hotelslug ASC
      LIMIT $4 OFFSET $5;
    `;
    const relatedHotelsResult = await pool.query(relatedHotelsQuery, [
      hotelResult.rows[0].cityslug,
      hotelResult.rows[0].categoryslug,
      hotelslug,
      pageSize,
      offset,
    ]);

    const relatedHotels = relatedHotelsResult.rows.length > 0 ? relatedHotelsResult.rows : [];

    pageCache[hotelslug].currentPage = page;

    const remainingHotelsQuery = `
      SELECT COUNT(*) as count FROM public.hotels
      WHERE cityslug = $1
      AND categoryslug = $2
      AND hotelslug != $3;
    `;
    const remainingHotelsResult = await pool.query(remainingHotelsQuery, [
      hotelResult.rows[0].cityslug,
      hotelResult.rows[0].categoryslug,
      hotelslug,
    ]);
    const hasNextPage = parseInt(remainingHotelsResult.rows[0].count) > offset + relatedHotels.length;

    const response = {
      hotel: hotelResult.rows[0],
      relatedHotels,
      currentPage: page,
      hasNextPage,
    };

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
    const { categoryslug, countryslug, stateslug, cityslug, hotelslug } = await params;

    if (!categoryslug || !countryslug || !stateslug || !cityslug || !hotelslug) {
      return new Response(JSON.stringify({ message: 'Semua parameter slug diperlukan' }), { status: 400 });
    }

    const currentPage = pageCache[hotelslug]?.currentPage || 0;
    const nextPage = currentPage + 1;

    const redirectUrl = `/api/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}?page=${nextPage}`;
    return new Response(null, {
      status: 307,
      headers: { Location: redirectUrl },
    });
  } catch (error) {
    console.error('Error saat mengambil halaman berikutnya:', error.message, error.stack);
    return new Response(JSON.stringify({ message: 'Kesalahan server internal', error: error.message }), { status: 500 });
  }
}