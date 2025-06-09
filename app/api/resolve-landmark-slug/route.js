// app/api/resolve-landmark-slug/route.js
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Inisialisasi koneksi database di sisi server
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'root.crt')) },
});

export async function POST(req) {
  try {
    const { names } = await req.json(); // Mengasumsikan body adalah { names: ["Nama Landmark 1", "Nama Landmark 2"] }

    if (!Array.isArray(names) || names.length === 0) {
      return new Response(JSON.stringify({ error: 'Array of landmark names is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await pool.connect();
    try {
      const results = [];
      // Buat query dinamis untuk mencari banyak nama sekaligus menggunakan IN clause
      // Ini lebih efisien daripada loop individual query jika names.length besar
      const placeholders = names.map((_, i) => `$${i + 1}`).join(',');
      const landmarkQuery = `
        SELECT name, slug
        FROM landmarks
        WHERE name IN (${placeholders})
      `;
      const landmarkResult = await client.query(landmarkQuery, names);

      // Buat map untuk akses cepat slug
      const slugMap = new Map(landmarkResult.rows.map(row => [row.name, row.slug]));

      // Format hasil sesuai permintaan client
      for (const name of names) {
        results.push({
          name: name,
          slug: slugMap.get(name) || null // Jika tidak ditemukan, slugnya null
        });
      }

      return new Response(JSON.stringify({ slugs: results }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (dbError) {
      console.error('SERVER ERROR [resolve-landmark-slug]: Error fetching slugs from database:', dbError);
      return new Response(JSON.stringify({ error: 'Internal database error.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('SERVER FATAL ERROR [resolve-landmark-slug]: Uncaught exception in POST /api/resolve-landmark-slug:', error);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}