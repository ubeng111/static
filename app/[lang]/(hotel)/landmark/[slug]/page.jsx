// app/[lang]/landmark/[slug]/page.jsx
import { Suspense } from 'react';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import LandmarkClient from './LandmarkClient';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary';

// Menonaktifkan static generation sepenuhnya untuk halaman ini
// Jika ingin SSG dengan fallback, gunakan 'force-static' dan tangani notFound
// Namun, karena ada masalah dengan generateStaticParams, kita coba force-dynamic
// untuk memastikan halaman bisa diakses, lalu perbaiki generateStaticParams.
// export const dynamic = 'force-static'; // Hapus atau biarkan terkomentar untuk sementara
export const dynamic = 'force-dynamic'; // Mengaktifkan SSR untuk setiap permintaan, atau on-demand generation jika generateStaticParams tidak menemukan path.
export const revalidate = 3600; // Revalidate every 1 hour (jika dynamic bukan 'force-dynamic')

// Initialize database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'root.crt')) },
});

// Fetch all possible landmarks for static generation
async function fetchAllLandmarks() {
  try {
    const client = await pool.connect();
    try {
      // PERBAIKAN KRITIS: Pastikan kueri ini hanya mengambil slug yang valid.
      // Jika database Anda kosong atau hanya berisi slug tidak valid, ini akan menjadi masalah.
      // Tambahkan filter untuk slug yang tidak NULL dan tidak kosong.
      // Batasi jumlah untuk menghindari masalah "Maximum call stack size exceeded".
      const query = 'SELECT slug FROM landmarks WHERE slug IS NOT NULL AND slug != \'\' LIMIT 10'; // Batasi untuk 10 landmark teratas yang valid
      const result = await client.query(query);
      const validSlugs = result.rows.map((row) => row.slug);

      // Log untuk debugging di Vercel/Cloudflare Pages
      console.log('SERVER DEBUG [page.jsx]: Fetched slugs for generateStaticParams:', validSlugs);

      return validSlugs;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching landmarks for static params:', error);
    return []; // Kembalikan array kosong jika ada error
  }
}

// Define supported languages
const supportedLanguages = ['en', 'id', 'es'];

// Generate static paths for all landmarks and languages
// Pastikan ini mengembalikan format yang benar: { lang, slug }
export async function generateStaticParams() {
  const slugs = await fetchAllLandmarks();

  // PERBAIKAN KRITIS: Pastikan slugs tidak kosong.
  // Jika slugs kosong, generateStaticParams harus mengembalikan array kosong.
  if (slugs.length === 0) {
    console.warn('generateStaticParams: No valid slugs found. Returning empty array.');
    return [];
  }

  // Jika slugs ada, buat kombinasi lang dan slug
  return slugs.flatMap((slug) =>
    supportedLanguages.map((lang) => ({ lang, slug }))
  );
}

// Reusable function to fetch landmark data
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

export async function generateMetadata({ params }) {
  const { slug, lang: locale } = params;
  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const commonDict = dictionary?.common || {};
  const landmarkPageDict = dictionary?.landmarkPage || {};

  let title = metadataDict.landmarkPageTitleTemplate || 'Hotels near Landmark';
  let description = metadataDict.landmarkPageDescriptionTemplate || 'Find top hotels near popular landmarks with great deals and reviews.';
  let landmarkUrl = `https://hoteloza.com/${locale}/landmark/${slug}`;

  if (!slug || typeof slug !== 'string' || slug === '-1') { // Tambahkan cek untuk '-1'
    console.error('SERVER ERROR [page.jsx]: Invalid or missing slug in metadata:', slug);
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
    // Jika landmarkData tidak ditemukan, gunakan fallback metadata
    title = metadataDict.landmarkNotFoundTitle || 'Landmark Not Found | Hoteloza';
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

  // Perbaiki logika jika slug adalah '-1' atau tidak valid
  if (!slug || typeof slug !== 'string' || slug === '-1') {
    // Anda bisa mengarahkan ke halaman 404 atau menampilkan pesan error
    // notFound(); // Jika Anda ingin me-trigger Next.js notFound()
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>{commonDict.invalidLandmark || "Invalid Landmark"}</h1>
        <p>{commonDict.landmarkNotFoundMessage || "The requested landmark could not be found."}</p>
      </div>
    );
  }

  const landmarkData = await fetchLandmarkData(slug);
  // Tangani kasus di mana landmarkData adalah null (slug tidak ditemukan)
  if (!landmarkData) {
      // Anda bisa mengarahkan ke halaman 404 atau menampilkan pesan error spesifik
      // notFound(); // Contoh untuk menampilkan halaman 404 Next.js
      return (
          <div style={{ padding: '50px', textAlign: 'center' }}>
              <h1>{commonDict.landmarkNotFoundTitle || "Landmark Not Found"}</h1>
              <p>{commonDict.landmarkNotFoundMessage || "The requested landmark could not be found."}</p>
          </div>
      );
  }

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