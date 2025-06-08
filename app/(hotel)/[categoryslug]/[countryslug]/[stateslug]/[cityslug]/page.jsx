import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

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

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Failed to fetch city data for ${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}. Status: ${response.status}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching city data:', error);
    return null;
  }
}

const ClientPage = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  const { categoryslug, countryslug, stateslug, cityslug } = params;
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category, country, state, or city was not found on Hoteloza.',
    };
  }

  const data = await getCityData(categoryslug, countryslug, stateslug, cityslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category, country, state, or city was not found on Hoteloza.',
    };
  }

  const formattedCity = formatSlug(sanitizedCity) || 'City';
  const formattedState = formatSlug(sanitizedState) || 'State';
  const formattedCountry = formatSlug(sanitizedCountry) || 'Country';
  const formattedCategory = formatSlug(sanitizedCategory) || 'Category';
  const currentYear = new Date().getFullYear();

  return {
    title: `Book the Best ${formattedCategory} in ${formattedCity}, ${formattedCountry} – ${currentYear} Deals Await!`,
    description: `Explore top ${formattedCategory.toLowerCase()} in ${formattedCity}, ${formattedState} for ${currentYear} on Hoteloza. Book now for exclusive deals and limited-time offers!`,
    openGraph: {
      title: `Top ${formattedCategory} in ${formattedCity}, ${formattedState} ${currentYear} | Hoteloza`,
      description: `Book top ${formattedCategory.toLowerCase()} in ${formattedCity}, ${formattedState} for ${currentYear} on Hoteloza. Enjoy exclusive deals now!`,
      url: `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
  const { categoryslug, countryslug, stateslug, cityslug } = params;
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

  const formattedCity = formatSlug(sanitizedCity) || 'City';
  const formattedState = formatSlug(sanitizedState) || 'State';
  const formattedCountry = formatSlug(sanitizedCountry) || 'Country';
  const formattedCategory = formatSlug(sanitizedCategory) || 'Category';
  const currentYear = new Date().getFullYear();

  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`;

  // Create ItemList schema for hotels
  const hotelItems = data.hotels.map((hotel, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Hotel',
      name: hotel.name || hotel.title || 'Unnamed Hotel',
      url: hotel.hotelslug ? `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}/${hotel.hotelslug}` : `${currentUrl}/${hotel.id || index + 1}`,
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
        description: `Book top ${formattedCategory.toLowerCase()} in ${formattedCity}, ${formattedState} for ${currentYear} on Hoteloza with exclusive deals and amenities.`,
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
        description: `A list of top ${formattedCategory.toLowerCase()} in ${formattedCity}, ${formattedState} for ${currentYear} on Hoteloza.`,
        itemListElement: hotelItems,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      <ClientPage
        categoryslug={sanitizedCategory}
        countryslug={sanitizedCountry}
        stateslug={sanitizedState}
        cityslug={sanitizedCity}
      />
    </>
  );
}