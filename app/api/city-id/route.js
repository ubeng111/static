import { NextResponse } from 'next/server';
import fs from 'fs/promises'; // For file system access
import path from 'path';     // For path manipulation
export const dynamic = 'force-dynamic';

// Path relatif ke file cities.json
// Ini akan mencari file di direktori 'data' di dalam root proyek Next.js Anda
const CITIES_JSON_PATH = path.join(process.cwd(), 'data', 'cities.json');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('city') || '';

    // Baca data dari file JSON
    const jsonData = await fs.readFile(CITIES_JSON_PATH, 'utf-8');
    const allCities = JSON.parse(jsonData);

    // Filter kota berdasarkan searchTerm (case-insensitive)
    const filteredCities = allCities.filter(item =>
      item.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Konversi `cityId` menjadi `city_id` agar konsisten dengan frontend
    const formattedCities = filteredCities.map(item => ({
      city_id: item.cityId, // Ubah nama kunci
      city: item.city,
      country: item.country
    }));

    // Batasi jumlah saran (opsional, untuk performa)
    const limitedCities = formattedCities.slice(0, 5); // Ambil 10 hasil teratas

    return NextResponse.json({ cities: limitedCities });

  } catch (error) {
    console.error('Error fetching cities from JSON:', error);
    // Kembalikan respons error yang sesuai
    if (error.code === 'ENOENT') { // File not found error
      return NextResponse.json({ message: 'City data file not found. Check path: ' + CITIES_JSON_PATH }, { status: 500 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}