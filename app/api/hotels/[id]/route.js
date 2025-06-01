import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  const { id } = params; 

  const client = new Client({
    connectionString: 'postgresql://johan:Gi-NW-eDKWlI3AnO991wog@first-hisser-4909.jxf.gcp-asia-southeast1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
    ssl: {
      ca: fs.readFileSync(path.resolve('certs', 'root.crt')),
      rejectUnauthorized: true,
    },
  });

  try {
    await client.connect();

    // Query untuk mengambil hotel berdasarkan ID
    const result = await client.query('SELECT * FROM public.hotels WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Hotel not found' }), {
        status: 404,
      });
    }

    // Ambil hotel terkait berdasarkan kategori
    const relatedHotelsQuery = `
      SELECT * FROM public.hotels 
      WHERE city = $1 AND id != $2 
      LIMIT 5
    `;
    const relatedHotelsResult = await client.query(relatedHotelsQuery, [result.rows[0].city, id]);

    return new Response(JSON.stringify({
      hotel: result.rows[0],
      relatedHotels: relatedHotelsResult.rows,
    }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching hotel data:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  } finally {
    await client.end();
  }
}