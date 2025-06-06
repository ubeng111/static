import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'City';

// Function to fetch city data
async function getCityData(cityslug) {
  const sanitizedCity = sanitizeSlug(cityslug);
  if (!sanitizedCity) {
    console.error('Invalid city slug:', cityslug);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/city/${sanitizedCity}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Failed to fetch city data for ${sanitizedCity}. Status: ${response.status}`);
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
  const { cityslug } = params;
  const sanitizedCity = sanitizeSlug(cityslug);

  if (!sanitizedCity) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested city was not found on Hoteloza.',
    };
  }

  const data = await getCityData(cityslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested city was not found on Hoteloza.',
    };
  }

  const formattedCity = formatSlug(sanitizedCity);
  const currentYear = new Date().getFullYear();

  return {
    title: `${currentYear}’s Hottest Hotels in ${formattedCity} - Book Now!`,
    description: `Discover ${formattedCity}’s top hotels for ${currentYear} on Hoteloza. Secure your spot with exclusive deals—don’t wait!`,
    openGraph: {
      title: `Top Hotels in ${formattedCity} ${currentYear} | Hoteloza`,
      description: `Book top hotels in ${formattedCity} for ${currentYear} on Hoteloza. Enjoy exclusive deals now!`,
      url: `https://hoteloza.com/city/${sanitizedCity}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
  const { cityslug } = params;
  const sanitizedCity = sanitizeSlug(cityslug);

  if (!sanitizedCity) {
    notFound();
  }

  const data = await getCityData(cityslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  const formattedCity = formatSlug(sanitizedCity);
  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/city/${sanitizedCity}`;
  const currentYear = new Date().getFullYear();

  const hotelItems = data.hotels.map((hotel, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Hotel',
      name: hotel.name || hotel.title || 'Unnamed Hotel',
      url: hotel.hotelslug ? `${baseUrl}/city/${sanitizedCity}/${hotel.hotelslug}` : `${currentUrl}/${hotel.id || index + 1}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: hotel.lokasi || 'Unknown Address',
        addressLocality: hotel.kota ? formatSlug(hotel.kota) : formattedCity,
        addressRegion: hotel['negara bagian'] ? formatSlug(hotel['negara bagian']) : 'Unknown Region',
        addressCountry: hotel.country ? formatSlug(hotel.country) : 'Unknown Country',
      },
      description: hotel.description || hotel.overview || `A hotel in ${formattedCity}.`,
    },
  }));

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: currentUrl,
        name: `Top Hotels in ${formattedCity} ${currentYear}`,
        description: `Book top hotels in ${formattedCity} for ${currentYear} on Hoteloza with exclusive deals and amenities.`,
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
          { '@type': 'ListItem', position: 2, name: formattedCity, item: currentUrl },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Top Hotels in ${formattedCity}`,
        description: `A list of top hotels in ${formattedCity} for ${currentYear} on Hoteloza.`,
        itemListElement: hotelItems,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      <ClientPage cityslug={sanitizedCity} />
    </>
  );
}