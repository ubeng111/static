// app/(hotel)/[categoryslug]/[countryslug]/[stateslug]/page.jsx
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates';

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
    return null;
  }

  // MENGGUNAKAN URL LENGKAP HTTPS://HOTELOZA.COM UNTUK FETCH DATA NEGARA BAGIAN
  // Atau Anda bisa kembali ke http://localhost:3000 jika itu yang Anda inginkan untuk DEVELOPMENT/VPS saat server belum live
  const apiUrl = `https://hoteloza.com/api/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`;
  // ATAU: const apiUrl = `http://localhost:3000/api/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`;
  console.log('SERVER DEBUG [page.jsx - getStateData]: Constructed API URL:', apiUrl);

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 31536000 } });
    if (!response.ok) {
      if (response.status === 404) {
          console.warn(`Failed to fetch state data: 404 Not Found for ${apiUrl}`);
      } else {
          console.error(`Failed to fetch state data for ${apiUrl}. Status: ${response.status} - ${response.statusText}`);
      }
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching state data:', error);
    return null;
  }
}

const ClientPage = dynamic(() => import('./ClientPage'));

// MENGGUNAKAN generateStaticParams DENGAN DATA HARDCODED (RUTE PASTI)
export async function generateStaticParams() {
  console.warn("WARNING: Using hardcoded paths for generateStaticParams. All other paths will result in 404.");
  console.warn("THIS IS ONLY FOR BUILD SUCCESS VERIFICATION. For full dynamic coverage, you NEED to implement API calls to fetch all paths from your database.");

  return [
    {
      categoryslug: 'hotel',
      countryslug: 'indonesia',
      stateslug: 'bali',
    },
  ];
}

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const { categoryslug, countryslug, stateslug } = awaitedParams;

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);

  const currentUrl = `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`;

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category, country, or state was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  const data = await getStateData(categoryslug, countryslug, stateslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category, country, or state was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  const formattedState = formatSlug(sanitizedState) || 'State';
  const formattedCountry = formatSlug(sanitizedCountry) || 'Country';
  const formattedCategory = formatSlug(sanitizedCategory) || 'Category';
  const currentYear = new Date().getFullYear();

  const categoryForTemplate = data.hotels[0]?.category || formattedCategory;

  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    categoryForTemplate,
    'state',
    formattedState,
    null,
    formattedState,
    formattedCountry
  );

  const firstParagraphContent = longDescriptionSegments[0]?.content || '';
  const metaDescription = firstParagraphContent.substring(0, 160) + (firstParagraphContent.length > 160 ? '...' : '');

  return {
    title: `Cheap ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear} - Now Booking! | Hoteloza`,
    description: metaDescription,
    openGraph: {
      title: `Best ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear} | Hoteloza`,
      description: `Discover the best ${formattedCategory.toLowerCase()} in ${formattedState}, ${formattedCountry} for ${currentYear} on Hoteloza. Book now for exclusive offers and premium amenities!`,
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
  const { categoryslug, countryslug, stateslug } = awaitedParams;

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) {
    notFound();
  }

  const data = await getStateData(categoryslug, countryslug, stateslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  const formattedState = formatSlug(sanitizedState) || 'State';
  const formattedCountry = formatSlug(sanitizedCountry) || 'Country';
  const formattedCategory = formatSlug(sanitizedCategory) || 'Category';
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`;

  const categoryForTemplate = data.hotels[0]?.category || formattedCategory;

  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    categoryForTemplate,
    'state',
    formattedState,
    null,
    formattedState,
    formattedCountry
  );

  const displayState = data.hotels[0]?.['negara bagian'] ? formatSlug(data.hotels[0]['negara bagian']) : formattedState;
  const displayCountry = data.hotels[0]?.country ? formatSlug(data.hotels[0].country) : formattedCountry;
  const displayCategory = data.hotels[0]?.category ? formatSlug(data.hotels[0].category) : formattedCategory;
  const displayCity = data.hotels[0]?.kota ? formatSlug(data.hotels[0].kota) : 'Unknown City';

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
        { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${sanitizedCategory}` },
        { '@type': 'ListItem', position: 3, name: formattedCountry, item: `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}` },
        { '@type': 'ListItem', position: 4, name: formattedState, item: currentUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Top ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear}`,
      description: schemaDescription.substring(0, 160) + '...',
      itemListElement: data.hotels.map((hotel, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Hotel',
          name: hotel.title || hotel.name || 'Unnamed Hotel',
          url: hotel.hotelslug && hotel.cityslug
            ? `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${hotel.cityslug}/${hotel.hotelslug}`
            : `${currentUrl}/${hotel.id || index + 1}`,
          image: hotel.img || hotel.slideimg || '',
          address: {
            '@type': 'PostalAddress',
            streetAddress: hotel.lokasi || 'Unknown Address',
            addressLocality: hotel.kota ? formatSlug(hotel.kota) : 'Unknown City',
            addressRegion: hotel['negara bagian'] ? formatSlug(hotel['negara bagian']) : formattedState || 'Unknown Region',
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
        categoryslug={sanitizedCategory}
        countryslug={sanitizedCountry}
        stateslug={sanitizedState}
        longDescriptionSegments={longDescriptionSegments}
        formattedCategory={formattedCategory}
        formattedCountry={formattedCountry}
        formattedState={formattedState}
        displayState={displayState}
      />
    </>
  );
}