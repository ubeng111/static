import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Setup koneksi pool ke database
const pool = new Pool({
  connectionString: 'postgresql://iwan:MgPytsc9syLB4eE3Ub1u_w@tart-rhino-11897.j77.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
  ssl: {
    ca: fs.readFileSync(path.resolve('certs', 'root.crt')),
  },
});

// Fungsi untuk mendapatkan koneksi pool dengan retry
const getClient = async (retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      return client;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Batasan pagination
const LIMIT = 12;

export async function GET(req, { params }) {
  const { categoryslug } = params;

  if (!categoryslug) {
    return new Response(JSON.stringify({ message: 'Category slug is required' }), {
      status: 400,
    });
  }

  // Ambil parameter 'page' dan 'lastId' dari URL
  const url = new URL(req.url);
  let page = parseInt(url.searchParams.get('page') || '1', 10);
  const lastId = url.searchParams.get('lastId') || 0;

  // Validasi nomor halaman
  if (page < 1) {
    return new Response(JSON.stringify({ message: 'Halaman harus berupa angka positif' }), {
      status: 400,
    });
  }

  const client = await getClient();

  try {
    // Query untuk mendapatkan data hotel
    const query = `
      SELECT * FROM public.hotels
      WHERE categoryslug = $1 AND id > $2
      ORDER BY id ASC
      LIMIT $3
    `;
    const result = await client.query(query, [categoryslug, lastId, LIMIT]);

    // Query untuk menghitung total hotel
    const countQuery = `
      SELECT COUNT(*) 
      FROM public.hotels 
      WHERE categoryslug = $1
    `;
    const countResult = await client.query(countQuery, [categoryslug]);
    const totalHotels = parseInt(countResult.rows[0].count, 10);

    // Hitung total halaman
    const totalPages = Math.ceil(totalHotels / LIMIT);

    // Query untuk mendapatkan related countries
    const relatedcountryQuery = `
      SELECT country, categoryslug, category
      FROM public.hotels 
      WHERE categoryslug = $1
        AND country != '' 
      GROUP BY country, categoryslug, category
      LIMIT 100
    `;
    const relatedcountryResult = await client.query(relatedcountryQuery, [categoryslug]);

    // Selalu kembalikan status 200, bahkan jika tidak ada data
    return new Response(
      JSON.stringify({
        hotels: result.rows,
        relatedcategory: relatedcountryResult.rows,
        pagination: {
          page: page || 1,
          totalPages,
          totalHotels,
        },
        nextPage: result.rows.length === LIMIT ? result.rows[result.rows.length - 1].id : null,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Terjadi error saat menjalankan query:', error.stack);
    return new Response(
      JSON.stringify({
        hotels: [],
        relatedcategory: [],
        pagination: { page: 1, totalPages: 0, totalHotels: 0 },
        nextPage: null,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } finally {
    client.release();
  }
}

export async function closeDb() {
  await pool.end();
}