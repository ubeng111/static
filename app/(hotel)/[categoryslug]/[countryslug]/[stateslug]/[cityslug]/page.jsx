// page.jsx (City)
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import contentTemplates from '@/utils/contentTemplates'; // Import template konten
import Script from 'next/script'; // Import Script component

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch city data
async function getCityData(categoryslug, countryslug, stateslug, cityslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);
  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    console.error('Invalid slugs:', { categoryslug, countryslug, stateslug, cityslug });
    return null;
  }

  // Using relative path for API Routes that are part of the same Next.js project.
  // Next.js will internally handle this routing during build and runtime.
  const apiUrl = `https://hoteloza.com/api/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`; // <-- CHANGE HERE

  try {
    // ISR with revalidate 1 year (31,536,000 seconds)
    const response = await fetch(apiUrl, { next: { revalidate: 31536000 } });
    if (!response.ok) {
      if (response.status === 404) {
          console.warn(`Failed to fetch city data: 404 Not Found for ${apiUrl}`);
      } else {
          console.error(`Failed to fetch city data for ${apiUrl}. Status: ${response.status} - ${response.statusText}`);
      }
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching city data:', error);
    return null;
  }
}

const ClientPage = dynamic(() => import('./ClientPage'));

// ------ FIX: Dynamically fetch city slugs from the database via API using relative paths ------
export async function generateStaticParams() {
  try {
    // Calling the API Route you've created to get all city paths.
    // Using relative path for API Routes that are part of the same Next.js project.
    const response = await fetch(`/api/all-city-paths`, { // <-- CHANGE HERE
      // Use 'no-store' to always fetch the latest data during build or revalidation.
      // This is crucial to ensure the list of paths is always up-to-date.
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch all city paths. Status: ${response.status} - ${response.statusText}`);
      // Throw an error to make the build fail if fetching path data is critical.
      // This helps prevent mass 404s in production.
      throw new Error(`Failed to fetch all city paths during build: ${response.statusText}`);
    }

    const paths = await response.json();
    
    // Ensure `paths` is an array of objects with the expected properties.
    // Expected format example: [{ categoryslug: '...', countryslug: '...', stateslug: '...', cityslug: '...' }, ...]
    if (!Array.isArray(paths) || paths.some(p => 
      !p.categoryslug || !p.countryslug || !p.stateslug || !p.cityslug
    )) {
      console.error("Fetched city paths are not in the expected format for generateStaticParams:", paths);
      return []; // Return empty array if data format is incorrect.
    }

    console.log(`SERVER DEBUG [page.jsx - generateStaticParams]: Successfully fetched ${paths.length} city paths.`);
    return paths;

  } catch (error) {
    console.error('SERVER FATAL ERROR [page.jsx - generateStaticParams]: Error fetching static paths for cities:', error);
    // Return an empty array on fatal error; this will cause 404s for city pages.
    return [];
  }
}
// --------------------------------------------------------------------------

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const { categoryslug, countryslug, stateslug, cityslug } = awaitedParams;

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);

  const currentUrl = `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`;

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category, country, state, or city was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  const data = await getCityData(categoryslug, countryslug, stateslug, cityslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category, country, state, or city was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  const formattedCity = data.hotels[0]?.kota ? formatSlug(data.hotels[0].kota) : formatSlug(sanitizedCity) || 'City';
  const formattedState = data.hotels[0]?.['negara bagian'] ? formatSlug(data.hotels[0]['negara bagian']) : formatSlug(sanitizedState) || 'State';
  const formattedCountry = data.hotels[0]?.country ? formatSlug(data.hotels[0].country) : formatSlug(sanitizedCountry) || 'Country';
  const formattedCategory = data.hotels[0]?.category ? formatSlug(data.hotels[0].category) : formatSlug(sanitizedCategory) || 'Category';
  const currentYear = new Date().getFullYear();

  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    formattedCategory,
    'city',
    formattedCity,
    formattedCity,
    formattedState,
    formattedCountry
  );

  const firstParagraphContent = longDescriptionSegments[0]?.content || '';
  const metaDescription = firstParagraphContent.substring(0, 160) + (firstParagraphContent.length > 160 ? '...' : '');

  return {
    title: `Best ${formattedCategory} in ${formattedCity}, ${formattedState} ${currentYear} - Book Now! | Hoteloza`,
    description: metaDescription,
    openGraph: {
      title: `Top ${formattedCategory} in ${formattedCity}, ${formattedState} ${currentYear} | Hoteloza`,
      description: metaDescription,
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
  const { categoryslug, countryslug, stateslug, cityslug } = awaitedParams;

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    notFound();
  }

  const data = await getCityData(categoryslug, countryslug, stateslug, cityslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  const formattedCity = data.hotels[0]?.kota ? formatSlug(data.hotels[0].kota) : formatSlug(sanitizedCity) || 'City';
  const formattedState = data.hotels[0]?.['negara bagian'] ? formatSlug(data.hotels[0]['negara bagian']) : formatSlug(sanitizedState) || 'State';
  const formattedCountry = data.hotels[0]?.country ? formatSlug(data.hotels[0].country) : formatSlug(sanitizedCountry) || 'Country';
  const formattedCategory = data.hotels[0]?.category ? formatSlug(data.hotels[0].category) : formatSlug(sanitizedCategory) || 'Category';
  const currentYear = new Date().getFullYear();

  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`;

  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    formattedCategory,
    'city',
    formattedCity,
    formattedCity,
    formattedState,
    formattedCountry
  );

  const schemaDescription = longDescriptionSegments.map(segment => segment.content).join(' ');

  const hotelItems = data.hotels.map((hotel, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Hotel',
      name: hotel.name || hotel.title || 'Unnamed Hotel',
      url: hotel.hotelslug ? `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}/${hotel.hotelslug}` : `${currentUrl}/${hotel.id || index + 1}`,
      image: hotel.img || hotel.slideimg || '',
      address: {
        '@type': 'PostalAddress',
        streetAddress: hotel.lokasi || 'Unknown Address',
        addressLocality: hotel.kota ? formatSlug(hotel.kota) : formattedCity || 'Unknown City',
        addressRegion: hotel['negara bagian'] ? formatSlug(hotel['negara bagian']) : formattedState || 'Unknown Region',
        addressCountry: hotel.country ? formatSlug(hotel.country) : formattedCountry || 'Unknown Country',
      },
      description: hotel.description || hotel.overview || `A ${formattedCategory.toLowerCase()} in ${formattedCity}, ${formattedState}.`,
    },
  }));

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: currentUrl,
        name: `Top ${formattedCategory} in ${formattedCity}, ${formattedState} ${currentYear}`,
        description: schemaDescription,
        publisher: {
          '@type': 'Organization',
          name: 'Hoteloza',
          logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${sanitizedCategory}` },
          { '@type': 'ListItem', position: 3, name: formattedCountry, item: `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}` },
          { '@type': 'ListItem', position: 4, name: formattedState, item: `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}` },
          { '@type': 'ListItem', position: 5, name: formattedCity, item: currentUrl },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Top ${formattedCategory} in ${formattedCity}, ${formattedState}`,
        description: schemaDescription.substring(0, 160) + '...',
        itemListElement: hotelItems,
      },
    ],
  };

  return (
    <>
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      <ClientPage
        categoryslug={sanitizedCategory}
        countryslug={sanitizedCountry}
        stateslug={sanitizedState}
        cityslug={sanitizedCity}
        formattedCategory={formattedCategory}
        formattedCity={formattedCity}
        formattedState={formattedState}
        formattedCountry={formattedCountry}
        longDescriptionSegments={longDescriptionSegments}
      />
    </>
  );
}