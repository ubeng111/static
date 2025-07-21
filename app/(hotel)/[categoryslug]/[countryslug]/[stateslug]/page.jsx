// app/(hotel)/[categoryslug]/[countryslug]/[stateslug]/page.jsx
import { notFound } from 'next/navigation';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// FIX: Rename the 'dynamic' import to avoid conflict with 'export const dynamic'.
import dynamicComponent from 'next/dynamic'; // Renamed to dynamicComponent


// This Pool connection is included for consistency with landmark and category pages,
// but it's not actually used by the getStateData function in this file,
// which fetches from an external API URL.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'root.crt')) },
});

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch state data
async function getStateData(categoryslug, countryslug, stateslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) {
    console.error('Invalid slugs:', { categoryslug, countryslug, stateslug });
    return { hotels: [] }; // Return empty data structure on invalid slugs for graceful degradation
  }

  // MENGGUNAKAN URL DARI ENVIRONMENT VARIABLE
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`;
  console.log('SERVER DEBUG [page.jsx - getStateData]: Constructed API URL:', apiUrl);

  try {
    // Tambahkan revalidate untuk ISR selama 1 tahun (sama dengan halaman landmark dan kategori)
    const response = await fetch(apiUrl, { next: { revalidate: 31536000 } }); // ISR: revalidate every 1 year
    if (!response.ok) {
      if (response.status === 404) {
          console.warn(`Failed to fetch state data: 404 Not Found for ${apiUrl}`);
      } else {
          console.error(`Failed to fetch state data for ${apiUrl}. Status: ${response.status} - ${response.statusText}`);
      }
      return { hotels: [] }; // Return empty data structure on API error for graceful degradation
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching state data:', error);
    return { hotels: [] }; // Return empty data structure on fetch error for graceful degradation
  }
}

// FIX: Use the aliased dynamicComponent for importing the client component.
const ClientPage = dynamicComponent(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  // MODIFIKASI: Menambahkan 'await' pada params sesuai instruksi
  const awaitedParams = await params;
  const { categoryslug, countryslug, stateslug } = awaitedParams;

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory || 'hotels'}/${sanitizedCountry || 'country'}/${sanitizedState || 'state'}`;

  let title = 'Page Not Found | Hoteloza';
  let description = 'The requested category, country, or state was not found on Hoteloza. Discover amazing hotel deals!';
  let ogTitle = 'Explore Hotel Deals | Hoteloza';
  let ogDescription = 'Discover amazing hotel deals and premium amenities on Hoteloza.';

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) {
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

  const data = await getStateData(categoryslug, countryslug, stateslug);

  let longDescriptionSegments = [];

  if (data && data.hotels && data.hotels.length > 0) {
    const formattedState = formatSlug(sanitizedState);
    const formattedCountry = formatSlug(sanitizedCountry);
    const formattedCategory = formatSlug(sanitizedCategory);

    const categoryForTemplate = data.hotels[0]?.category ? formatSlug(data.hotels[0].category) : formattedCategory;

    longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
      categoryForTemplate,
      'state',
      formattedState,
      null,
      formattedState,
      formattedCountry
    );

    const firstParagraphContent = longDescriptionSegments[0]?.content || '';
    const metaDescription = firstParagraphContent.substring(0, 160) + (firstParagraphContent.length > 160 ? '...' : '');

    title = `Cheap ${categoryForTemplate} in ${formattedState}, ${formattedCountry} ${new Date().getFullYear()} - Now Booking! | Hoteloza`;
    description = metaDescription;
    ogTitle = `Best ${categoryForTemplate} in ${formattedState}, ${formattedCountry} ${new Date().getFullYear()} | Hoteloza`;
    ogDescription = `Discover the best ${categoryForTemplate.toLowerCase()} in ${formattedState}, ${formattedCountry} for ${new Date().getFullYear()} on Hoteloza. Book now for exclusive offers and premium amenities!`;
  } else {
    const formattedStateFallback = formatSlug(sanitizedState) || 'State';
    const formattedCountryFallback = formatSlug(sanitizedCountry) || 'Country';
    const formattedCategoryFallback = formatSlug(sanitizedCategory) || 'Hotels';

    longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
        formattedCategoryFallback,
        'state',
        formattedStateFallback,
        null,
        formattedStateFallback,
        formattedCountryFallback
    );

    title = `Hotels in ${formattedStateFallback}, ${formattedCountryFallback} | Hoteloza`;
    description = `Discover amazing hotel deals and premium accommodations in ${formattedStateFallback}, ${formattedCountryFallback} on Hoteloza. Find your perfect stay!`;
    ogTitle = `Best Hotels in ${formattedStateFallback}, ${formattedCountryFallback} | Hoteloza`;
    ogDescription = `Explore a wide range of hotels and accommodations in ${formattedStateFallback}, ${formattedCountryFallback} for your next trip on Hoteloza.`;
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
  // MODIFIKASI: Menambahkan 'await' pada params sesuai instruksi
  const awaitedParams = await params;
  const { categoryslug, countryslug, stateslug } = awaitedParams;
  
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) {
    // We'll continue rendering with fallback values
  }

  let formattedCategory = 'Hotels';
  let formattedCountry = 'Country';
  let formattedState = 'State';
  let data = { hotels: [] };
  let longDescriptionSegments;

  if (sanitizedCategory && sanitizedCountry && sanitizedState) {
    data = await getStateData(categoryslug, countryslug, stateslug);

    if (data && data.hotels && data.hotels.length > 0) {
      formattedCategory = data.hotels[0]?.category ? formatSlug(data.hotels[0].category) : formatSlug(sanitizedCategory);
      formattedCountry = data.hotels[0]?.country ? formatSlug(data.hotels[0].country) : formatSlug(sanitizedCountry);
      formattedState = data.hotels[0]?.['negara bagian'] ? formatSlug(data.hotels[0]['negara bagian']) : formatSlug(sanitizedState);
    } else {
      formattedCategory = formatSlug(sanitizedCategory) || 'Hotels';
      formattedCountry = formatSlug(sanitizedCountry) || 'Country';
      formattedState = formatSlug(sanitizedState) || 'State';
    }
  } else {
    formattedCategory = formatSlug(sanitizedCategory) || 'Hotels';
    formattedCountry = formatSlug(sanitizedCountry) || 'Country';
    formattedState = formatSlug(sanitizedState) || 'State';
  }

  longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    formattedCategory,
    'state',
    formattedState,
    null,
    formattedState,
    formattedCountry
  );

  const currentYear = new Date().getFullYear();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory || 'hotels'}/${sanitizedCountry || 'country'}/${sanitizedState || 'state'}`;

  const displayState = data.hotels[0]?.['negara bagian'] ? formatSlug(data.hotels[0]['negara bagian']) : formattedState;
  const displayCountry = data.hotels[0]?.country ? formatSlug(data.hotels[0].country) : formattedCountry;
  const displayCategory = data.hotels[0]?.category ? formatSlug(data.hotels[0].category) : formattedCategory;
  const displayCity = data.hotels[0]?.kota ? formatSlug(data.hotels[0].kota) : 'Unknown City'; // Keep as 'Unknown City' if not available

  const schemaDescription = longDescriptionSegments.map(segment => segment.content).join(' ');

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Best ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear}`,
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
        { '@type': 'ListItem', position: 3, name: formattedCountry, item: `${baseUrl}/${sanitizedCategory || 'hotels'}/${sanitizedCountry || 'country'}` },
        { '@type': 'ListItem', position: 4, name: formattedState, item: currentUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Top ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear}`,
      description: schemaDescription.substring(0, 160) + '...',
      itemListElement: (data.hotels || []).map((hotel, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Hotel',
          name: hotel.title || hotel.name || 'Unnamed Hotel',
          url: hotel.hotelslug && hotel.cityslug && hotel.categoryslug && hotel.countryslug && hotel.stateslug
            ? `${baseUrl}/${hotel.categoryslug}/${hotel.countryslug}/${hotel.stateslug}/${hotel.cityslug}/${hotel.hotelslug}`
            : `${currentUrl}/${hotel.id || index + 1}`,
          image: hotel.img || hotel.slideimg || '',
          address: {
            '@type': 'PostalAddress',
            streetAddress: hotel.lokasi || 'Unknown Address',
            addressLocality: hotel.kota ? formatSlug(hotel.kota) : 'Unknown City',
            addressRegion: hotel['negara bagian'] ? formatSlug(hotel.negara_bagian) : formattedState || 'Unknown Region',
            addressCountry: hotel.country ? formatSlug(hotel.country) : formattedCountry || 'Unknown Country',
          },
          description: hotel.description || hotel.overview || `A ${formattedCategory.toLowerCase()} in ${hotel.kota ? formatSlug(hotel.kota) : 'unknown location'}, ${formattedState}, ${formattedCountry}.`,
        },
      })),
    },
  ];

  return (
    <>
      <Script
        id="state-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <ClientPage
        categoryslug={sanitizedCategory || 'hotels'}
        countryslug={sanitizedCountry || 'country'}
        stateslug={sanitizedState || 'state'}
        longDescriptionSegments={longDescriptionSegments}
        formattedCategory={formattedCategory}
        formattedCountry={formattedCountry}
        formattedState={formattedState}
        initialHotelsData={data.hotels || []}
      />
    </>
  );
}