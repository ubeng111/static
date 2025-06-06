import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Country';

// Function to fetch country data
async function getCountryData(countryslug) {
  const sanitizedCountry = sanitizeSlug(countryslug);
  if (!sanitizedCountry) {
    console.error('Invalid country slug:', countryslug);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/country/${sanitizedCountry}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Failed to fetch country data for ${sanitizedCountry}. Status: ${response.status}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching country data:', error);
    return null;
  }
}

const ClientPage = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  const { countryslug } = params;
  const sanitizedCountry = sanitizeSlug(countryslug);

  if (!sanitizedCountry) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested country was not found on Hoteloza.',
    };
  }

  const data = await getCountryData(countryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested country was not found on Hoteloza.',
    };
  }

  const formattedCountry = formatSlug(sanitizedCountry);
  const currentYear = new Date().getFullYear();

  return {
    title: `${currentYear}’s Hottest Hotels in ${formattedCountry} - Book Now!`,
    description: `Discover ${formattedCountry}’s top hotels for ${currentYear} on Hoteloza. Secure your spot with exclusive deals—don’t wait!`,
    openGraph: {
      title: `Top Hotels in ${formattedCountry} ${currentYear} | Hoteloza`,
      description: `Book top hotels in ${formattedCountry} for ${currentYear} on Hoteloza. Enjoy exclusive deals now!`,
      url: `https://hoteloza.com/country/${sanitizedCountry}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
  const { countryslug } = params;
  const sanitizedCountry = sanitizeSlug(countryslug);

  if (!sanitizedCountry) {
    notFound();
  }

  const data = await getCountryData(countryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  const formattedCountry = formatSlug(sanitizedCountry);
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/country/${sanitizedCountry}`;

  const hotelItems = data.hotels.map((hotel, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Hotel',
      name: hotel.name || hotel.title || 'Unnamed Hotel',
      url: hotel.hotelslug ? `${baseUrl}/city/${hotel.cityslug}/${hotel.hotelslug}` : `${currentUrl}/${hotel.id || index + 1}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: hotel.location || 'Unknown Address',
        addressLocality: hotel.city ? formatSlug(hotel.city) : 'Unknown City',
        addressRegion: hotel.state ? formatSlug(hotel.state) : 'Unknown Region',
        addressCountry: hotel.country ? formatSlug(hotel.country) : formattedCountry,
      },
      description: hotel.overview || `A hotel in ${hotel.city ? formatSlug(hotel.city) : 'unknown location'}, ${formattedCountry}.`,
    },
  }));

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: currentUrl,
        name: `Top Hotels in ${formattedCountry} ${currentYear}`,
        description: `Book top hotels in ${formattedCountry} for ${currentYear} on Hoteloza with exclusive deals and amenities.`,
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
          { '@type': 'ListItem', position: 2, name: formattedCountry, item: currentUrl },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Top Hotels in ${formattedCountry}`,
        description: `A list of top hotels in ${formattedCountry} for ${currentYear} on Hoteloza.`,
        itemListElement: hotelItems,
      },
    ],
  };

  return (
    <>
      <Script
        id="country-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <ClientPage countryslug={sanitizedCountry} />
    </>
  );
}