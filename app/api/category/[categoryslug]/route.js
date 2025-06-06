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

// Fungsi untuk mendapatkan koneksi pool
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

// Batasan pagination
const LIMIT = 12;

export async function GET(req, { params }) {
  const { categoryslug } = params;

  if (!categoryslug) {
    return new Response(JSON.stringify({ message: 'category slug is required' }), {
      status: 400,
    });
  }

  // Ambil parameter 'page' dari URL, default ke 1 jika tidak ada
  const url = new URL(req.url);
  let page = parseInt(url.searchParams.get('page') || '1', 10);

  // Validasi nomor halaman
  if (page && page < 1) {
    return new Response(JSON.stringify({ message: 'Halaman harus berupa angka positif' }), {
      status: 400,
    });
  }

  // Hitung keyset berdasarkan halaman yang diminta (gunakan id terakhir pada halaman sebelumnya)
  const lastId = url.searchParams.get('lastId') || 0;

  const client = await getClient();

  try {
    // Query untuk mendapatkan data hotel berdasarkan categoryslug dengan pagination menggunakan keyset
    const query = `
      SELECT * FROM public.hotels
      WHERE categoryslug = $1 AND id > $2
      ORDER BY id ASC
      LIMIT $3
    `;
    const result = await client.query(query, [categoryslug, lastId, LIMIT]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Tidak ada hotel ditemukan untuk categoryslug ini' }), {
        status: 404,
      });
    }

    // Query untuk menghitung total hotel berdasarkan categoryslug (untuk info pagination)
    const countQuery = `
      SELECT COUNT(*) 
      FROM public.hotels 
      WHERE categoryslug = $1
    `;
    const countResult = await client.query(countQuery, [categoryslug]);
    const totalHotels = parseInt(countResult.rows[0].count, 10);

    // Hitung total halaman
    const totalPages = Math.ceil(totalHotels / LIMIT);

    // Query untuk mendapatkan related countrys berdasarkan category yang sama
    const relatedcountryQuery = `
      SELECT country, categoryslug, category
      FROM public.hotels 
      WHERE categoryslug = $1
        AND country != '' 
      GROUP BY country, categoryslug, category
      LIMIT 100
    `;
    const relatedcountryResult = await client.query(relatedcountryQuery, [categoryslug]);

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
    console.error('Terjadi error saat menjalankan query', error.stack);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
    });
  } finally {
    client.release();
  }
}

export async function closeDb() {
  await pool.end();
}
