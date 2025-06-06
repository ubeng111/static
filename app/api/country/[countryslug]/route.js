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
  const { countryslug } = params;

  if (!countryslug) {
    return new Response(JSON.stringify({ message: 'country slug is required' }), {
      status: 400,
    });
  }

  const url = new URL(req.url);
  let page = parseInt(url.searchParams.get('page') || '1', 10);

  if (page && page < 1) {
    return new Response(JSON.stringify({ message: 'Halaman harus berupa angka positif' }), {
      status: 400,
    });
  }

  const lastId = url.searchParams.get('lastId') || 0;

  const client = await getClient();

  try {
    const query = `
      SELECT * FROM public.hotels
      WHERE countryslug = $1 AND id > $2
      ORDER BY id ASC
      LIMIT $3
    `;
    const result = await client.query(query, [countryslug, lastId, LIMIT]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Tidak ada hotel ditemukan untuk countryslug ini' }), {
        status: 404,
      });
    }

    const countQuery = `
      SELECT COUNT(*)
      FROM public.hotels
      WHERE countryslug = $1
    `;
    const countResult = await client.query(countQuery, [countryslug]);
    const totalHotels = parseInt(countResult.rows[0].count, 10);

    const totalPages = Math.ceil(totalHotels / LIMIT);

    const relatedStateQuery = `
      SELECT state, countryslug, country
      FROM public.hotels
      WHERE countryslug = $1
        AND state IS NOT NULL
        AND state != ''
      GROUP BY state, countryslug, country
      LIMIT 40
    `;
    const relatedStateResult = await client.query(relatedStateQuery, [countryslug]);

    return new Response(
      JSON.stringify({
        hotels: result.rows,
        relatedStates: relatedStateResult.rows, // Pastikan ini 'relatedStates'
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