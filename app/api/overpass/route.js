// app/api/overpass/route.js
import { gzipSync } from 'zlib';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = searchParams.get('data');
    if (!data) {
      return new Response(JSON.stringify({ error: 'Query data diperlukan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const url = `https://overpass.kumi.systems/api/interpreter?data=${data}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json', 'Accept-Encoding': 'gzip' },
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error: ${response.status} - ${text.slice(0, 100)}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Invalid content-type: ${contentType} - ${text.slice(0, 100)}`);
    }
    const text = await response.text();
    const compressed = gzipSync(text);
    return new Response(compressed, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip',
      },
    });
  } catch (error) {
    console.error('Error proxying kumi.systems:', error.message);
    return new Response(JSON.stringify({ error: 'Gagal mengambil data landmark', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}