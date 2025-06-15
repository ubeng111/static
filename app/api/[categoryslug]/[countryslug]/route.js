import { Pool } from 'pg'; //
import fs from 'fs'; //
import path from 'path'; //
import 'dotenv/config'; //

const pool = new Pool({ //
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS, //
  ssl: { ca: fs.readFileSync(path.resolve('certs', 'root.crt')) }, //
});

const cache = {}; //
const cacheTTL = 60 * 60 * 1000; // 1 hour //

function getCache(key) { //
  const cachedData = cache[key]; //
  if (cachedData && Date.now() - cachedData.timestamp < cacheTTL) { //
    return cachedData.data; //
  }
  return null; //
}

function setCache(key, data) { //
  cache[key] = { data, timestamp: Date.now() }; //
}

const LIMIT = 13; //

export async function GET(req, { params }) { //
  const { categoryslug, countryslug } = await params; //
  if (!categoryslug || !countryslug) { //
    return new Response(JSON.stringify({ message: 'Category and country slugs are required' }), { status: 400 }); //
  }

  const url = new URL(req.url); //
  const page = parseInt(url.searchParams.get('page') || '1', 10); //
  if (page < 1) { //
    return new Response(JSON.stringify({ message: 'Page must be a positive number' }), { status: 400 }); //
  }

  const cacheKey = `hotels_${categoryslug}_${countryslug}_page_${page}`; //
  const cachedData = getCache(cacheKey); //
  if (cachedData) { //
    return new Response(JSON.stringify(cachedData), { status: 200 }); //
  }

  const offset = (page - 1) * LIMIT; //
  const client = await pool.connect(); //

  try {
    // Validasi hierarki tetap ada: memastikan kombinasi kategori dan negara ini valid di database
    const validateHierarchy = await client.query( //
      `SELECT 1 FROM public.hotels WHERE categoryslug = $1 AND countryslug = $2 LIMIT 1`, //
      [categoryslug, countryslug] //
    );
    if (validateHierarchy.rows.length === 0) { //
      // Jika kombinasi categoryslug dan countryslug tidak ditemukan sama sekali di hotel mana pun
      // Ini menandakan URL/hierarki dasar tidak valid
      return new Response(JSON.stringify({ message: 'Invalid category or country combination' }), { status: 404 }); // Menggunakan 404 karena resource hierarki tidak ditemukan
    }

    const query = `
      WITH hotel_data AS (
        SELECT id, title, city, state, country, category, categoryslug, countryslug, stateslug, cityslug, hotelslug, img, location, ratings, numberOfReviews, numberrooms, overview, city_id, latitude, longitude
        FROM public.hotels
        WHERE categoryslug = $1 AND countryslug = $2
        ORDER BY id ASC
        LIMIT $3 OFFSET $4
      ),
      hotel_count AS (
        SELECT COUNT(*) AS total FROM public.hotels
        WHERE categoryslug = $1 AND countryslug = $2
      )
      SELECT hotel_data.*, hotel_count.total
      FROM hotel_data, hotel_count;
    `; //
    const result = await client.query(query, [categoryslug, countryslug, LIMIT, offset]); //

    // PENTING: Periksa apakah ada data hotel yang sebenarnya (selain baris total count jika ada)
    // Asumsi: Jika result.rows kosong, berarti tidak ada hotel.
    // Jika result.rows hanya berisi baris dengan 'total' tetapi tanpa 'id' hotel, itu juga berarti tidak ada hotel.
    const actualHotelRows = result.rows.filter(row => row.id !== undefined);

    if (actualHotelRows.length === 0) {
      // Jika setelah query, tidak ada hotel yang ditemukan (termasuk jika hanya ada baris 'total' dengan nilai 0)
      return new Response(JSON.stringify({ message: 'No hotels found for this specific query' }), { status: 404 });
    }

    // `result.rows[0].total` akan selalu ada jika `validateHierarchy` lolos,
    // karena query `hotel_count` akan selalu mengembalikan satu baris dengan total.
    const totalHotels = parseInt(result.rows[0].total, 10); //
    const totalPages = Math.ceil(totalHotels / LIMIT); //

    const relatedStateQuery = `
      SELECT DISTINCT state, stateslug
      FROM public.hotels
      WHERE categoryslug = $1 AND countryslug = $2 AND state != ''
      LIMIT 40
    `; //
    const relatedStateResult = await client.query(relatedStateQuery, [categoryslug, countryslug]); //

    const response = {
      hotels: JSON.parse(JSON.stringify(actualHotelRows)), // Pastikan hanya data hotel yang diambil
      relatedcountry: JSON.parse(JSON.stringify(relatedStateResult.rows)), //
      pagination: { page, totalPages, totalHotels }, //
    };

    setCache(cacheKey, response); //

    return new Response(JSON.stringify(response), {
      status: 200, // Status 200 OK karena data ditemukan (minimal 1 hotel)
      headers: { 'Content-Type': 'application/json' }, //
    });
  } catch (error) {
    console.error('Error executing query', error.stack); //
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 }); //
  } finally {
    client.release(); //
  }
}

export async function closeDb() { //
  await pool.end(); //
}