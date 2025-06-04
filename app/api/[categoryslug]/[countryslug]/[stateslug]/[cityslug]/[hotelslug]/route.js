// app/api/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/[hotelslug]/route.js
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { gzipSync } from 'zlib';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          ca: fs.existsSync(path.resolve('certs', 'root.crt'))
            ? fs.readFileSync(path.resolve('certs', 'root.crt'))
            : undefined,
          rejectUnauthorized: true,
        }
      : false,
});

pool.connect((err) => {
  if (err) console.error('Gagal terhubung ke database:', err.message);
  else console.log('Berhasil terhubung ke database');
});

const cache = {};
const cacheTTL = 60 * 60 * 1000;

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

export async function GET(request, { params }) {
  try {
    const { categoryslug, countryslug, stateslug, cityslug, hotelslug } = params;
    const url = new URL(request.url);
    const reset = url.searchParams.get('reset') === 'true';

    if (!categoryslug || !countryslug || !stateslug || !cityslug || !hotelslug) {
      return new Response(JSON.stringify({ error: 'Semua parameter slug diperlukan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cacheKey = `${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`;
    const cachedData = getCache(cacheKey);
    if (cachedData && !reset) {
      const compressed = gzipSync(JSON.stringify(cachedData));
      return new Response(compressed, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'gzip',
        },
      });
    }

    const hotelResult = await pool.query(
      'SELECT * FROM public.hotels WHERE hotelslug = $1 AND categoryslug = $2 AND countryslug = $3 AND stateslug = $4 AND cityslug = $5',
      [hotelslug, categoryslug, countryslug, stateslug, cityslug]
    );

    if (hotelResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Hotel tidak ditemukan' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const relatedHotelsQuery = `
      SELECT * FROM public.hotels
      WHERE cityslug = $1
        AND categoryslug = $2
        AND hotelslug != $3
      ORDER BY RANDOM()
      LIMIT 15;
    `;
    const relatedHotelsResult = await pool.query(relatedHotelsQuery, [
      hotelResult.rows[0].cityslug,
      hotelResult.rows[0].categoryslug,
      hotelslug,
    ]);

    const response = {
      hotel: hotelResult.rows[0],
      relatedHotels: relatedHotelsResult.rows,
    };

    setCache(cacheKey, response);

    const compressed = gzipSync(JSON.stringify(response));
    return new Response(compressed, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip',
      },
    });
  } catch (error) {
    console.error('Error saat mengambil data hotel:', error.message);
    return new Response(JSON.stringify({ error: 'Kesalahan server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}