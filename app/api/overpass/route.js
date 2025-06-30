
// Deklarasikan cache di luar handler POST
const cache = {}; // Gunakan objek JavaScript sederhana untuk cache
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 jam dalam milidetik. Sesuaikan jika diperlukan.

// Fungsi helper untuk mendapatkan data dari cache
function getCache(key) {
  const cachedItem = cache[key];
  if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_TTL)) {
    console.log(`SERVER DEBUG [overpass/route.js]: Cache hit for key: ${key.substring(0, 50)}...`);
    return cachedItem.data;
  }
  console.log(`SERVER DEBUG [overpass/route.js]: Cache miss or expired for key: ${key.substring(0, 50)}...`);
  return null;
}

// Fungsi helper untuk menyimpan data ke cache
function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() };
  console.log(`SERVER DEBUG [overpass/route.js]: Data cached for key: ${key.substring(0, 50)}...`);
}

export async function POST(request) {
  try {
    const { overpassQuery } = await request.json(); // Ambil query dari body JSON

    if (!overpassQuery) {
      console.error('SERVER ERROR [overpass/route.js]: Query data diperlukan di body permintaan.');
      return new Response(JSON.stringify({ error: 'Query data diperlukan di body permintaan.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Buat kunci cache unik dari query Overpass
    // Potong query untuk kunci cache agar tidak terlalu panjang di log
    const cacheKey = `overpass_${overpassQuery.substring(0, 200)}`; 
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // Memberi tahu klien untuk cache respons selama 1 jam
        },
      });
    }

    // Jika tidak ada di cache atau sudah expired, panggil Overpass API eksternal
    // *** PERBAIKAN UTAMA DI SINI: Ubah URL Overpass API ***
    const overpassApiUrl = 'https://overpass-api.de/api/interpreter'; 
    console.log(`SERVER DEBUG [overpass/route.js]: Calling external Overpass API at: ${overpassApiUrl}`);

    const response = await fetch(overpassApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        // *** PERBAIKAN: Hapus header Accept-Encoding jika tidak diperlukan penanganan manual ***
        // 'Accept-Encoding': 'gzip,deflate', 
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SERVER ERROR [overpass/route.js]: Overpass API responded with non-OK status: ${response.status} - ${response.statusText}. Response: ${errorText.slice(0, 500)}`);
      throw new Error(`API error dari Overpass: ${response.status} - ${response.statusText}. Detail: ${errorText.slice(0, 200)}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error(`SERVER ERROR [overpass/route.js]: Invalid content-type received from Overpass: ${contentType}. Body: ${text.slice(0, 500)}`);
      throw new Error(`Content-type tidak valid dari Overpass: ${contentType}`);
    }

    const data = await response.json();
    setCache(cacheKey, data); // Simpan respons yang berhasil ke cache

    console.log('SERVER DEBUG [overpass/route.js]: Successfully fetched data from Overpass API and cached.');
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('SERVER FATAL ERROR [overpass/route.js]: Uncaught exception in /api/overpass proxy:', error.message, error.stack);
    return new Response(JSON.stringify({ error: 'Gagal mengambil data landmark', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}