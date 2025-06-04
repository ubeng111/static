import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve('certs', 'root.crt')) },
});

const cache = {};
const cacheTTL = 60 * 5 * 1000;

function getCache(key) {
  const cachedData = cache[key];
  if (cachedData && Date.now() - cachedData.timestamp < cacheTTL) {
    return cachedData.data;
  }
  return null;
}

function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() };
}

function clearCacheForCategoryAndCountry(categoryslug, countryslug, stateslug) {
  Object.keys(cache).forEach((key) => {
    if (key.startsWith(`hotels_${categoryslug}_${countryslug}_${stateslug}`)) {
      delete cache[key];
      console.log(`Cache dihapus untuk: ${key}`);
    }
  });
}

const LIMIT = 13;

export async function GET(req, { params }) {
  const { categoryslug, countryslug, stateslug } = await params; // Await params

  if (!categoryslug || !countryslug || !stateslug) {
    return new Response(JSON.stringify({ message: 'Category, country, dan state slugs diperlukan' }), { status: 400 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  if (page < 1) {
    return new Response(JSON.stringify({ message: 'Nomor halaman harus positif' }), { status: 400 });
  }

  const cacheKey = `hotels_${categoryslug}_${countryslug}_${stateslug}_page_${page}`;
  // Cache dinonaktifkan untuk debugging
  // const cachedData = getCache(cacheKey);
  // if (cachedData) {
  //   return new Response(JSON.stringify(cachedData), { status: 200 });
  // }

  const offset = (page - 1) * LIMIT;
  const client = await pool.connect();

  try {
    // Validasi hirarki
    const validateHierarchy = await client.query(
      `SELECT 1 FROM public.hotels WHERE categoryslug = $1 AND countryslug = $2 AND stateslug = $3 AND id IS NOT NULL AND title IS NOT NULL AND hotelslug IS NOT NULL LIMIT 1`,
      [categoryslug, countryslug, stateslug]
    );
    if (validateHierarchy.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Hirarki tidak valid' }), { status: 400 });
    }

    // Query utama untuk hotel
    const query = `
      WITH hotel_data AS (
        SELECT id, title, city, state, country, category, categoryslug, countryslug, stateslug, cityslug, hotelslug, img, location, ratings, numberOfReviews, numberrooms, overview, city_id, latitude, longitude
        FROM public.hotels
        WHERE categoryslug = $1 AND countryslug = $2 AND stateslug = $3 AND id IS NOT NULL AND title IS NOT NULL AND hotelslug IS NOT NULL
        ORDER BY id ASC
        LIMIT $4 OFFSET $5
      ),
      hotel_count AS (
        SELECT COUNT(*) AS total FROM public.hotels
        WHERE categoryslug = $1 AND countryslug = $2 AND stateslug = $3 AND id IS NOT NULL AND title IS NOT NULL AND hotelslug IS NOT NULL
      )
      SELECT hotel_data.*, hotel_count.total
      FROM hotel_data, hotel_count;
    `;
    const result = await client.query(query, [categoryslug, countryslug, stateslug, LIMIT, offset]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Tidak ada hotel ditemukan untuk state ini' }), { status: 404 });
    }

    const totalHotels = parseInt(result.rows[0].total, 10);
    const totalPages = Math.ceil(totalHotels / LIMIT);

    // Query untuk kota terkait
    const relatedCityQuery = `
      SELECT DISTINCT h.city, h.cityslug
      FROM public.hotels h
      WHERE
        h.categoryslug = $1 AND
        h.countryslug = $2 AND
        h.stateslug = $3 AND
        h.city != '' AND
        h.cityslug IS NOT NULL AND
        h.cityslug ~ '^[a-z0-9-]+$'
        AND h.id IS NOT NULL
        AND h.title IS NOT NULL
        AND h.hotelslug IS NOT NULL
      GROUP BY h.city, h.cityslug
      HAVING COUNT(h.id) > 0
      ORDER BY h.city
      LIMIT 40;
    `;
    const relatedCityResult = await client.query(relatedCityQuery, [categoryslug, countryslug, stateslug]);

    const response = {
      hotels: JSON.parse(JSON.stringify(result.rows.slice(0, -1))),
      relatedstate: JSON.parse(JSON.stringify(relatedCityResult.rows)),
      pagination: { page, totalPages, totalHotels },
    };

    // Hapus cache sebelum menyimpan data baru
    clearCacheForCategoryAndCountry(categoryslug, countryslug, stateslug);
    setCache(cacheKey, response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error saat menjalankan query:', error.stack);
    return new Response(JSON.stringify({ message: 'Error server' }), { status: 500 });
  } finally {
    client.release();
  }
}

export async function closeDb() {
  await pool.end();
}

export { clearCacheForCategoryAndCountry };