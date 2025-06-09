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

export const dynamic = 'force-dynamic';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'root.crt')) },
});

export async function generateMetadata({ params }) {
  const { slug } = params;
  let title = 'Hotels near Landmark';
  let description = 'Find top hotels near popular landmarks with great deals and reviews.';
  let landmarkName = '';
  let cityName = '';
  let category = '';
  let landmarkUrl = `/landmark/${slug}`;

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

      if (landmarkResult.rows.length) {
        const data = landmarkResult.rows[0];
        landmarkName = data.landmark_name;
        cityName = data.city_name;
        category = data.category;

        title = `${category} near ${landmarkName}, ${cityName}`;
        description = `Find the best ${category} near ${landmarkName}, ${cityName}. Explore great deals on top accommodations with free WiFi and excellent amenities.`;
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('SERVER ERROR [page.jsx]: Failed to fetch landmark for metadata:', error);
  }

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": title,
      "description": description,
      "url": `https://hoteloza.com/landmark/${slug}`,
      "mainEntity": landmarkName ? {
        "@context": "https://schema.org",
        "@type": "Place",
        "name": landmarkName,
        "description": description,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityName,
          "addressCountry": "US" // <--- Diubah dari "GB" ke "US"
        },
      } : undefined
    }
  ];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: landmarkUrl,
    },
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
      },
    ],
  };
}

export default async function LandmarkSlugPage({ params }) {
  const { slug } = params;
  console.log('SERVER DEBUG [page.jsx]: Received slug from URL params:', slug);

  return (
    <>
      <div className="header-margin"></div>
      <Header11 />
      <Suspense fallback={<div>Memuat hasil pencarian landmark...</div>}>
        <LandmarkClient landmarkSlug={slug} />
      </Suspense>
      <CallToActions />
      <DefaultFooter />
    </>
  );
}