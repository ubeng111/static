// app/api/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/[hotelslug]/route.js
import { Pool } from 'pg';
// import fs from 'fs'; // Hapus impor ini
// import path from 'path'; // Hapus impor ini
import 'dotenv/config';
import { gzipSync } from 'zlib';

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

// Hapus pool.connect di luar handler GET. Koneksi akan diambil dari pool di dalam handler.
// pool.connect((err) => {
//   if (err) console.error('Gagal terhubung ke database:', err.message);
//   else console.log('Berhasil terhubung ke database');
// });

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

export async function GET(request, { params }) {
  let client; // Deklarasikan client di luar try block untuk akses di finally
  try {
    // --- PERBAIKAN: params sudah objek, tidak perlu `await params` ---
    const { categoryslug, countryslug, stateslug, cityslug, hotelslug } = params;
    // --- AKHIR PERBAIKAN ---

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

    // Ambil koneksi dari pool di dalam handler
    client = await pool.connect();

    const hotelResult = await client.query(
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
    const relatedHotelsResult = await client.query(relatedHotelsQuery, [
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
  } finally {
    if (client) { // Pastikan client ada sebelum dilepaskan
      client.release();
    }
  }
}

// closeDb() tidak digunakan di API Route karena pool akan dikelola secara otomatis oleh serverless env
// export async function closeDb() {
//   await pool.end();
// }