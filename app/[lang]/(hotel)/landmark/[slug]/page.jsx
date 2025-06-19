// app/[lang]/landmark/[slug]/page.jsx
import { Suspense } from 'react';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import LandmarkClient from './LandmarkClient';
import Script from 'next/script';
import { getdictionary } from '@/public/dictionaries/get-dictionary'; // Menggunakan alias

export const dynamic = 'force-dynamic';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'root.crt')) },
});

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

  let title = metadataDict.landmarkPageTitleTemplate || 'Hotels near Landmark'; //
  let description = metadataDict.landmarkPageDescriptionTemplate || 'Find top hotels near popular landmarks with great deals and reviews.'; //
  let landmarkUrl = `https://hoteloza.com/${locale}/landmark/${slug}`; // URL Metadata dengan lang

  if (!slug || typeof slug !== 'string') {
    console.error('SERVER ERROR [page.jsx]: Invalid or missing slug:', slug);
    return {
      title: metadataDict.landmarkNotFoundTitle || 'Invalid Landmark | Hoteloza', //
      description: metadataDict.landmarkNotFoundDescription || 'The requested landmark was not found on Hoteloza.', //
      openGraph: {
        title: metadataDict.landmarkNotFoundTitle || 'Invalid Landmark | Hoteloza', //
        description: metadataDict.landmarkNotFoundDescription || 'The requested landmark was not found on Hoteloza.', //
        type: 'website',
        url: landmarkUrl,
      },
      alternates: {
        canonical: `https://hoteloza.com/${locale}`, // Canonical untuk error page juga dengan lang
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
      || `${category} Near ${landmarkName}, ${cityName}`; // 

    description = (metadataDict.landmarkPageDescriptionTemplate
      ?.replace("{category}", category)
      ?.replace("{landmarkName}", landmarkName)
      ?.replace("{cityName}", cityName))
      || `Find the best ${category.toLowerCase()} near ${landmarkName}, ${cityName}. Explore great deals on top accommodations with free WiFi and excellent amenities.`; //
  } else {
    description = metadataDict.landmarkNotFoundDescription || commonDict.noDestinationsFound || 'Discover top hotels near popular landmarks with exclusive deals and premium amenities on Hoteloza.'; //
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

  const currentLang = locale; // Lang saat ini

  const commonDict = dictionary?.common || {};
  const landmarkPageDict = dictionary?.landmarkPage || {};
  const navigationDict = dictionary?.navigation || {}; // Untuk Breadcrumb

  const landmarkData = await fetchLandmarkData(slug);
  // Mengganti commonDict.unknownLandmark dengan commonDict.unknownLocation yang ada di kamus
  const landmarkName = landmarkData?.landmarkName || commonDict.unknownLocation || 'Landmark'; //
  const cityName = landmarkData?.cityName || commonDict.unknownCity || 'Unknown City'; //
  const category = landmarkData?.category || commonDict.unknownCategory || 'Hotels'; //

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": (landmarkPageDict.topHotelsNear
        ?.replace("{category}", category)
        ?.replace("{landmarkName}", landmarkName)) || `${category} near ${landmarkName}, ${cityName}`, //
      "description": (landmarkPageDict.description
        ?.replace("{category}", category)
        ?.replace("{landmarkName}", landmarkName)
        ?.replace("{cityName}", cityName))
        || `Find the best ${category.toLowerCase()} near ${landmarkName}, ${cityName}. Explore great deals on top accommodations with free WiFi and excellent amenities.`, //
      "url": `https://hoteloza.com/${currentLang}/landmark/${slug}`, // URL Schema dengan lang
      "mainEntity": landmarkName !== (commonDict.unknownLocation || 'Landmark') ? { // Menggunakan commonDict.unknownLocation
        "@context": "https://schema.org",
        "@type": "Place",
        "name": landmarkName,
        "description": (landmarkPageDict.description
          ?.replace("{category}", category)
          ?.replace("{landmarkName}", landmarkName)
          ?.replace("{cityName}", cityName))
          || `Find the best ${category.toLowerCase()} near ${landmarkName}, ${cityName}. Explore great deals on top accommodations with free WiFi and excellent amenities.`, //
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityName,
          // Mengganti commonDict.unknownCountryCode dengan commonDict.unknownCountry yang ada di kamus
          "addressCountry": commonDict.unknownCountry || "US" //
        },
      } : undefined
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: navigationDict.home || 'Home', item: `https://hoteloza.com/${currentLang}` }, // URL Home dengan lang
        { '@type': 'ListItem', position: 2, name: landmarkPageDict.landmarks || 'Landmarks', item: `https://hoteloza.com/${currentLang}/landmark` }, // Asumsi ada halaman umum landmarks
        { '@type': 'ListItem', position: 3, name: landmarkName, item: `https://hoteloza.com/${currentLang}/landmark/${slug}` }, // URL Landmark dengan lang
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
      <Suspense fallback={<div>{landmarkPageDict.loadingHotel || commonDict.loadingHotel || `Loading ${landmarkName} search results...`}</div>}> {/* */}
        <LandmarkClient landmarkSlug={slug} dictionary={dictionary} currentLang={currentLang} />
      </Suspense>
      
    </>
  );
}