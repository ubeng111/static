// route.js
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Setup koneksi pool ke database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://iwan:MgPytsc9syLB4eE3Ub1u_w@tart-rhino-11897.j77.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
  ssl: {
    // Pastikan path ke certs/root.crt sudah benar dan file ada saat deployment
    ca: fs.readFileSync(path.resolve('certs', 'root.crt')),
  },
  // Konfigurasi pool untuk penanganan koneksi yang lebih baik
  max: 20, // Jumlah maksimum client yang bisa ada di pool pada satu waktu
  idleTimeoutMillis: 30000, // Client akan di-release setelah tidak aktif selama 30 detik
  connectionTimeoutMillis: 2000, // Waktu tunggu maksimal untuk mendapatkan koneksi dari pool (2 detik)
});

// Fungsi untuk mendapatkan koneksi pool dengan retry
// Mengurangi delay dan retries karena masalah utama kemungkinan bukan koneksi, tapi query lambat
const getClient = async (retries = 2, delay = 500) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      return client;
    } catch (error) {
      console.error(`Attempt ${i + 1} to connect to database failed:`, error.message);
      if (i === retries - 1) throw error; // Lempar error jika ini percobaan terakhir
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
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(req.url);
  let page = parseInt(url.searchParams.get('page') || '1', 10);

  // Validasi nomor halaman
  if (page < 1) {
    // Mengembalikan halaman 1 jika page tidak valid atau kurang dari 1
    page = 1; 
  }

  let client;
  try {
    client = await getClient(); // Ambil koneksi dari pool

    // Hitung offset berdasarkan halaman dan limit
    const offset = (page - 1) * LIMIT;

    // Menggunakan kueri yang lebih efisien untuk mendapatkan data hotel dan count
    // Coba gabungkan jika memungkinkan atau pastikan indeks ada.
    // Jika data hotel banyak, pastikan indeks pada categoryslug dan id (untuk ORDER BY)
    // Asumsi: id adalah primary key atau memiliki indeks, categoryslug memiliki indeks.
    const hotelsQuery = `
      SELECT * FROM public.hotels
      WHERE categoryslug = $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3;
    `;
    const hotelsResult = await client.query(hotelsQuery, [categoryslug, LIMIT, offset]);

    const countQuery = `
      SELECT COUNT(*) FROM public.hotels WHERE categoryslug = $1;
    `;
    const countResult = await client.query(countQuery, [categoryslug]);
    const totalHotels = parseInt(countResult.rows[0].count, 10);

    const totalPages = Math.ceil(totalHotels / LIMIT);

    // Kueri untuk mendapatkan related categories (sebelumnya related countries)
    // Membatasi hasilnya agar tidak terlalu banyak dan cepat.
    const relatedCategoryQuery = `
      SELECT DISTINCT categoryslug, category 
      FROM public.hotels 
      WHERE categoryslug != $1 AND category IS NOT NULL AND category != ''
      LIMIT 10; -- Mengurangi limit agar lebih cepat
    `;
    const relatedCategoryResult = await client.query(relatedCategoryQuery, [categoryslug]);

    // Selalu kembalikan status 200, bahkan jika tidak ada data
    return new Response(
      JSON.stringify({
        hotels: hotelsResult.rows,
        relatedcategory: relatedCategoryResult.rows,
        pagination: {
          page: page,
          totalPages,
          totalHotels,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60', // Cache API response for 60 seconds
        },
      }
    );
  } catch (error) {
    console.error('Terjadi error saat menjalankan query:', error.stack);
    // Mengembalikan struktur data kosong dengan status 200 agar client-side tidak crash
    // dan bisa menampilkan pesan "tidak ada hotel"
    return new Response(
      JSON.stringify({
        hotels: [],
        relatedcategory: [],
        pagination: { page: 1, totalPages: 0, totalHotels: 0 },
      }),
      {
        status: 200, // Penting untuk mengembalikan 200 agar SWR tidak menganggapnya error fatal
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } finally {
    if (client) {
      client.release(); // Pastikan koneksi dilepaskan kembali ke pool
    }
  }
}

// Tidak perlu export closeDb jika Anda tidak memanggilnya secara eksternal.
// Pool akan ditutup secara otomatis saat aplikasi dimatikan.
// export async function closeDb() {
//   await pool.end();
// }