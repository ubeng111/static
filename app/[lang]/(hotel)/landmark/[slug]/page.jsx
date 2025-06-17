// app/[lang]/landmark/[slug]/page.jsx
import { Suspense } from 'react';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import LandmarkClient from './LandmarkClient';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary';

// Hapus `export const dynamic = 'force-dynamic';` untuk mengaktifkan ISR.

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'root.crt')) },
});

// Fungsi yang dapat digunakan kembali untuk mengambil data landmark
async function fetchLandmarkData(slug) {
  try {
    const client = await pool.connect();
    try {
      const landmarkQuery = `
        SELECT name AS landmark_name, city AS city_name, category
        FROM landmarks
        WHERE slug = $1
        LIMIT 1
      `;
      const landmarkResult = await client.query(landmarkQuery, [slug]);
      console.log('SERVER DEBUG [page.jsx]: Landmark query result:', landmarkResult.rows);

      if (landmarkResult.rows.length) {
        const data = landmarkResult.rows[0];
        return {
          landmarkName: data.landmark_name,
          cityName: data.city_name,
          category: data.category,
        };
      }
      return null;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('SERVER ERROR [page.jsx]: Failed to fetch landmark data:', error);
    return null;
  }
}

// === BARU/MODIFIKASI: generateStaticParams untuk ISR ===
// Fungsi ini memberi tahu Next.js slug mana yang harus di-pra-render pada waktu build.
// Ini akan mengambil sejumlah terbatas slug dari database Anda untuk menghindari 'Maximum call stack size exceeded'.
export async function generateStaticParams() {
  const client = await pool.connect();
  try {
    // --- MODIFIKASI: Batasi jumlah slug yang diambil untuk generasi statis ---
    // Ambil hanya 1000 slug teratas (sesuaikan angka ini sesuai kebutuhan Anda).
    // Anda bisa menambahkan klausa ORDER BY jika ada kriteria popularitas/prioritas.
    const result = await client.query('SELECT slug FROM landmarks LIMIT 1000'); 

    // Contoh: Dapatkan bahasa yang didukung dari konfigurasi atau database Anda.
    // Jika Anda memiliki sistem bahasa yang dinamis, pastikan ini terisi dengan benar.
    const supportedLangs = ['en', 'es', 'fr']; 
    let params = [];
    for (const lang of supportedLangs) {
      params = params.concat(result.rows.map((row) => ({
        lang: lang, // Tambahkan parameter bahasa
        slug: row.slug,
      })));
    }
    console.log('SERVER DEBUG [page.jsx]: generateStaticParams generated:', params.length, 'params');
    return params;
  } catch (error) {
    console.error('SERVER ERROR [page.jsx]: Failed to generate static params:', error);
    return []; // Kembalikan array kosong jika ada error
  } finally {
    client.release();
  }
}

export async function generateMetadata({ params }) {
  const { slug, lang: locale } = params;
  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const commonDict = dictionary?.common || {};
  const landmarkPageDict = dictionary?.landmarkPage || {};

  let title = metadataDict.landmarkPageTitleTemplate || 'Hotels near Landmark';
  let description = metadataDict.landmarkPageDescriptionTemplate || 'Find top hotels near popular landmarks with great deals and reviews.';
  let landmarkUrl = `https://hoteloza.com/${locale}/landmark/${slug}`;

  if (!slug || typeof slug !== 'string') {
    console.error('SERVER ERROR [page.jsx]: Invalid or missing slug:', slug);
    return {
      title: metadataDict.landmarkNotFoundTitle || 'Invalid Landmark | Hoteloza',
      description: metadataDict.landmarkNotFoundDescription || 'The requested landmark was not found on Hoteloza.',
      openGraph: {
        title: metadataDict.landmarkNotFoundTitle || 'Invalid Landmark | Hoteloza',
        description: metadataDict.landmarkNotFoundDescription || 'The requested landmark was not found on Hoteloza.',
        type: 'website',
        url: landmarkUrl,
      },
      alternates: {
        canonical: `https://hoteloza.com/${locale}`,
      },
    };
  }

  const landmarkData = await fetchLandmarkData(slug);
  if (landmarkData) {
    const { landmarkName, cityName, category } = landmarkData;
    title = (landmarkPageDict.topHotelsNear
      ?.replace("{category}", category)
      ?.replace("{landmarkName}", landmarkName)
      ?.replace("{cityName}", cityName))
      || `${category} Near ${landmarkName}, ${cityName}`;

    description = (metadataDict.landmarkPageDescriptionTemplate
      ?.replace("{category}", category)
      ?.replace("{landmarkName}", landmarkName)
      ?.replace("{cityName}", cityName))
      || `Find the best ${category.toLowerCase()} near ${landmarkName}, ${cityName}. Explore great deals on top accommodations with free WiFi and excellent amenities.`;
  } else {
    description = metadataDict.landmarkNotFoundDescription || commonDict.noDestinationsFound || 'Discover top hotels near popular landmarks with exclusive deals and premium amenities on Hoteloza.';
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: landmarkUrl,
    },
    alternates: {
      canonical: landmarkUrl,
    },
  };
}

export default async function LandmarkSlugPage({ params }) {
  const { slug, lang: locale } = params;
  console.log('SERVER DEBUG [page.jsx]: Received slug from URL params:', slug);

  const dictionary = await getdictionary(locale);

  const currentLang = locale;

  const commonDict = dictionary?.common || {};
  const landmarkPageDict = dictionary?.landmarkPage || {};
  const navigationDict = dictionary?.navigation || {};

  const landmarkData = await fetchLandmarkData(slug); // Ini akan berjalan pada waktu build/revalidate.
  const landmarkName = landmarkData?.landmarkName || commonDict.unknownLocation || 'Landmark';
  const cityName = landmarkData?.cityName || commonDict.unknownCity || 'Unknown City';
  const category = landmarkData?.category || commonDict.unknownCategory || 'Hotels';

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": (landmarkPageDict.topHotelsNear
        ?.replace("{category}", category)
        ?.replace("{landmarkName}", landmarkName)) || `${category} near ${landmarkName}, ${cityName}`,
      "description": (landmarkPageDict.description
        ?.replace("{category}", category)
        ?.replace("{landmarkName}", landmarkName)
        ?.replace("{cityName}", cityName))
        || `Find the best ${category.toLowerCase()} near ${landmarkName}, ${cityName}. Explore great deals on top accommodations with free WiFi and excellent amenities.`,
      "url": `https://hoteloza.com/${currentLang}/landmark/${slug}`,
      "mainEntity": landmarkName !== (commonDict.unknownLocation || 'Landmark') ? {
        "@context": "https://schema.org",
        "@type": "Place",
        "name": landmarkName,
        "description": (landmarkPageDict.description
          ?.replace("{category}", category)
          ?.replace("{landmarkName}", landmarkName)
          ?.replace("{cityName}", cityName))
          || `Find the best ${category.toLowerCase()} near ${landmarkName}, ${cityName}. Explore great deals on top accommodations with free WiFi and excellent amenities.`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityName,
          "addressCountry": commonDict.unknownCountry || "US"
        },
      } : undefined
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: navigationDict.home || 'Home', item: `https://hoteloza.com/${currentLang}` },
        { '@type': 'ListItem', position: 2, name: landmarkPageDict.landmarks || 'Landmarks', item: `https://hoteloza.com/${currentLang}/landmark` },
        { '@type': 'ListItem', position: 3, name: landmarkName, item: `https://hoteloza.com/${currentLang}/landmark/${slug}` },
      ],
    },
  ];

  return (
    <>
      <Script
        id="landmark-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <div className="header-margin"></div>
      <Suspense fallback={<div>{landmarkPageDict.loadingHotel || commonDict.loadingHotel || `Loading ${landmarkName} search results...`}</div>}>
        <LandmarkClient landmarkSlug={slug} dictionary={dictionary} currentLang={currentLang} />
      </Suspense>

    </>
  );
}

// === BARU: revalidate export ===
// Ini akan meregenerasi halaman setiap 3600 detik (1 jam) jika ada permintaan.
// Anda bisa mengatur nilai yang berbeda atau menggunakan `0` untuk merevalidasi pada setiap permintaan (mirip SSR).
export const revalidate = 3600; // Merevalidasi setiap jam