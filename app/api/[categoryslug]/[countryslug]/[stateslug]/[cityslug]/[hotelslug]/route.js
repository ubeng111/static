// app/api/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/[hotelslug]/route.js
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { gzipSync } from 'zlib';
import { NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: {
    // Pastikan sertifikat root.crt ada di produksi, jika tidak, set undefined
    ca: fs.existsSync(path.resolve('certs', 'root.crt'))
      ? fs.readFileSync(path.resolve('certs', 'root.crt'))
      : undefined,
    rejectUnauthorized: true, // Pastikan ini true di produksi
  },
});

pool.connect((err) => {
  if (err) console.error('Gagal terhubung ke database:', err.message);
  else console.log('Berhasil terhubung ke database');
});

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
  // --- PERBAIKAN PENTING: JANGAN 'await' params ---
  // params sudah merupakan objek yang berisi slug, tidak perlu di-await.
  const { categoryslug, countryslug, stateslug, cityslug, hotelslug } = params;

  // --- Penanganan URL yang lebih robust ---
  let url;
  let reset = false;

  try {
    // Memeriksa apakah request atau request.url undefined/null
    if (!request || !request.url) {
      console.error('SERVER ERROR [route.js - GET]: Request object atau URL tidak terdefinisi.');
      // Mengembalikan 404 karena ini bukan permintaan yang valid untuk API
      return new Response(null, { status: 404 });
    }
    url = new URL(request.url);
    reset = url.searchParams.get('reset') === 'true';
  } catch (urlError) {
    console.error('SERVER ERROR [route.js - GET]: Gagal mem-parse URL dari request:', request.url, urlError.message);
    // Mengembalikan 404 untuk URL yang tidak dapat diproses (misalnya, format tidak valid)
    return new Response(null, { status: 404 });
  }
  // --- Akhir penanganan URL yang lebih robust ---


  // Validasi Awal untuk Menghindari Pencocokan Aset Statis Next.js
  // Ini penting agar permintaan untuk file seperti .js, .css, dll.
  // tidak diproses sebagai slug hotel.
  if (
    categoryslug === 'next' ||
    categoryslug === '_next' ||
    (hotelslug && (
      hotelslug.endsWith('.map') ||
      hotelslug.endsWith('.css') ||
      hotelslug.endsWith('.js') ||
      hotelslug.endsWith('.woff') ||
      hotelslug.endsWith('.ttf') ||
      hotelslug.endsWith('.svg') ||
      hotelslug.endsWith('.eot') ||
      hotelslug.endsWith('.gif')
    ))
  ) {
    console.warn(`SERVER WARN [${categoryslug}/${countryslug}/.../route.js]: Permintaan aset statis Next.js ditangkap oleh rute API dinamis ini: ${request.url}`);
    return new Response(null, { status: 404 });
  }

  // Validasi parameter slug yang diperlukan
  if (!categoryslug || !countryslug || !stateslug || !cityslug || !hotelslug) {
    console.error('SERVER ERROR [route.js - GET]: Parameter slug yang diperlukan hilang:', { categoryslug, countryslug, stateslug, cityslug, hotelslug });
    return NextResponse.json({ error: 'Semua parameter slug diperlukan' }, { status: 400 });
  }

  const cacheKey = `hotel_detail_${categoryslug}_${countryslug}_${stateslug}_${cityslug}_${hotelslug}`;
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

  // Blok try-catch untuk operasi database
  try {
    const hotelResult = await pool.query(
      'SELECT * FROM public.hotels WHERE hotelslug = $1 AND categoryslug = $2 AND countryslug = $3 AND stateslug = $4 AND cityslug = $5',
      [hotelslug, categoryslug, countryslug, stateslug, cityslug]
    );

    if (hotelResult.rows.length === 0) {
      return NextResponse.json({ error: 'Hotel tidak ditemukan' }, { status: 404 });
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
    console.error('Error saat mengambil data hotel dari database:', error.message);
    return NextResponse.json({ error: 'Kesalahan server saat mengambil data' }, { status: 500 });
  }
}