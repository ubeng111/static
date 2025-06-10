// page.jsx
import { Suspense } from 'react';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import LandmarkClient from './LandmarkClient';
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import CallToActions from "@/components/common/CallToActions";
import Script from 'next/script';

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
  const { slug } = params;
  let title = 'Hotels near Landmark';
  let description = 'Find top hotels near popular landmarks with great deals and reviews.';
  let landmarkUrl = `https://hoteloza.com/landmark/${slug}`;

  // Validate slug
  if (!slug || typeof slug !== 'string') {
    console.error('SERVER ERROR [page.jsx]: Invalid or missing slug:', slug);
    return {
      title: 'Invalid Landmark | Hoteloza',
      description: 'The requested landmark was not found on Hoteloza.',
      openGraph: {
        title: 'Invalid Landmark | Hoteloza',
        description: 'The requested landmark was not found on Hoteloza.',
        type: 'website',
        url: landmarkUrl,
      },
      // Add canonical for invalid slug as well
      alternates: {
        canonical: `https://hoteloza.com/`, // Or a generic error page if one exists
      },
    };
  }

  const landmarkData = await fetchLandmarkData(slug);
  if (landmarkData) {
    const { landmarkName, cityName, category } = landmarkData;
    title = `${category} Near ${landmarkName}, ${cityName}`;
    description = `Find the best ${category.toLowerCase()} near ${landmarkName}, ${cityName}. Explore great deals on top accommodations with free WiFi and excellent amenities.`;
  } else {
    // Fallback description
    description = 'Discover top hotels near popular landmarks with exclusive deals and premium amenities on Hoteloza.';
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
  const { slug } = params;
  console.log('SERVER DEBUG [page.jsx]: Received slug from URL params:', slug);

  // Fetch landmark data for schema
  const landmarkData = await fetchLandmarkData(slug);
  const landmarkName = landmarkData?.landmarkName || 'Landmark';
  const cityName = landmarkData?.cityName || 'Unknown City';
  const category = landmarkData?.category || 'Hotels';

  // Define schema (without breadcrumb)
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${category} near ${landmarkName}, ${cityName}`,
      "description": `Find the best ${category.toLowerCase()} near ${landmarkName}, ${cityName}. Explore great deals on top accommodations with free WiFi and excellent amenities.`,
      "url": `https://hoteloza.com/landmark/${slug}`,
      "mainEntity": landmarkName !== 'Landmark' ? {
        "@context": "https://schema.org",
        "@type": "Place",
        "name": landmarkName,
        "description": `Find the best ${category.toLowerCase()} near ${landmarkName}, ${cityName}. Explore great deals on top accommodations with free WiFi and excellent amenities.`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityName,
          "addressCountry": "US"
        },
      } : undefined
    }
  ];

  return (
    <>
      <Script
        id="landmark-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="header-margin"></div>
      <Header11 />
<Suspense fallback={<div>Loading {landmarkName} search results...</div>}>
        <LandmarkClient landmarkSlug={slug} />
      </Suspense>
      <CallToActions />
      <DefaultFooter />
    </>
  );
}