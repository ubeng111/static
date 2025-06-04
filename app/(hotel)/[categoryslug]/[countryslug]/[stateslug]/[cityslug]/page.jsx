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
    title: `${currentYear}’s Hottest ${formattedCategory} in ${formattedCity}, ${formattedCountry} - Book Now!`,
    description: `Discover ${formattedCity}, ${formattedState}’s top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza. Secure your spot with exclusive deals—don’t wait!`,
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

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Top ${formattedCategory} in ${formattedCity}, ${formattedState} ${currentYear}`,
    description: `Book top ${formattedCategory.toLowerCase()} in ${formattedCity}, ${formattedState} for ${currentYear} on Hoteloza.`,
    url: `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`,
    itemListElement: data.hotels.map((hotel, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Hotel',
        name: hotel.title,
        url: `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}/${hotel.hotelslug}`,
        image: hotel.img || (hotel.slideImg && hotel.slideImg[0]) || '',
        priceRange: hotel.price ? `$${hotel.price} - $${hotel.price + 100}` : '$$$',
        address: {
          '@type': 'PostalAddress',
          addressLocality: hotel.city,
          addressRegion: hotel.state,
          addressCountry: hotel.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: hotel.latitude,
          longitude: hotel.longitude,
        },
        aggregateRating: hotel.ratings
          ? {
              '@type': 'AggregateRating',
              ratingValue: parseFloat(hotel.ratings).toFixed(1),
              reviewCount: parseInt(hotel.numberOfReviews) || 0,
            }
          : null,
      },
    })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hoteloza.com' },
        { '@type': 'ListItem', position: 2, name: formattedCategory, item: `https://hoteloza.com/${sanitizedCategory}` },
        { '@type': 'ListItem', position: 3, name: formattedCountry, item: `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}` },
        { '@type': 'ListItem', position: 4, name: formattedState, item: `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}` },
        { '@type': 'ListItem', position: 5, name: formattedCity, item: `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}` },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <ClientPage
        categoryslug={sanitizedCategory}
        countryslug={sanitizedCountry}
        stateslug={sanitizedState}
        cityslug={sanitizedCity}
        schema={schema}
      />
    </>
  );
}