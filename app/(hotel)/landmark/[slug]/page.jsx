// app/[lang]/landmark/[slug]/page.jsx
import { Suspense } from 'react';
import 'dotenv/config'; // Pastikan dotenv sudah dikonfigurasi dengan benar di proyek Anda
import LandmarkClient from './LandmarkClient';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates'; // Pastikan path ini benar
import { notFound } from 'next/navigation';

// Hapus: export const dynamic = 'force-dynamic';
// Next.js akan secara otomatis mengidentifikasi ini sebagai halaman statis (dengan ISR)
// karena adanya next: { revalidate } pada fetch dan absennya dynamic = 'force-dynamic'.

/**
 * Konversi 1 bulan ke detik:
 * 1 bulan ≈ 30 hari
 * 30 hari * 24 jam/hari * 60 menit/jam * 60 detik/menit = 2,592,000 detik
 */
const REVALIDATE_IN_SECONDS = 2592000;

/**
 * Fungsi untuk mengambil data landmark dari API.
 * Menggunakan `next: { revalidate: REVALIDATE_IN_SECONDS }` untuk mengaktifkan ISR pada data fetch.
 * Data akan di-cache selama 1 bulan di sisi server Next.js.
 */
async function fetchLandmarkData(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/landmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ landmark_slug: slug }),
      // KUNCI ISR: Data akan direvalidate setelah 1 bulan
      next: { revalidate: REVALIDATE_IN_SECONDS }
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

// Fungsi pembantu untuk memformat slug (tetap sama)
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// HAPUS FUNGSI generateStaticParams JIKA ANDA TIDAK INGIN MENGGUNAKANNYA:
/*
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/landmarks/all-slugs`, {
        cache: 'no-store'
    });
    if (!res.ok) {
      console.error(`SERVER ERROR [generateStaticParams]: Failed to fetch all slugs: ${res.status}`);
      return [];
    }
    const slugsData = await res.json();
    return slugsData.map(slug => ({ slug }));
  } catch (error) {
    console.error('SERVER ERROR [generateStaticParams]: Error fetching all slugs:', error);
    return [];
  }
}
*/

/**
 * Fungsi untuk menghasilkan metadata SEO untuk halaman.
 * Ini juga akan dijalankan saat build time (atau saat regenerasi).
 */
export async function generateMetadata({ params }) {
  const { slug } = params;

  let title = 'Hotels near Landmark';
  let description = 'Find top hotels near popular landmarks with great deals and reviews.';
  let landmarkUrl = `https://hoteloza.com/landmark/${slug}`;

  if (!slug || typeof slug !== 'string') {
    console.error('SERVER DEBUG [page.jsx]: Invalid or missing slug in generateMetadata:', slug);
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

  const landmarkData = await fetchLandmarkData(slug); // Data akan diambil dengan revalidate ISR
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

/**
 * Komponen halaman utama untuk menampilkan detail landmark.
 * Ini akan dijalankan saat build time dan saat regenerasi.
 */
export default async function LandmarkSlugPage({ params }) {
  const { slug } = params;
  console.log('SERVER DEBUG [page.jsx]: Received slug from URL params:', slug);

  const landmarkData = await fetchLandmarkData(slug); // Data akan diambil dengan revalidate ISR

  if (!landmarkData) {
    // Jika data tidak ditemukan, tampilkan halaman 404
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