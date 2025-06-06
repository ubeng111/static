import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Validate environment variable
if (!process.env.DATABASE_URL_SUBTLE_CUSCUS) {
  throw new Error('DATABASE_URL_SUBTLE_CUSCUS is not defined');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: {
    ca: fs.readFileSync(path.resolve('certs', 'root.crt')),
  },
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

// Make LIMIT configurable, default to 13
const LIMIT = parseInt(process.env.HOTELS_PER_PAGE || '12', 10);

export async function GET(req, { params }) {
  const { cityslug } = params;
  if (!cityslug) {
    return new Response(JSON.stringify({ message: 'City slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  if (page < 1 || isNaN(page)) {
    return new Response(JSON.stringify({ message: 'Page must be a positive number' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cacheKey = `city_${cityslug}_page_${page}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return new Response(JSON.stringify(cachedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const offset = (page - 1) * LIMIT;
  const client = await pool.connect();

  try {
    // Always fetch country, state, and total count for the cityslug
    const cityInfoQuery = `
      SELECT DISTINCT country, state, countryslug, stateslug,
             (SELECT COUNT(*) FROM public.hotels WHERE cityslug = $1) AS total_count
      FROM public.hotels
      WHERE cityslug = $1
      LIMIT 1;
    `;
    const cityInfoResult = await client.query(cityInfoQuery, [cityslug]);

    // If cityInfoResult.rows is empty, it means the cityslug itself is invalid or has no associated data
    if (cityInfoResult.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'City not found or no data for this city' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { country, state, countryslug, stateslug, total_count } = cityInfoResult.rows[0];
    const totalHotels = parseInt(total_count || 0, 10);
    const totalPages = Math.ceil(totalHotels / LIMIT);

    // Fetch hotels for the current page
    const hotelsQuery = `
      SELECT id, title, city, state, country, category, categoryslug, countryslug, stateslug, cityslug, hotelslug,
             img, location, ratings, numberOfReviews, numberrooms, overview, city_id, latitude, longitude
      FROM public.hotels
      WHERE cityslug = $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3;
    `;
    const hotelsResult = await client.query(hotelsQuery, [cityslug, LIMIT, offset]);

    // Fetch related cities from the same state
    const relatedCityQuery = `
      SELECT DISTINCT city, city_id, cityslug
      FROM public.hotels
      WHERE state = $1 AND cityslug != $2 AND city != ''
      GROUP BY city, city_id, cityslug
      ORDER BY city ASC
      LIMIT 40;
    `;
    const relatedCityResult = await client.query(relatedCityQuery, [state, cityslug]);

    const response = {
      hotels: hotelsResult.rows.map(row => ({
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
      })),
      relatedcity: relatedCityResult.rows,
      pagination: { page, totalPages, totalHotels },
      // Breadcrumb data is now guaranteed from cityInfoResult.rows[0]
      breadcrumb: { country, state, countryslug, stateslug },
    };

    setCache(cacheKey, response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error executing query:', error.stack);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    client.release();
  }
}

export async function closeDb() {
  await pool.end();
}