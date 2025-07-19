// app/api/all-category-paths/route.js
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
      SELECT slug AS categoryslug
      FROM public.categories
      WHERE slug IS NOT NULL AND slug != '';
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching all category paths:', error);
    return NextResponse.json({ message: 'Internal Server Error fetching category paths' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}