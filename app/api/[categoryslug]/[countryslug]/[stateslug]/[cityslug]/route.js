// route.js
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Inisialisasi Pool koneksi PostgreSQL.
// Menggunakan DATABASE_URL_SUBTLE_CUSCUS dari environment variable
// dan sertifikat SSL untuk koneksi aman.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve('certs', 'root.crt')) },
});

// Cache untuk menyimpan hasil query agar performa lebih cepat.
// Data akan disimpan selama 1 jam (60 * 60 * 1000 milidetik).
const cache = {};
const cacheTTL = 60 * 60 * 1000; // 1 hour

// Fungsi untuk mendapatkan data dari cache.
// Mengembalikan data jika ada dan belum kadaluarsa, selain itu null.
function getCache(key) {
  const cachedData = cache[key];
  if (cachedData && Date.now() - cachedData.timestamp < cacheTTL) {
    return cachedData.data;
  }
  return null;
}

// Fungsi untuk menyimpan data ke cache.
function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() };
}

// Batasan jumlah hotel per halaman.
const LIMIT = 13;

// Fungsi GET yang akan dipanggil saat ada request HTTP GET.
// req: objek request, { params }: parameter dari URL (slugs).
export async function GET(req, { params }) {
  const { categoryslug, countryslug, stateslug, cityslug } = params;

  // Validasi: Pastikan semua slug yang diperlukan ada.
  if (!categoryslug || !countryslug || !stateslug || !cityslug) {
    return new Response(JSON.stringify({ message: 'All slugs are required' }), { status: 400 });
  }

  // Ambil nomor halaman dari query parameter URL, defaultnya 1.
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  // Validasi: Pastikan nomor halaman positif.
  if (page < 1) {
    return new Response(JSON.stringify({ message: 'Page must be a positive number' }), { status: 400 });
  }

  // Buat kunci cache unik untuk setiap kombinasi slug dan halaman.
  const cacheKey = `hotels_${categoryslug}_${countryslug}_${stateslug}_${cityslug}_page_${page}`;
  const cachedData = getCache(cacheKey);

  // Jika data ada di cache, kembalikan langsung dari cache.
  if (cachedData) {
    return new Response(JSON.stringify(cachedData), { status: 200 });
  }

  // Hitung offset untuk pagination.
  const offset = (page - 1) * LIMIT;
  // Dapatkan koneksi client dari pool.
  const client = await pool.connect();

  try {
    // Validasi hirarki slug: Pastikan kombinasi category/country/state/city ini ada di database.
    const validateHierarchy = await client.query(
      `SELECT 1 FROM public.hotels WHERE categoryslug = $1 AND countryslug = $2 AND stateslug = $3 AND cityslug = $4 LIMIT 1`,
      [categoryslug, countryslug, stateslug, cityslug]
    );

    // Jika tidak ada data untuk hirarki ini, kembalikan error 400.
    if (validateHierarchy.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Invalid hierarchy' }), { status: 400 });
    }

    // Query utama untuk mengambil data hotel dan total count.
    // Menggunakan CTE (Common Table Expressions) 'hotel_data' dan 'hotel_count'.
    const query = `
      WITH hotel_data AS (
        SELECT id, title, city, state, country, category, categoryslug, countryslug, stateslug, cityslug, hotelslug, img, location, ratings, numberOfReviews, numberrooms, overview, city_id, latitude, longitude
        FROM public.hotels
        WHERE categoryslug = $1 AND countryslug = $2 AND stateslug = $3 AND cityslug = $4
        ORDER BY id ASC
        LIMIT $5 OFFSET $6
      ),
      hotel_count AS (
        SELECT COUNT(*) AS total FROM public.hotels
        WHERE categoryslug = $1 AND countryslug = $2 AND stateslug = $3 AND cityslug = $4
      )
      SELECT hotel_data.*, hotel_count.total
      FROM hotel_data, hotel_count;
    `;

    const result = await client.query(query, [categoryslug, countryslug, stateslug, cityslug, LIMIT, offset]);

    // Hitung total hotel dan total halaman.
    const totalHotels = result.rows.length > 0 ? parseInt(result.rows[0].total, 10) : 0;
    const totalPages = Math.ceil(totalHotels / LIMIT);

    // Bersihkan data hotel, hilangkan properti 'total' dari setiap objek hotel.
    const cleanHotels = result.rows.map(row => {
      // Pastikan hanya objek hotel, bukan row yang berisi 'total'
      if (row.id) { // cek properti id untuk memastikan ini data hotel
        return {
          id: row.id,
          title: row.title,
          city: row.city,
          state: row.state,
          country: row.country,
          category: row.category,
          categoryslug: row.categoryslug,
          countryslug: row.countryslug,
          stateslug: row.stateslug,
          cityslug: row.cityslug,
          hotelslug: row.hotelslug,
          img: row.img,
          location: row.location,
          ratings: row.ratings,
          numberOfReviews: row.numberOfReviews,
          numberrooms: row.numberrooms,
          overview: row.overview,
          city_id: row.city_id,
          latitude: row.latitude,
          longitude: row.longitude,
        };
      }
      return null;
    }).filter(Boolean); // Filter null entries

    // Query untuk mengambil kota-kota terkait.
    // **PERBAIKAN UTAMA DI SINI:** Menambahkan GROUP BY dan HAVING COUNT(id) > 0
    // untuk memastikan bahwa kota yang ditampilkan benar-benar memiliki setidaknya satu hotel.
    const relatedCityQuery = `
      SELECT DISTINCT city, cityslug
      FROM public.hotels
      WHERE
        categoryslug = $1 AND
        countryslug = $2 AND
        stateslug = $3 AND
        cityslug != $4 AND
        city != '' AND
        cityslug IS NOT NULL AND
        cityslug ~ '^[a-z0-9-]+$'
      GROUP BY city, cityslug -- Grouping berdasarkan kota dan slug
      HAVING COUNT(id) > 0   -- Hanya sertakan kota yang memiliki setidaknya satu hotel
      LIMIT 40;
    `;
    const relatedCityResult = await client.query(relatedCityQuery, [categoryslug, countryslug, stateslug, cityslug]);

    // Susun objek response.
    const response = {
      hotels: cleanHotels,
      relatedcity: relatedCityResult.rows,
      pagination: { page, totalPages, totalHotels },
    };

    // Simpan response ke cache.
    setCache(cacheKey, response);

    // Kirim response JSON.
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': cachedData ? 'HIT' : 'MISS', // Menunjukkan apakah dari cache
      },
    });
  } catch (error) {
    console.error('Error executing query', error.stack);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  } finally {
    // Pastikan koneksi dilepaskan kembali ke pool setelah selesai.
    client.release();
  }
}

// Fungsi untuk menutup koneksi database pool.
export async function closeDb() {
  await pool.end();
}