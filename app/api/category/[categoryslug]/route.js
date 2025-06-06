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
  let client; // Deklarasi client di luar try-catch untuk ensure it's accessible in finally

  try {
    // Validasi categoryslug
    if (!categoryslug) {
      return new Response(JSON.stringify({ message: 'category slug is required' }), {
        status: 400, // Bad Request: Parameter yang diperlukan tidak ada
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Ambil parameter 'page' dari URL, default ke 1 jika tidak ada
    const url = new URL(req.url);
    let page = parseInt(url.searchParams.get('page') || '1', 10);

    // Validasi nomor halaman
    if (isNaN(page) || page < 1) { // Menambahkan isNaN untuk penanganan input non-angka
      return new Response(JSON.stringify({ message: 'Invalid page number. Page must be a positive integer.' }), {
        status: 400, // Bad Request: Parameter tidak valid
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const offset = (page - 1) * LIMIT;

    client = await getClient();

    // Query untuk mendapatkan hotel
    const query = `
      SELECT id, name, address, addresslocality, addressregion, addresscountry, description, url, category, categoryslug, image, lowest_price
      FROM public.hotels
      WHERE categoryslug = $1
      ORDER BY id
      OFFSET $2
      LIMIT $3
    `;
    const queryParams = [categoryslug, offset, LIMIT];
    const result = await client.query(query, queryParams);

    // Query untuk mendapatkan total jumlah hotel untuk kategori ini
    const countQuery = `
      SELECT COUNT(*)
      FROM public.hotels
      WHERE categoryslug = $1
    `;
    const countResult = await client.query(countQuery, [categoryslug]);
    const totalHotels = parseInt(countResult.rows[0].count, 10);

    // Hitung total halaman
    const totalPages = Math.ceil(totalHotels / LIMIT);

    // **Perbaikan Kunci untuk GSC: Tangani kasus "tidak ditemukan data" dengan 404**
    // Jika tidak ada hotel ditemukan untuk categoryslug ini, kembalikan 404 Not Found
    if (totalHotels === 0) {
      return new Response(
        JSON.stringify({ message: `No hotels found for category: ${categoryslug}` }),
        {
          status: 404, // Mengembalikan status 404 Not Found
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Query untuk mendapatkan related categorys (sebelumnya related countrys)
    // Perhatikan: query ini masih mengambil 'country', jika maksudnya kategori lain, perlu disesuaikan.
    // Jika ini adalah contoh query untuk mendapatkan kategori terkait, pastikan kolomnya relevan.
    const relatedCategoryQuery = `
      SELECT category, categoryslug
      FROM public.hotels
      WHERE categoryslug != $1 -- Mengambil kategori yang berbeda dari saat ini
      GROUP BY category, categoryslug
      LIMIT 10; -- Batasi jumlah kategori terkait
    `;
    const relatedCategoryResult = await client.query(relatedCategoryQuery, [categoryslug]);


    return new Response(
      JSON.stringify({
        hotels: result.rows,
        relatedcategory: relatedCategoryResult.rows, // Menggunakan hasil query relatedCategory
        pagination: {
          page: page, // Gunakan 'page' yang sudah divalidasi
          totalPages,
          totalHotels,
        },
        // Logika nextPage perlu disesuaikan jika 'id' tidak selalu berurutan atau unik.
        // Jika pagination hanya berdasarkan offset, `nextPage` bisa menjadi `page + 1` jika `page < totalPages`.
        // Untuk contoh ini, saya akan menyederhanakannya atau menghilangkannya jika tidak relevan dengan kebutuhan frontend.
        // nextPage: result.rows.length === LIMIT ? result.rows[result.rows.length - 1].id : null,
        nextPage: page < totalPages ? page + 1 : null,
      }),
      {
        status: 200, // OK: Data berhasil ditemukan dan dikembalikan
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Terjadi error saat menjalankan query:', error.stack);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      {
        status: 500, // Internal Server Error: Terjadi masalah di server
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } finally {
    if (client) {
      client.release(); // Pastikan koneksi dilepaskan kembali ke pool
    }
  }
}