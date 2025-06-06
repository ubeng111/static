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
  let client;

  try {
    // 1. Validasi awal categoryslug: Jika categoryslug tidak ada di URL, itu adalah permintaan yang buruk.
    if (!categoryslug) {
      return new Response(JSON.stringify({ message: 'category slug is required' }), {
        status: 400, // Bad Request
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const url = new URL(req.url);
    let page = parseInt(url.searchParams.get('page') || '1', 10);

    // 2. Validasi nomor halaman: Jika page bukan angka atau kurang dari 1, itu adalah permintaan yang buruk.
    if (isNaN(page) || page < 1) {
      return new Response(JSON.stringify({ message: 'Invalid page number. Page must be a positive integer.' }), {
        status: 400, // Bad Request
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const offset = (page - 1) * LIMIT;
    client = await getClient();

    // 3. Query untuk mendapatkan total jumlah hotel terlebih dahulu.
    // Ini adalah langkah kritis untuk menentukan apakah categoryslug itu "ada" atau "tidak ada".
    const countQuery = `
      SELECT COUNT(*)
      FROM public.hotels
      WHERE categoryslug = $1
    `;
    const countResult = await client.query(countQuery, [categoryslug]);
    const totalHotels = parseInt(countResult.rows[0].count, 10);

    // 4. **Kondisi Kunci untuk 404:** Jika TIDAK ADA hotel sama sekali untuk categoryslug ini.
    // Ini berarti categoryslug yang diminta itu "tidak valid" dalam konteks data yang tersedia.
    if (totalHotels === 0) {
      return new Response(
        JSON.stringify({ message: `No hotels found for category: ${categoryslug}. This category slug might be invalid or empty.` }),
        {
          status: 404, // Not Found: Category slug yang diberikan tidak memiliki data
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // 5. Jika ada hotel (totalHotels > 0), lanjutkan untuk mengambil data per halaman.
    // Ini adalah kondisi untuk halaman yang seharusnya 200 OK.
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

    // Hitung total halaman (ini akan selalu > 0 jika kita sampai sini)
    const totalPages = Math.ceil(totalHotels / LIMIT);

    // 6. Opsional: Tangani kasus jika 'page' yang diminta melebihi totalPages yang tersedia.
    // Ini juga bisa dianggap 404, karena halaman tersebut tidak akan memiliki konten.
    if (page > totalPages) {
        return new Response(
            JSON.stringify({ message: `Page ${page} for category ${categoryslug} does not exist.` }),
            {
                status: 404, // Not Found: Nomor halaman di luar jangkauan
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }


    // Query untuk mendapatkan related categorys
    const relatedCategoryQuery = `
      SELECT category, categoryslug
      FROM public.hotels
      WHERE categoryslug != $1
      GROUP BY category, categoryslug
      LIMIT 10;
    `;
    const relatedCategoryResult = await client.query(relatedCategoryQuery, [categoryslug]);


    return new Response(
      JSON.stringify({
        hotels: result.rows,
        relatedcategory: relatedCategoryResult.rows,
        pagination: {
          page: page,
          totalPages,
          totalHotels,
        },
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
        status: 500, // Internal Server Error
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}