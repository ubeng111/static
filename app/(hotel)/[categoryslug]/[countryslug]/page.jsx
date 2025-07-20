// app/(hotel)/[categoryslug]/[countryslug]/page.jsx
import dynamicImport from 'next/dynamic'; // ✅ pakai alias agar tidak bentrok dengan export dynamic
import { notFound } from 'next/navigation';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates';
import { Pool } from 'pg'; // Added for consistency
import fs from 'fs'; // Added for consistency
import path from 'path'; // Added for consistency
import 'dotenv/config'; // Added for consistency


// This Pool connection is included for consistency with landmark and category pages,
// but it's not actually used by the getCountryData function in this file,
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

// Function to fetch country data
async function getCountryData(categoryslug, countryslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  if (!sanitizedCategory || !sanitizedCountry) {
    console.error('Invalid slugs:', { categoryslug, countryslug });
    return { hotels: [] }; // Return empty data structure on invalid slugs for graceful degradation
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${sanitizedCategory}/${sanitizedCountry}`;
  console.log('SERVER DEBUG [page.jsx - getCountryData]: Constructed API URL:', apiUrl);

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 31536000 } });
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Failed to fetch country data: 404 Not Found for ${apiUrl}`);
      } else {
        console.error(`Failed to fetch country data for ${apiUrl}. Status: ${response.status} - ${response.statusText}`);
      }
      return { hotels: [] };
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching country data:', error);
    return { hotels: [] };
  }
}

const ClientPage = dynamicImport(() => import('./ClientPage')); // ✅ ganti ke dynamicImport

// HAPUS generateStaticParams() SECARA KESELURUHAN DARI SINI

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const categoryslug = awaitedParams.categoryslug;
  const countryslug = awaitedParams.countryslug;

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory || 'hotels'}/${sanitizedCountry || 'country'}`;

  let title = 'Page Not Found | Hoteloza';
  let description = 'The requested category or country was not found on Hoteloza. Discover amazing hotel deals!';
  let ogTitle = 'Explore Hotel Deals | Hoteloza';
  let ogDescription = 'Discover amazing hotel deals and premium amenities on Hoteloza.';

  if (!sanitizedCategory || !sanitizedCountry) {
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

  const data = await getCountryData(categoryslug, countryslug);

  if (data && data.hotels && data.hotels.length > 0) {
    const formattedCountry = formatSlug(sanitizedCountry);
    const formattedCategory = formatSlug(sanitizedCategory);
    const currentYear = new Date().getFullYear();

    const longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
      formattedCategory,
      'country',
      formattedCountry,
      null,
      null,
      formattedCountry
    );

    const firstParagraphContent = longDescriptionSegments[0]?.content || '';
    const metaDescription = firstParagraphContent.substring(0, 160) + (firstParagraphContent.length > 160 ? '...' : '');

    title = `Cheap ${formattedCategory} in ${formattedCountry} ${currentYear} - Don’t Miss Out! | Hoteloza`;
    description = metaDescription;
    ogTitle = `Best ${formattedCategory} in ${formattedCountry} ${currentYear} | Hoteloza`;
    ogDescription = `Find the best ${formattedCategory.toLowerCase()} in ${formattedCountry} for ${currentYear} on Hoteloza. Book now for top hotels and exclusive deals!`;
  } else {
    const formattedCountry = formatSlug(sanitizedCountry) || 'Country';
    const formattedCategory = formatSlug(sanitizedCategory) || 'Hotels';
    title = `Hotels in ${formattedCountry} | Hoteloza`;
    description = `Discover amazing hotel deals and premium accommodations in ${formattedCountry} on Hoteloza. Find your perfect stay!`;
    ogTitle = `Best Hotels in ${formattedCountry} | Hoteloza`;
    ogDescription = `Explore a wide range of hotels and accommodations in ${formattedCountry} for your next trip on Hoteloza.`;
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
  const countryslug = awaitedParams.countryslug;

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);

  let formattedCategory = 'Hotels';
  let formattedCountry = 'Country';
  let data = { hotels: [] };
  let longDescriptionSegments;

  if (sanitizedCategory && sanitizedCountry) {
    data = await getCountryData(categoryslug, countryslug);

    if (data && data.hotels && data.hotels.length > 0) {
      formattedCategory = formatSlug(sanitizedCategory);
      formattedCountry = formatSlug(sanitizedCountry);
    } else {
      formattedCategory = formatSlug(sanitizedCategory) || 'Hotels';
      formattedCountry = formatSlug(sanitizedCountry) || 'Country';
    }
  } else {
    formattedCategory = formatSlug(sanitizedCategory) || 'Hotels';
    formattedCountry = formatSlug(sanitizedCountry) || 'Country';
  }

  longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    formattedCategory,
    'country',
    formattedCountry,
    null,
    null,
    formattedCountry
  );

  const currentYear = new Date().getFullYear();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory || 'hotels'}/${sanitizedCountry || 'country'}`;

  const displayCountry = data.hotels[0]?.country ? formatSlug(data.hotels[0].country) : formattedCountry;

  const schemaDescription = longDescriptionSegments.map(segment => segment.content).join(' ');

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Best ${formattedCategory} in ${formattedCountry} ${currentYear}`,
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
        { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${sanitizedCategory || 'hotels'}` },
        { '@type': 'ListItem', position: 3, name: formattedCountry, item: currentUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Top ${formattedCategory} in ${formattedCountry} ${currentYear}`,
      description: schemaDescription.substring(0, 160) + '...',
      itemListElement: (data.hotels || []).map((hotel, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Hotel',
          name: hotel.title || hotel.name || 'Unnamed Hotel',
          url: hotel.hotelslug && hotel.countryslug && hotel.stateslug && hotel.cityslug && hotel.categoryslug
            ? `${baseUrl}/${hotel.categoryslug}/${hotel.countryslug}/${hotel.stateslug}/${hotel.cityslug}/${hotel.hotelslug}`
            : `${currentUrl}/${hotel.id || index + 1}`,
          image: hotel.img || hotel.slideimg || '',
          address: {
            '@type': 'PostalAddress',
            streetAddress: hotel.lokasi || 'Unknown Address',
            addressLocality: hotel.kota ? formatSlug(hotel.kota) : 'Unknown City',
            addressRegion: hotel['negara bagian'] ? formatSlug(hotel['negara bagian']) : 'Unknown Region',
            addressCountry: hotel.country ? formatSlug(hotel.country) : formattedCountry || 'Unknown Country',
          },
          description: hotel.description || hotel.overview || `A ${formattedCategory.toLowerCase()} in ${hotel.kota ? formatSlug(hotel.kota) : 'unknown location'}, ${formattedCountry}.`,
        },
      })),
    },
  ];

  return (
    <>
      <Script
        id="country-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <ClientPage
        categoryslug={sanitizedCategory || 'hotel'}
        countryslug={sanitizedCountry || 'indonesia'}
        longDescriptionSegments={longDescriptionSegments}
        displayCountry={displayCountry}
        formattedCategory={formattedCategory}
        initialHotelsData={data.hotels || []}
      />
    </>
  );
}
