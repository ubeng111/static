import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Initialize pool only once (important in dev mode)
let pool;
if (!global.pgPool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
    ssl: { ca: fs.readFileSync(path.resolve('certs', 'root.crt')) },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  global.pgPool = pool;
} else {
  pool = global.pgPool;
}

export async function GET(req) {
  const url = new URL(req.url);
  const cityName = url.searchParams.get('city');

  if (!cityName) {
    return new Response(JSON.stringify({ message: 'Nama kota diperlukan' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const start = Date.now(); // For logging query duration

  try {
    const query = `
      SELECT DISTINCT city, country
      FROM public.hotels
      WHERE city ILIKE $1 || '%' AND country = $2
      ORDER BY city ASC
      LIMIT 10
    `;

    const result = await pool.query(query, [cityName, 'Indonesia']);

    const duration = Date.now() - start;
    console.log(`[API] Query untuk '${cityName}' selesai dalam ${duration}ms`);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Kota tidak ditemukan' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ cities: result.rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] Error saat query kota:', error.stack);
    return new Response(JSON.stringify({ message: 'Terjadi kesalahan pada server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
