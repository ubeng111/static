import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; // Impor dotenv untuk memuat .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve('certs', 'root.crt')) },
});

const cache = {};
const cacheTTL = 60 * 60 * 1000; // 1 hour

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

const LIMIT = 13;

export async function GET(req, { params }) {
  const { categoryslug } = params;
  if (!categoryslug) {
    return new Response(JSON.stringify({ message: 'Category slug is required' }), { status: 400 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  if (page < 1) {
    return new Response(JSON.stringify({ message: 'Page must be a positive number' }), { status: 400 });
  }

  const cacheKey = `hotels_${categoryslug}_page_${page}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return new Response(JSON.stringify(cachedData), { status: 200 });
  }

  const offset = (page - 1) * LIMIT;
  const client = await pool.connect();

  try {
    // Tidak ada validasi hirarki untuk categoryslug saja karena itu adalah level tertinggi di sini
    // Jika tidak ada hotel sama sekali untuk categoryslug, query utama akan menangani dengan 404

    const query = `
      WITH hotel_data AS (
        SELECT id, title, city, state, country, category, categoryslug, countryslug, stateslug, cityslug, hotelslug, img, location, ratings, numberOfReviews, numberrooms, overview, city_id, latitude, longitude
        FROM public.hotels
        WHERE categoryslug = $1
        ORDER BY id ASC
        LIMIT $2 OFFSET $3
      ),
      hotel_count AS (
        SELECT COUNT(*) AS total FROM public.hotels
        WHERE categoryslug = $1
      )
      SELECT hotel_data.*, hotel_count.total
      FROM hotel_data, hotel_count;
    `;
    const result = await client.query(query, [categoryslug, LIMIT, offset]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'No hotels found for this category' }), { status: 404 });
    }

    const totalHotels = parseInt(result.rows[0].total, 10);
    const totalPages = Math.ceil(totalHotels / LIMIT);

    // **PERBAIKAN DI SINI UNTUK relatedCountryQuery:**
    const relatedCountryQuery = `
      SELECT DISTINCT country, countryslug
      FROM public.hotels
      WHERE
        categoryslug = $1 AND
        country != '' AND
        countryslug IS NOT NULL AND
        countryslug ~ '^[a-z0-9-]+$' -- Pastikan countryslug valid
      GROUP BY country, countryslug  -- Kelompokkan berdasarkan country dan countryslug
      HAVING COUNT(id) > 0         -- Hanya sertakan country yang memiliki setidaknya satu hotel
      LIMIT 120
    `;
    const relatedCountryResult = await client.query(relatedCountryQuery, [categoryslug]);

    // Pembersihan data hotel (sama seperti yang sebelumnya saya jelaskan)
    const cleanHotels = result.rows.map(row => {
        if (row.id) {
            return {
                id: row.id, title: row.title, city: row.city, state: row.state, country: row.country,
                category: row.category, categoryslug: row.categoryslug, countryslug: row.countryslug,
                stateslug: row.stateslug, cityslug: row.cityslug, hotelslug: row.hotelslug,
                img: row.img, location: row.location, ratings: row.ratings,
                numberOfReviews: row.numberOfReviews, numberrooms: row.numberrooms, overview: row.overview,
                city_id: row.city_id, latitude: row.latitude, longitude: row.longitude,
            };
        }
        return null;
    }).filter(Boolean);

    const response = {
      hotels: cleanHotels,
      relatedcategory: relatedCountryResult.rows, // Ini adalah related countries, bukan related categories
      pagination: { page, totalPages, totalHotels },
    };

    setCache(cacheKey, response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error executing query', error.stack);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  } finally {
    client.release();
  }
}

export async function closeDb() {
  await pool.end();
}