// scripts/populateSlugs.js
require('dotenv').config({ path: './.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// Fungsi createSlug yang sudah diperbarui dengan strict: true
function createSlug(name) {
  if (!name) return '';
  return slugify(name, {
    lower: true,
    strict: true, // <-- PENTING: Ubah menjadi TRUE untuk menghilangkan karakter non-ASCII yang tidak ditransliterasi
    locale: 'en',
    remove: /[*+~.()'"!:@/]/g // Menghilangkan kurung dan karakter lain yang tidak diinginkan
  });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve(__dirname, '..', 'certs', 'root.crt')) },
});

async function populateSlugs() {
  const client = await pool.connect();
  try {
    console.log('Fetching existing landmarks to populate slugs...');
    const { rows: landmarks } = await client.query('SELECT id, name FROM landmarks');

    for (const landmark of landmarks) {
      let newSlug = createSlug(landmark.name); // Buat slug awal

      try {
        // Coba update dengan slug awal
        await client.query('UPDATE landmarks SET slug = $1 WHERE id = $2', [newSlug, landmark.id]);
        console.log(`Updated landmark ID: ${landmark.id}, Name: "${landmark.name}" with Slug: "${newSlug}"`);
      } catch (error) {
        // Tangani jika terjadi duplikasi slug
        if (error.code === '23505' && error.constraint === 'unique_slug') {
          // Jika slug duplikat, tambahkan ID landmark ke slug untuk membuatnya unik
          const uniqueSlug = `${newSlug}-${landmark.id}`;
          console.warn(`Duplicate slug "${newSlug}" for "${landmark.name}" (ID: ${landmark.id}). Retrying with unique slug: "${uniqueSlug}"`);

          // Coba update lagi dengan slug yang sudah unik
          await client.query('UPDATE landmarks SET slug = $1 WHERE id = $2', [uniqueSlug, landmark.id]);
          console.log(`Successfully updated with unique slug: "${uniqueSlug}"`);
        } else {
          // Jika error lain, lempar kembali
          throw error;
        }
      }
    }
    console.log('Successfully populated slugs for all landmarks.');
  } catch (error) {
    console.error('Error populating slugs:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

populateSlugs();