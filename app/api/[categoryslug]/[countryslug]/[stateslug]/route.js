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
  const { categoryslug, countryslug, stateslug } = params;
  if (!categoryslug || !countryslug || !stateslug) {
    return new Response(JSON.stringify({ message: 'Category, country, and state slugs are required' }), { status: 400 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  if (page < 1) {
    return new Response(JSON.stringify({ message: 'Page must be a positive number' }), { status: 400 });
  }

  const cacheKey = `hotels_${categoryslug}_${countryslug}_${stateslug}_page_${page}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return new Response(JSON.stringify(cachedData), { status: 200 });
  }

  const offset = (page - 1) * LIMIT;
  const client = await pool.connect();

  try {
    const validateHierarchy = await client.query(
      `SELECT 1 FROM public.hotels WHERE categoryslug = $1 AND countryslug = $2 AND stateslug = $3 LIMIT 1`,
      [categoryslug, countryslug, stateslug]
    );
    if (validateHierarchy.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Invalid category, country, or state' }), { status: 400 });
    }

    const query = `
      WITH hotel_data AS (
        SELECT * FROM public.hotels
        WHERE categoryslug = $1 AND countryslug = $2 AND stateslug = $3
        ORDER BY id ASC
        LIMIT $4 OFFSET $5
      ),
      hotel_count AS (
        SELECT COUNT(*) AS total FROM public.hotels
        WHERE categoryslug = $1 AND countryslug = $2 AND stateslug = $3
      )
      SELECT hotel_data.*, hotel_count.total
      FROM hotel_data, hotel_count;
    `;
    const result = await client.query(query, [categoryslug, countryslug, stateslug, LIMIT, offset]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'No hotels found for this state' }), { status: 404 });
    }

    const totalHotels = parseInt(result.rows[0].total, 10);
    const totalPages = Math.ceil(totalHotels / LIMIT);

    // **PERBAIKAN DI SINI:**
    const relatedCityQuery = `
      SELECT city, cityslug
      FROM public.hotels
      WHERE
        categoryslug = $1 AND
        countryslug = $2 AND
        stateslug = $3 AND
        city != '' AND
        cityslug IS NOT NULL AND
        cityslug ~ '^[a-z0-9-]+$'
      GROUP BY city, cityslug  -- Grouping berdasarkan kota dan slug kota
      HAVING COUNT(id) > 0   -- Hanya sertakan kota yang memiliki setidaknya satu hotel
      LIMIT 40;
    `;
    const relatedCityResult = await client.query(relatedCityQuery, [categoryslug, countryslug, stateslug]);

    const response = {
      // Perhatikan: result.rows.slice(0, -1) ini mungkin bermasalah
      // jika `total` ada di baris terakhir dan Anda tidak memprosesnya
      // dengan benar. Pastikan `cleanHotels` difilter dengan baik.
      hotels: result.rows.map(row => {
        // Hanya sertakan properti hotel yang relevan, buang 'total'
        if (row.id) { // Cek apakah ini baris data hotel, bukan baris total
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
      }).filter(Boolean), // Filter entri null jika ada

      relatedcity: relatedCityResult.rows, // Mengganti relatedstate dengan relatedcity agar konsisten dengan Relatedcity88.jsx
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