import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { gzipSync } from 'zlib';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: {
    ca: fs.readFileSync(path.resolve('certs', 'root.crt')),
  },
});

const cache = {};
const cacheTTL = 60 * 60 * 1000;

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

export async function GET(req, { params }) {
  const { hotelslug } = params;
  if (!hotelslug) {
    return new Response(JSON.stringify({ message: 'Hotel slug is required' }), { status: 400 });
  }

  const url = new URL(req.url);
  const reset = url.searchParams.get('reset') === 'true';

  const cacheKey = `hotel_${hotelslug}`;
  const cachedData = getCache(cacheKey);
  if (cachedData && !reset) {
    const compressed = gzipSync(JSON.stringify(cachedData));
    return new Response(compressed, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip',
      },
    });
  }

  const client = await pool.connect();

  try {
    const hotelQuery = `
      SELECT id, title, city, state, country, category, categoryslug, countryslug, stateslug, cityslug, hotelslug, img, location, ratings, numberOfReviews, numberrooms, overview, city_id, latitude, longitude
      FROM public.hotels
      WHERE hotelslug = $1
      LIMIT 1;
    `;
    const hotelResult = await client.query(hotelQuery, [hotelslug]);

    if (hotelResult.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Hotel not found' }), { status: 404 });
    }

    const relatedHotelsQuery = `
      SELECT id, title, city, state, country, category, categoryslug, countryslug, stateslug, cityslug, hotelslug, img, location, ratings, numberOfReviews, numberrooms, overview, city_id, latitude, longitude
      FROM public.hotels
      WHERE city_id = $1 AND hotelslug != $2
      ORDER BY RANDOM()
      LIMIT 15;
    `;
    const relatedHotelsResult = await client.query(relatedHotelsQuery, [hotelResult.rows[0].city_id, hotelslug]);

    const response = {
      hotel: hotelResult.rows[0],
      relatedHotels: relatedHotelsResult.rows,
    };

    setCache(cacheKey, response);

    const compressed = gzipSync(JSON.stringify(response));
    return new Response(compressed, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip',
      },
    });
  } catch (error) {
    console.error('Error executing query:', error.stack);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  } finally {
    client.release();
  }
}

export async function closeDb() {
  await pool.end();
}