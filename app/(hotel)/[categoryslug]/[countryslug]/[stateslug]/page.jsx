import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

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

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Failed to fetch state data for ${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}. Status: ${response.status}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching state data:', error);
    return null;
  }
}

const ClientPage = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  const { categoryslug, countryslug, stateslug } = params;
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category, country, or state was not found on Hoteloza.',
    };
  }

  const data = await getStateData(categoryslug, countryslug, stateslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category, country, or state was not found on Hoteloza.',
    };
  }

  const formattedState = formatSlug(sanitizedState) || 'State';
  const formattedCountry = formatSlug(sanitizedCountry) || 'Country';
  const formattedCategory = formatSlug(sanitizedCategory) || 'Category';
  const currentYear = new Date().getFullYear();

  return {
    title: `Steal These ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear} - Hoteloza Exclusive`,
    description: `Grab the best ${formattedCategory.toLowerCase()} in ${formattedState}, ${formattedCountry} for ${currentYear} on Hoteloza. Act fast for exclusive offers and dream stays!`,
    openGraph: {
      title: `Best ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear} - Hoteloza`,
      description: `Discover the best ${formattedCategory.toLowerCase()} in ${formattedState}, ${formattedCountry} for ${currentYear} on Hoteloza. Book your perfect stay with top amenities and exclusive offers.`,
      url: `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
 

  const { categoryslug, countryslug, stateslug } = params;
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

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear}`,
    description: `Discover the best ${formattedCategory.toLowerCase()} in ${formattedState}, ${formattedCountry} for ${currentYear} on Hoteloza.`,
    url: `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`,
    itemListElement: data.hotels.map((hotel, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Hotel',
        name: hotel.title,
        url: `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${hotel.cityslug}/${hotel.hotelslug}`,
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
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <ClientPage categoryslug={sanitizedCategory} countryslug={sanitizedCountry} stateslug={sanitizedState} />
    </>
  );
}