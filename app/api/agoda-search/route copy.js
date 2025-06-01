import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: 'postgresql://iwan:bUq8DFcXvg1yRFU9iLGhww@messy-coyote-10965.j77.aws-ap-southeast-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
  ssl: { ca: fs.readFileSync(path.resolve('certs', 'root.crt')) },
});

const AGODA_API_URL = 'http://affiliateapi7643.agoda.com/affiliateservice/lt_v1';
const SITE_ID = '1935361';  // Ganti dengan Site ID Agoda Anda
const API_KEY = 'e0cde9f0-8ac7-4881-89a0-f7e6431fb47f';  // Ganti dengan API Key Agoda Anda

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      city_id,
      checkInDate,
      checkOutDate,
      numberOfAdults = 2,
      numberOfChildren = 0,
      numberOfRooms = 1,
      currency = 'USD',
      language = 'en-us',
    } = body;

    // Validasi parameter yang diterima
    if (!city_id || !checkInDate || !checkOutDate) {
      return new Response(
        JSON.stringify({ message: 'City ID, tanggal check-in, dan check-out diperlukan' }),
        { status: 400 }
      );
    }

    // Mendapatkan nama kota berdasarkan city_id
    const client = await pool.connect();
    let cityName = 'Lokasi Tidak Diketahui';
    try {
      const cityQuery = 'SELECT city FROM public.hotels WHERE city_id = $1 LIMIT 1';
      const cityResult = await client.query(cityQuery, [city_id]);
      cityName = cityResult.rows[0]?.city || cityName;  // Jika tidak ditemukan, gunakan 'Lokasi Tidak Diketahui'
    } finally {
      client.release();
    }

    // Mempersiapkan payload untuk API Agoda
    const payload = {
      criteria: {
        additional: {
          currency,
          language,
          maxResult: 100,  // Menetapkan jumlah hasil maksimal (dapat disesuaikan)
          occupancy: { numberOfAdult: numberOfAdults, numberOfChildren: numberOfChildren },
          sortBy: 'Recommended',  // Mengurutkan berdasarkan harga
        },
        checkInDate,
        checkOutDate,
        cityId: parseInt(city_id, 10),  // Menggunakan cityId untuk API Agoda
      },
    };

    // Mengirim permintaan ke API Agoda
    const response = await fetch(AGODA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip,deflate',
        Authorization: `${SITE_ID}:${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    // Mengambil respons dari API Agoda dan memeriksa adanya error
    const data = await response.json();
    if (!response.ok || data.error) {
      return new Response(
        JSON.stringify({ message: data.error?.message || 'Error API Agoda' }),
        { status: response.status }
      );
    }

    // Mengolah hasil pencarian hotel dari API Agoda
    const hotels = (data.results || []).map((hotel) => ({
      hotelId: hotel.hotelId,
      hotelName: hotel.hotelName,
      imageURL: hotel.imageURL,
      reviewScore: hotel.reviewScore,
      reviewCount: hotel.reviewCount,
      starRating: hotel.starRating,
      landingURL: hotel.landingURL,
      dailyRate: hotel.dailyRate,
      cityName,  // Menambahkan nama kota pada hasil pencarian
    }));

    // Mengembalikan hasil pencarian hotel beserta nama kota
    return new Response(JSON.stringify({ hotels, cityName }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: 'Error server' }), { status: 500 });
  }
}