import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Setup koneksi pool ke database
const pool = new Pool({
  connectionString: 'postgresql://travelin:t20kBr6lFEKVivIB_RlEng@prized-alpaca-7510.j77.aws-ap-southeast-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
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
  const { stateslug } = params;

  if (!stateslug) {
    return new Response(JSON.stringify({ message: 'state slug is required' }), {
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

  // Hitung offset berdasarkan halaman yang diminta
  const offset = page ? (page - 1) * LIMIT : 0;

  const client = await getClient();

  try {
    // Query untuk mendapatkan data hotel berdasarkan stateslug dengan pagination
    const query = `
      SELECT * FROM hotels_mv 
      WHERE stateslug = $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3
    `;
    const result = await client.query(query, [stateslug, LIMIT, offset]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Tidak ada hotel ditemukan untuk stateslug ini' }), {
        status: 404,
      });
    }

    // Query untuk menghitung total hotel berdasarkan stateslug (untuk info pagination)
    const countQuery = 'SELECT COUNT(*) FROM hotels_mv WHERE stateslug = $1';
    const countResult = await client.query(countQuery, [stateslug]);
    const totalHotels = parseInt(countResult.rows[0].count, 10);

    // Hitung total halaman
    const totalPages = Math.ceil(totalHotels / LIMIT);

    // Query untuk mendapatkan related cities berdasarkan state yang sama
    const relatedstateQuery = `
      SELECT DISTINCT city, stateslug, state, country 
      FROM hotels_mv 
      WHERE stateslug = $1
      AND city != '' 
      LIMIT 40
    `;
    const relatedstateResult = await client.query(relatedstateQuery, [stateslug]);

    return new Response(
      JSON.stringify({
        hotels: result.rows,
        relatedstate: relatedstateResult.rows,
        pagination: {
          page: page || 1,
          totalPages,
          totalHotels,
        },
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
    // Pastikan koneksi dilepas setelah penggunaan
    client.release();
  }
}

// Tutup koneksi pool ketika aplikasi selesai
export async function closeDb() {
  await pool.end();
}
