// route.js (category level)
import { Pool } from "pg";
import fs from "fs";
import path from "path";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve("certs", "root.crt")) },
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
    return new Response(JSON.stringify({ message: "Category slug is required" }), { status: 400 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  if (page < 1) {
    return new Response(JSON.stringify({ message: "Page must be a positive number" }), { status: 400 });
  }

  const cacheKey = `hotels_${categoryslug}_page_${page}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return new Response(JSON.stringify(cachedData), { status: 200 });
  }

  const offset = (page - 1) * LIMIT;
  const client = await pool.connect();

  try {
    const query = `
      WITH hotel_data AS (
        SELECT * FROM public.hotels
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
      return new Response(JSON.stringify({ message: "No hotels found for this category" }), { status: 404 });
    }

    const totalHotels = parseInt(result.rows[0].total, 10);
    const totalPages = Math.ceil(totalHotels / LIMIT);

    const relatedCountryQuery = `
      SELECT DISTINCT country, countryslug, 
             (SELECT COUNT(*) FROM public.hotels h WHERE h.categoryslug = $1 AND h.country = c.country) > 0 AS hasHotels
      FROM public.hotels c
      WHERE categoryslug = $1 AND country != ''
      LIMIT 120
    `;
    const relatedCountryResult = await client.query(relatedCountryQuery, [categoryslug]);

    const response = {
      hotels: result.rows.slice(0, -1),
      relatedcategory: relatedCountryResult.rows,
      pagination: { page, totalPages, totalHotels },
    };

    setCache(cacheKey, response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error executing query", error.stack);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  } finally {
    client.release();
  }
}

export async function closeDb() {
  await pool.end();
}