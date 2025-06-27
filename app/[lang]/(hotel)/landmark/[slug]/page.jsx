// app/[lang]/landmark/[slug]/page.jsx
import { Suspense } from 'react';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; // Pastikan .env dimuat jika belum di next.config.js
import LandmarkClient from './LandmarkClient'; // Asumsi ini adalah Client Component
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary';
import { notFound } from 'next/navigation';

// REVALIDATE PAGE (ISR - Incremental Static Regeneration)
// Halaman ini akan di-revalidate setiap 1 tahun (jika ada permintaan masuk)
// untuk memastikan metadata dan konten selalu segar dari DB tanpa perlu rebuild.
export const revalidate = 31536000; // 1 tahun dalam detik (60 * 60 * 24 * 365)

// Inisialisasi Pool koneksi database
// Perhatian: Untuk lingkungan serverless, pertimbangkan Connection Pooling as a Service
// atau pengelolaan koneksi yang lebih cermat untuk menghindari 'too many clients'
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'root.crt')) },
});

// Reusable function to fetch landmark data
async function fetchLandmarkData(slug) {
  // Console.log di server-side (build/runtime)
  console.log('SERVER INFO: Attempting to fetch landmark data for slug:', slug);
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
      console.log('SERVER DEBUG: Landmark query result:', landmarkResult.rows);

      if (landmarkResult.rows.length > 0) {
        const data = landmarkResult.rows[0];
        return {
          landmarkName: data.landmark_name,
          cityName: data.city_name,
          category: data.category,
        };
      }
      return null;
    } finally {
      client.release(); // Pastikan klien dilepaskan
    }
  } catch (error) {
    // Tangani error koneksi DB atau query
    console.error('SERVER ERROR: Failed to fetch landmark data from database:', error);
    return null;
  }
}

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => {
  const sanitized = slug?.replace(/[^a-zA-Z0-9-]/g, '') || '';
  if (!sanitized && slug) {
    console.warn(`sanitizeSlug: Input '${slug}' resulted in empty/null slug.`);
  }
  return sanitized;
};

// Helper function to format slugs for display
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';


// generateMetadata untuk SEO
export async function generateMetadata({ params }) {
  const { slug, lang: locale } = params;
  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const commonDict = dictionary?.common || {};
  const landmarkPageDict = dictionary?.landmarkPage || {};

  const baseUrl = 'https://hoteloza.com'; // Base URL untuk canonical dan OG
  let landmarkUrl = `${baseUrl}/${locale}/landmark/${slug}`;

  // Default fallback metadata
  let title = metadataDict.landmarkNotFoundTitle || 'Landmark Not Found | Hoteloza';
  let description = metadataDict.landmarkNotFoundDescription || 'The requested landmark was not found or is invalid.';

  if (!slug || typeof slug !== 'string') {
    console.error('SERVER ERROR: generateMetadata received invalid or missing slug:', slug);
    return {
      title,
      description,
      openGraph: { title, description, type: 'website', url: landmarkUrl },
      alternates: { canonical: `${baseUrl}/${locale}` }, // Canonical ke halaman utama bahasa
    };
  }

  const landmarkData = await fetchLandmarkData(slug);

  if (landmarkData) {
    const { landmarkName, cityName, category } = landmarkData;
    title = (landmarkPageDict.topHotelsNear
      ?.replace("{category}", category || commonDict.unknownCategory || 'Hotels')
      ?.replace("{landmarkName}", landmarkName || commonDict.unknownLocation || 'Landmark')
      ?.replace("{cityName}", cityName || commonDict.unknownCity || 'City'))
      || `${category || 'Hotels'} Near ${landmarkName || 'Landmark'}, ${cityName || 'City'}`;

    description = (metadataDict.landmarkPageDescriptionTemplate
      ?.replace("{category}", category?.toLowerCase() || commonDict.unknownCategory?.toLowerCase() || 'hotels')
      ?.replace("{landmarkName}", landmarkName || commonDict.unknownLocation || 'Landmark')
      ?.replace("{cityName}", cityName || commonDict.unknownCity || 'City'))
      || `Find the best ${category?.toLowerCase() || 'hotels'} near ${landmarkName || 'Landmark'}, ${cityName || 'City'}. Explore great deals on top accommodations with free WiFi and excellent amenities.`;

    landmarkUrl = `${baseUrl}/${locale}/landmark/${slug}`; // URL yang benar jika data ditemukan
  } else {
    // Jika landmarkData tidak ditemukan, gunakan fallback yang sudah ada
    console.warn(`SERVER WARN: No data found for landmark slug: ${slug}. Using default metadata.`);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: landmarkUrl,
      images: [`${baseUrl}/opengraph-image.jpg`], // Ganti dengan gambar OG default/spesifik jika ada
    },
    alternates: {
      canonical: landmarkUrl,
      languages: {
        'en-US': `${baseUrl}/en-US/landmark/${slug}`,
        'id-ID': `${baseUrl}/id-ID/landmark/${slug}`,
        'x-default': `${baseUrl}/en-US/landmark/${slug}`,
      },
    },
    keywords: [
      `${title.toLowerCase()}`, // Contoh keyword dari judul
      `hotels near ${landmarkData?.landmarkName?.toLowerCase() || 'landmark'}`,
      `${landmarkData?.cityName?.toLowerCase() || 'city'} hotels`,
      `${landmarkData?.category?.toLowerCase() || 'accommodation'} deals`,
      "Hoteloza",
      "hotel booking",
      "travel deals"
    ],
  };
}

// generateStaticParams untuk SSG (Static Site Generation)
// Next.js akan memanggil ini di waktu build untuk menentukan rute mana yang harus dibuat statis.
export async function generateStaticParams() {
  console.warn("SERVER INFO: generateStaticParams for landmarks will build only 10 slugs for now.");
  const LIMIT = 10; // Batasi hanya 10 slug untuk dibangun statis

  try {
    const client = await pool.connect();
    try {
      // Ambil hanya sejumlah slug yang terbatas (misal 10) dari database
      const slugsQuery = `SELECT slug FROM landmarks LIMIT $1`;
      const slugsResult = await client.query(slugsQuery, [LIMIT]);
      const landmarkSlugs = slugsResult.rows.map(row => row.slug);
      console.log(`SERVER INFO: Fetched ${landmarkSlugs.length} slugs for generateStaticParams:`, landmarkSlugs);

      // Kombinasikan dengan bahasa yang didukung
      const supportedLangs = ['en', 'id', 'us']; // Ganti dengan daftar bahasa yang sebenarnya
      const params = [];
      for (const lang of supportedLangs) {
        for (const slug of landmarkSlugs) {
          params.push({ lang: lang, slug: slug });
        }
      }
      return params;
    } finally {
      client.release();
    }
  } catch (error) {
    // Tangani error koneksi DB atau query saat build time
    console.error('SERVER ERROR: Failed to fetch slugs for generateStaticParams:', error);
    // Kembalikan daftar fallback yang sangat kecil atau kosong jika terjadi error
    console.warn("SERVER WARN: Returning a small fallback set for generateStaticParams due to error fetching from DB.");
    return [
      { lang: 'en', slug: 'eiffel-tower' },
      { lang: 'id', slug: 'monas' },
    ];
  }
}


// Komponen halaman utama
export default async function LandmarkSlugPage({ params }) {
  const { slug, lang: locale } = params;
  console.log('SERVER INFO: Rendering LandmarkSlugPage for slug:', slug, 'and locale:', locale);

  const dictionary = await getdictionary(locale);

  // Fetch data again for the page content, this will hit the cache if revalidate is active
  const landmarkData = await fetchLandmarkData(slug);

  if (!landmarkData) {
    console.warn(`SERVER WARN: No landmark data found for slug: ${slug}. Calling notFound().`);
    notFound(); // Redirect to 404 page if landmark not found
  }

  const { landmarkName, cityName, category } = landmarkData;

  const commonDict = dictionary?.common || {};
  const landmarkPageDict = dictionary?.landmarkPage || {};
  const navigationDict = dictionary?.navigation || {};

  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${locale}/landmark/${slug}`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": (landmarkPageDict.topHotelsNear
        ?.replace("{category}", category || commonDict.unknownCategory || 'Hotels')
        ?.replace("{landmarkName}", landmarkName || commonDict.unknownLocation || 'Landmark'))
        || `${category || 'Hotels'} near ${landmarkName || 'Landmark'}, ${cityName || 'City'}`,
      "description": (landmarkPageDict.description
        ?.replace("{category}", category?.toLowerCase() || commonDict.unknownCategory?.toLowerCase() || 'hotels')
        ?.replace("{landmarkName}", landmarkName || commonDict.unknownLocation || 'Landmark')
        ?.replace("{cityName}", cityName || commonDict.unknownCity || 'City'))
        || `Find the best ${category?.toLowerCase() || 'hotels'} near ${landmarkName || 'Landmark'}, ${cityName || 'City'}. Explore great deals on top accommodations with free WiFi and excellent amenities.`,
      "url": currentUrl,
      "mainEntity": landmarkName !== (commonDict.unknownLocation || 'Landmark') ? {
        "@context": "https://schema.org",
        "@type": "Place",
        "name": landmarkName,
        "description": (landmarkPageDict.description
          ?.replace("{category}", category?.toLowerCase())
          ?.replace("{landmarkName}", landmarkName)
          ?.replace("{cityName}", cityName))
          || `Popular ${category?.toLowerCase() || 'site'} in ${cityName || 'city'}.`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityName || commonDict.unknownCity || "Unknown City",
          "addressCountry": commonDict.unknownCountry || "US" // Asumsi negara default
        },
      } : undefined
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: navigationDict.home || 'Home', item: `${baseUrl}/${locale}` },
        { '@type': 'ListItem', position: 2, name: landmarkPageDict.landmarks || 'Landmarks', item: `${baseUrl}/${locale}/landmark` },
        { '@type': 'ListItem', position: 3, name: landmarkName, item: currentUrl },
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
      {/* Bungkus LandmarkClient dengan Suspense untuk menampilkan fallback saat loading */}
      <Suspense fallback={<div>{landmarkPageDict.loadingHotel || commonDict.loadingHotel || `Memuat hasil pencarian ${landmarkName}...`}</div>}>
        <LandmarkClient landmarkSlug={slug} dictionary={dictionary} currentLang={locale} />
      </Suspense>
    </>
  );
}