import { gzipSync } from 'zlib'; // Anda bisa menghapus ini jika tidak lagi digunakan secara manual. Saya biarkan jika ada kode lain yang mungkin menggunakannya.

// Deklarasikan cache di luar handler POST
const cache = {}; // Gunakan objek JavaScript sederhana untuk cache
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 jam dalam milidetik. Sesuaikan jika diperlukan.

// Fungsi helper untuk mendapatkan data dari cache
function getCache(key) {
  const cachedItem = cache[key];
  if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_TTL)) {
    return cachedItem.data;
  }
  return null;
}

// Fungsi helper untuk menyimpan data ke cache
function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() };
}

export async function POST(request) {
  try {
    const { overpassQuery } = await request.json(); // Ambil query dari body JSON

    if (!overpassQuery) {
      return new Response(JSON.stringify({ error: 'Query data diperlukan di body permintaan.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Buat kunci cache unik dari query Overpass
    const cacheKey = `overpass_${overpassQuery}`;
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      // Jika data ada di cache dan masih valid, segera kembalikan
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // Memberi tahu klien untuk cache respons selama 1 jam
        },
      });
    }

    // Jika tidak ada di cache atau sudah expired, panggil Overpass API eksternal
    const overpassApiUrl = 'https://overpass.kumi.systems/api/interpreter';

    const response = await fetch(overpassApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Format yang dibutuhkan Overpass API untuk body 'data='
        'Accept': 'application/json',
      },
      body: `data=${encodeURIComponent(overpassQuery)}`, // Kirim query di body sebagai form-urlencoded
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Overpass Proxy Error: ${response.status} - ${response.statusText}. Response: ${errorText}`);
      throw new Error(`API error dari Overpass: ${response.status} - ${response.statusText}. Detail: ${errorText.slice(0, 200)}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error(`Overpass Proxy Error: Invalid content-type diterima: ${contentType}. Body: ${text.slice(0, 200)}`);
      throw new Error(`Content-type tidak valid dari Overpass: ${contentType}`);
    }

    const data = await response.json(); // Mengurai respons JSON dari Overpass API
    setCache(cacheKey, data); // Simpan respons yang berhasil ke cache

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Memberi tahu klien untuk cache respons selama 1 jam
      },
    });

  } catch (error) {
    console.error('Error di /api/overpass proxy:', error.message);
    return new Response(JSON.stringify({ error: 'Gagal mengambil data landmark', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}