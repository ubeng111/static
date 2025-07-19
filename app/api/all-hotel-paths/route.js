// app/api/all-hotel-paths/route.js
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
      SELECT
        c.slug AS categoryslug,
        co.slug AS countryslug,
        s.slug AS stateslug,
        ci.slug AS cityslug,
        h.hotelslug AS hotelslug
      FROM
        public.hotels h
      JOIN
        public.cities ci ON h.city_id = ci.id
      JOIN
        public.states s ON ci.state_id = s.id
      JOIN
        public.countries co ON s.country_id = co.id
      JOIN
        public.categories c ON h.category_id = c.id
      WHERE
        h.hotelslug IS NOT NULL AND h.hotelslug != '' AND
        ci.slug IS NOT NULL AND ci.slug != '' AND
        s.slug IS NOT NULL AND s.slug != '' AND
        co.slug IS NOT NULL AND co.slug != '' AND
        c.slug IS NOT NULL AND c.slug != '';
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching all hotel paths:', error);
    return NextResponse.json({ message: 'Internal Server Error fetching hotel paths' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}