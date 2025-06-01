import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; // Impor dotenv untuk memuat .env

// Konfigurasi pool dengan pengaturan tambahan
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve('certs', 'root.crt')) },
  max: 20, // Maksimum 20 koneksi dalam pool
  idleTimeoutMillis: 30000, // Koneksi idle ditutup setelah 30 detik
  connectionTimeoutMillis: 2000, // Timeout jika tidak bisa connect dalam 2 detik
});

export async function GET(req) {
  const url = new URL(req.url);
  const cityName = url.searchParams.get('city');

  if (!cityName) {
    return new Response(JSON.stringify({ message: 'Nama kota diperlukan' }), { status: 400 });
  }

  try {
    const query = `
      SELECT DISTINCT city, city_id, country
      FROM public.hotels
      WHERE LOWER(city) LIKE LOWER($1)
      LIMIT 10
    `;
    const result = await pool.query(query, [`%${cityName}%`]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Kota tidak ditemukan' }), { status: 404 });
    }

    return new Response(JSON.stringify({ cities: result.rows }), { status: 200 });
  } catch (error) {
    console.error('Error:', error.stack);
    return new Response(JSON.stringify({ message: 'Error server' }), { status: 500 });
  }
}