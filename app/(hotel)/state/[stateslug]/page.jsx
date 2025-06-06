import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch state data
async function getStateData(stateslug) {
  const sanitizedState = sanitizeSlug(stateslug);
  if (!sanitizedState) {
    console.error('Invalid state slug:', stateslug);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/state/${sanitizedState}`; // Updated API URL

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Failed to fetch state data for ${sanitizedState}. Status: ${response.status}`);
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
  const { stateslug } = params; // Removed categoryslug and countryslug
  const sanitizedState = sanitizeSlug(stateslug);

  if (!sanitizedState) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested state was not found on Hoteloza.',
    };
  }

  const data = await getStateData(stateslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested state was not found on Hoteloza.',
    };
  }

  const formattedState = formatSlug(sanitizedState);
  const currentYear = new Date().getFullYear();

  return {
    title: `${currentYear}’s Hottest Hotels in ${formattedState} | Hoteloza`,
    description: `Discover top hotels in ${formattedState} for ${currentYear} on Hoteloza.`,
    openGraph: {
      title: `Top Hotels in ${formattedState} ${currentYear} | Hoteloza`,
      description: `Discover top hotels in ${formattedState} for ${currentYear} on Hoteloza.`,
      url: `https://hoteloza.com/state/${sanitizedState}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
  const { stateslug } = params; // Removed categoryslug and countryslug
  const sanitizedState = sanitizeSlug(stateslug);

  if (!sanitizedState) {
    notFound();
  }

  const data = await getStateData(stateslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  const formattedState = formatSlug(sanitizedState);
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/state/${sanitizedState}`;

  const hotelItems = data.hotels.map((hotel, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Hotel',
      name: hotel.name || hotel.title || 'Unnamed Hotel',
      url: hotel.hotelslug ? `${baseUrl}/hotel/${hotel.hotelslug}` : `${currentUrl}/${hotel.id || index + 1}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: hotel.location || 'Unknown Address',
        addressLocality: hotel.city || 'Unknown City',
        addressRegion: hotel.state || formattedState,
        addressCountry: hotel.country || 'Unknown Country',
      },
      description: hotel.overview || `A hotel in ${hotel.city || 'unknown location'}, ${formattedState}.`,
    },
  }));

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: currentUrl,
        name: `Top Hotels in ${formattedState} ${currentYear}`,
        description: `Discover top hotels in ${formattedState} for ${currentYear} on Hoteloza.`,
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
          { '@type': 'ListItem', position: 2, name: formattedState, item: currentUrl },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Top Hotels in ${formattedState} ${currentYear}`,
        description: `A list of top hotels in ${formattedState} for ${currentYear} on Hoteloza.`,
        itemListElement: hotelItems,
      },
    ],
  };

  return (
    <>
      <Script
        id="state-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <ClientPage stateslug={sanitizedState} /> {/* Removed categoryslug and countryslug */}
    </>
  );
}