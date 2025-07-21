// app/[lang]/landmark/[slug]/page.jsx
import { Suspense } from 'react';
import 'dotenv/config';
import LandmarkClient from './LandmarkClient';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function fetchLandmarkData(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/landmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ landmark_slug: slug }),
      next: { revalidate: 31536000 }
    });

    if (!res.ok) {
      console.error(`SERVER ERROR [page.jsx]: Failed to fetch landmark data from /api/landmark. Status: ${res.status}`);
      return null;
    }
    const data = await res.json();

    if (data && data.landmarkName) {
      return {
        landmarkName: data.landmarkName,
        cityName: data.cityName,
        category: data.category,
      };
    }
    return null;
  } catch (error) {
    console.error('SERVER ERROR [page.jsx]: Failed to fetch landmark data:', error);
    return null;
  }
}

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

export async function generateMetadata({ params }) {
  // MODIFIKASI SESUAI PERMINTAAN: Menambahkan 'await' pada params
  const awaitedParams = await params;
  const { slug } = awaitedParams;

  let title = 'Hotels near Landmark';
  let description = 'Find top hotels near popular landmarks with great deals and reviews.';
  let landmarkUrl = `https://hoteloza.com/landmark/${slug}`;

  if (!slug || typeof slug !== 'string') {
    console.error('SERVER DEBUG [page.jsx]: Invalid or missing slug:', slug);
    return {
      title: 'Invalid Landmark | Hoteloza',
      description: 'The requested landmark was not found on Hoteloza.',
      openGraph: {
        title: 'Invalid Landmark | Hoteloza',
        description: 'The requested landmark was not found on Hoteloza.',
        type: 'website',
        url: landmarkUrl,
      },
      alternates: {
        canonical: landmarkUrl,
      },
    };
  }

  const landmarkData = await fetchLandmarkData(slug);
  if (landmarkData) {
    const { landmarkName, cityName, category } = landmarkData;
    title = `${category} Near ${landmarkName}, ${cityName}`;

    const fullDescriptionSegmentsForMeta = contentTemplates.getGeoCategoryDescription(
        category, 'landmark', landmarkName, cityName, null, null
    );
    description = fullDescriptionSegmentsForMeta[0]?.content || '';
  } else {
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
  // MODIFIKASI SESUAI PERMINTAAN: Menambahkan 'await' pada params
  const awaitedParams = await params;
  const { slug } = awaitedParams;
  console.log('SERVER DEBUG [page.jsx]: Received slug from URL params:', slug);

  const landmarkData = await fetchLandmarkData(slug);

  if (!landmarkData) {
    notFound();
  }

  const landmarkName = landmarkData?.landmarkName || 'Landmark';
  const cityName = landmarkData?.cityName || 'Unknown City';
  const category = landmarkData?.category || 'Hotels';

  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    category,
    'landmark',
    landmarkName,
    cityName,
    null,
    null
  );

  const schemaDescription = longDescriptionSegments.map(segment => segment.content).join(' ');

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${category} near ${landmarkName}, ${cityName}`,
      "description": schemaDescription,
      "url": `https://hoteloza.com/landmark/${slug}`,
      "mainEntity": landmarkName !== 'Landmark' ? {
        "@context": "https://schema.org",
        "@type": "Place",
        "name": landmarkName,
        "description": schemaDescription,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityName,
          "addressRegion": null,
          "addressCountry": null
        },
      } : undefined
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `https://hoteloza.com/` },
        { '@type': 'ListItem', position: 2, name: 'Landmarks', item: `https://hoteloza.com/landmark` },
        { '@type': 'ListItem', position: 3, name: landmarkName, item: `https://hoteloza.com/landmark/${slug}` },
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
      <Suspense fallback={<div>{`Loading ${landmarkName} search results...`}</div>}>
        <LandmarkClient
          landmarkSlug={slug}
          initialLandmarkName={landmarkName}
          initialCityName={cityName}
          initialCategory={category}
          longDescriptionSegments={longDescriptionSegments}
        />
      </Suspense>
    </>
  );
}