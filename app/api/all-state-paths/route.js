// app/api/all-state-paths/route.js
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve('certs', 'root.crt')) },
});

export async function GET() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(`
      SELECT DISTINCT
        c.slug AS categoryslug,
        co.slug AS countryslug,
        s.slug AS stateslug
      FROM
        public.states s
      JOIN
        public.countries co ON s.country_id = co.id
      JOIN
        public.categories c ON c.name = 'Hotel'; -- Asumsi kategori 'Hotel' untuk negara bagian ini
      WHERE
        s.slug IS NOT NULL AND s.slug != '' AND
        co.slug IS NOT NULL AND co.slug != '' AND
        c.slug IS NOT NULL AND c.slug != '';
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching all state paths:', error);
    return NextResponse.json({ message: 'Internal Server Error fetching state paths' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}