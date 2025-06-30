// app/api/fast-landmarks-by-city/route.js
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'root.crt')) },
});

export async function GET(req) {
  console.log('SERVER DEBUG [fast-landmarks-by-city/route.js]: GET request received.');

  try {
    const { searchParams } = new URL(req.url);
    const city_id = searchParams.get('city_id'); // *** Kembali ambil city_id ***

    if (!city_id) { // *** Kembali validasi city_id ***
      console.error('SERVER ERROR [fast-landmarks-by-city/route.js]: city_id parameter is missing.');
      return new Response(
        JSON.stringify({ message: 'Parameter city_id diperlukan.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = await pool.connect();
    try {
      // *** PERBAIKAN: Kembali filter WHERE city_id = $1 ***
      // *** PERBAIKAN: Hapus pengambilan source_latitude, source_longitude, dan distance dari sini ***
      // *** karena kita akan menghitung ulang distance dari hotel di page.jsx ***
      const queryText = `
        SELECT id, name, latitude, longitude, city_id, city, slug, category
        FROM landmarks
        WHERE city_id = $1 -- Kembali filter berdasarkan city_id
        -- Hapus ORDER BY RANDOM() dan LIMIT di sini; shuffle akan di page.jsx
      `;
      const result = await client.query(queryText, [city_id]);

      const landmarks = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        latitude: parseFloat(row.latitude) || 0, // Pastikan ini float
        longitude: parseFloat(row.longitude) || 0, // Pastikan ini float
        // distance: row.distance !== null ? parseFloat(row.distance) : null, // Hapus ini
        city_id: row.city_id,
        city: row.city,
        slug: row.slug,
        category: row.category || 'Unknown',
      }));
      
      console.log(`SERVER DEBUG [fast-landmarks-by-city/route.js]: Fetched ${landmarks.length} landmarks for city_id ${city_id} (to be processed in page.jsx).`);

      return new Response(
        JSON.stringify(landmarks),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('SERVER FATAL ERROR [fast-landmarks-by-city/route.js]: Uncaught exception:', error);
    return new Response(
      JSON.stringify({ message: 'Terjadi kesalahan server internal yang tidak terduga.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}