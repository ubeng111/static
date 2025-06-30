import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; // Impor dotenv untuk memuat .env

// SSL certificate validation
const certPath = path.resolve('certs', 'root.crt');
let sslConfig = {};
try {
  if (fs.existsSync(certPath)) {
    sslConfig = { ca: fs.readFileSync(certPath) };
  } else {
    console.warn('SSL certificate not found at expected path. Falling back to non-SSL connection or environment specific SSL.');
    // If you explicitly want to disable SSL for development and your DB supports it,
    // you might set ssl: false here. For production, this is generally not recommended.
    // sslConfig = false; // Example: Disable SSL
  }
} catch (err) {
  console.error('Error reading SSL certificate:', err.message);
  // Fallback if certificate reading fails for other reasons (e.g., permissions)
  // sslConfig = false; // Example: Disable SSL on error
}


// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: sslConfig,
  max: 10,
  idleTimeoutMillis: 30000,
  // Increased connection timeout for debugging
  connectionTimeoutMillis: 10000, // Was 5000, increased to 10 seconds
});

// In-memory cache
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

const LIMIT = 12;

export async function GET(req) {
  const url = new URL(req.url);
  const cityName = url.searchParams.get('city');
  const cityId = url.searchParams.get('city_id');
  const page = parseInt(url.searchParams.get('page')) || 1;

  // Input validation
  if (!cityName && !cityId) {
    return new Response(JSON.stringify({ message: 'City name or city ID is required' }), { status: 400 });
  }

  if (page < 1) {
    return new Response(JSON.stringify({ message: 'Page must be a positive number' }), { status: 400 });
  }

  let client; // Declare client here
  try {
    client = await pool.connect(); // Attempt to connect to the pool

    if (cityName) {
      if (typeof cityName !== 'string' || cityName.length < 2) {
        return new Response(JSON.stringify({ message: 'City name must be at least 2 characters' }), { status: 400 });
      }
      // Removed special character check as it might be too restrictive depending on actual city names
      // if (cityName.includes('%') || cityName.includes('_')) {
      //   return new Response(JSON.stringify({ message: 'Invalid characters in city name' }), { status: 400 });
      // }

      const cacheKey = `city_${cityName.toLowerCase()}_page_${page}`;
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        return new Response(JSON.stringify(cachedData), { status: 200 });
      }

      const query = `
        SELECT DISTINCT city, city_id, country
        FROM public.hotels
        WHERE LOWER(city) LIKE LOWER($1)
        LIMIT 10
      `;
      const result = await client.query(query, [`%${cityName}%`]);

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ message: 'City not found' }), { status: 404 });
      }

      const response = { cities: result.rows };
      setCache(cacheKey, response);
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } else if (cityId) {
      if (!/^\d+$/.test(cityId)) {
        return new Response(JSON.stringify({ message: 'Invalid city ID format' }), { status: 400 });
      }

      const cacheKey = `cityId_${cityId}_page_${page}`;
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        return new Response(JSON.stringify(cachedData), { status: 200 });
      }

      const query = `
        WITH hotel_data AS (
          SELECT *
          FROM public.hotels
          WHERE city_id = $1
          ORDER BY id ASC
          LIMIT $2 OFFSET $3
        ),
        hotel_count AS (
          SELECT COUNT(*) AS total
          FROM public.hotels
          WHERE city_id = $1
        )
        SELECT hotel_data.*, hotel_count.total
        FROM hotel_data, hotel_count;
      `;
      const offset = (page - 1) * LIMIT;
      const result = await client.query(query, [cityId, LIMIT, offset]);

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ message: 'No hotels found for this city ID' }), { status: 404 });
      }

      const totalHotels = parseInt(result.rows[0].total, 10);
      const totalPages = Math.ceil(totalHotels / LIMIT);

      const response = {
        hotels: result.rows.map(row => {
          const { total, ...hotelData } = row; // Remove 'total' from hotel data
          return hotelData;
        }),
        pagination: { page, totalPages, totalHotels },
      };

      setCache(cacheKey, response);
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error executing query:', {
      message: error.message,
      stack: error.stack,
      queryParams: { cityName, cityId, page },
      poolStatus: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount,
      },
    });
    // Return a more generic server error message for the client
    return new Response(
      JSON.stringify({ message: 'Server error occurred while fetching data.', error: error.message }),
      { status: 500 }
    );
  } finally {
    // Ensure the client is released back to the pool
    if (client) {
      client.release();
    }
  }
}

export async function closeDb() {
  await pool.end();
}
