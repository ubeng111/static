// app/(hotel)/[categoryslug]/page.jsx
import { notFound } from 'next/navigation';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import dynamicImport from 'next/dynamic'; // ✅ alias untuk menghindari konflik nama


// This Pool connection is included for consistency with the landmark page,
// but it's not actually used by the getCategoryData function in this file,
// which fetches from an external API URL.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS, ///landmark/[slug]/page.jsx]
  ssl: { ca: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'root.crt')) }, ///landmark/[slug]/page.jsx]
});

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch category data
async function getCategoryData(categoryslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug);
  if (!sanitizedCategory) {
    console.error('Invalid category slug:', categoryslug);
    return { hotels: [] }; // Return empty data structure on invalid slug
  }

  // MENGGUNAKAN URL LENGKAP DARI ENVIRONMENT VARIABLE
  // Pastikan Anda memiliki NEXT_PUBLIC_API_BASE_URL yang terdefinisi di file .env Anda
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${sanitizedCategory}`;
  console.log('SERVER DEBUG [page.jsx - getCategoryData]: Constructed API URL:', apiUrl);

  try {
    // Revalidate for ISR during 1 year (365 days * 24 hours * 60 minutes * 60 seconds = 31536000 seconds)
    const response = await fetch(apiUrl, { next: { revalidate: 31536000 } }); ///landmark/[slug]/page.jsx]
    if (!response.ok) {
      if (response.status === 404) {
          console.warn(`Failed to fetch category data: 404 Not Found for ${apiUrl}`);
      } else {
          console.error(`Failed to fetch category data for ${apiUrl}. Status: ${response.status} - ${response.statusText}`);
      }
      return { hotels: [] }; // Return empty data structure on API error
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching category data:', error);
    return { hotels: [] }; // Return empty data structure on fetch error
  }
}

const ClientPage = dynamicImport(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const categoryslug = awaitedParams.categoryslug;

  const sanitizedCategory = sanitizeSlug(categoryslug);
  // URL utama juga bisa diambil dari variabel lingkungan untuk konsistensi
  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory || 'hotel'}`;

  let title = 'Category Not Found | Hoteloza';
  let description = 'The requested category was not found on Hoteloza. Discover amazing hotel deals on Hoteloza!';
  let ogTitle = 'Explore Hotel Deals | Hoteloza';
  let ogDescription = 'Discover amazing hotel deals and premium amenities on Hoteloza.';

  if (!sanitizedCategory) {
    return {
      title,
      description,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: currentUrl,
        type: 'website',
      },
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  const data = await getCategoryData(categoryslug);

  if (data && data.hotels && data.hotels.length > 0) {
    const formattedCategory = formatSlug(sanitizedCategory);
    const currentYear = new Date().getFullYear(); // Defined here for metadata

    const longDescriptionSegments = contentTemplates.getCategoryPageDescription(formattedCategory);
    const firstParagraphContent = longDescriptionSegments[0]?.content || '';
    const metaDescription = firstParagraphContent.substring(0, 160) + (firstParagraphContent.length > 160 ? '...' : '');

    title = `Unbelievable ${formattedCategory} Deals for ${currentYear} - Save Big on Hoteloza!`;
    description = metaDescription;
    ogTitle = `Top ${formattedCategory} Deals in ${currentYear} | Hoteloza`;
    ogDescription = `Explore top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza. Book now for exclusive deals and premium amenities!`;
  } else {
    title = `Hotels and Accommodations | Hoteloza`;
    description = `Discover amazing hotel deals and premium amenities across various categories on Hoteloza. Find your perfect stay!`;
    ogTitle = `Best Hotel Deals & Accommodations | Hoteloza`;
    ogDescription = `Explore a wide range of hotels and accommodations for your next trip on Hoteloza.`;
  }

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: currentUrl,
      type: 'website',
    },
    alternates: {
      canonical: currentUrl,
    },
  };
}

export default async function Page({ params }) {
  const awaitedParams = await params;
  const categoryslug = awaitedParams.categoryslug;

  const sanitizedCategory = sanitizeSlug(categoryslug);

  if (!sanitizedCategory) {
    // If the slug is truly invalid, you could opt to go to notFound() here.
    // However, to align with graceful degradation, we'll let the fallback values handle it.
  }

  let formattedCategory = 'Hotels';
  let data = { hotels: [] };
  let longDescriptionSegments;

  // FIX: Declare currentYear within the Page component's scope
  const currentYear = new Date().getFullYear();

  if (sanitizedCategory) {
    data = await getCategoryData(categoryslug);
    if (data && data.hotels && data.hotels.length > 0) {
      formattedCategory = formatSlug(sanitizedCategory);
    } else {
      formattedCategory = formatSlug(sanitizedCategory) || 'Hotels';
    }
  }

  longDescriptionSegments = contentTemplates.getCategoryPageDescription(formattedCategory);

  // URL utama juga diambil dari variabel lingkungan untuk konsistensi
  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory || 'hotels'}`;

  const schemaDescription = longDescriptionSegments.map(segment => segment.content).join(' ');

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Top ${formattedCategory} Deals in ${currentYear}`, // currentYear is now defined
      description: schemaDescription,
      url: currentUrl,
      publisher: {
        '@type': 'Organization',
        name: 'Hoteloza',
        logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: formattedCategory, item: currentUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Top ${formattedCategory} in ${currentYear}`, // currentYear is now defined
      description: `A list of top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza.`, // currentYear is now defined
      itemListElement: (data.hotels || []).map((hotel, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Hotel',
          name: hotel.title || hotel.name || 'Unnamed Hotel',
          url: hotel.hotelslug && hotel.countryslug && hotel.stateslug && hotel.cityslug
            ? `${baseUrl}/${hotel.categoryslug || sanitizedCategory || 'hotels'}/${hotel.countryslug}/${hotel.stateslug}/${hotel.cityslug}/${hotel.hotelslug}`
            : `${currentUrl}/${hotel.id || index + 1}`,
          image: hotel.img || hotel.slideimg || '',
          address: {
            '@type': 'PostalAddress',
            streetAddress: hotel.lokasi || 'Unknown Address',
            addressLocality: hotel.kota ? formatSlug(hotel.kota) : 'Unknown City',
            addressRegion: hotel['negara bagian'] ? formatSlug(hotel['negara bagian']) : 'Unknown Region',
            addressCountry: hotel.country ? formatSlug(hotel.country) : 'Unknown Country',
          },
          description: hotel.description || hotel.overview || `A ${formattedCategory.toLowerCase()} in ${hotel.kota ? formatSlug(hotel.kota) : 'unknown location'}.`,
        },
      })),
    },
  ];

  return (
    <>
      <Script
        id="category-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <ClientPage
        categoryslug={sanitizedCategory || 'hotels'}
        longDescriptionSegments={longDescriptionSegments}
        initialCategoryName={formattedCategory}
        initialHotelsData={data.hotels || []}
      />
    </>
  );
}