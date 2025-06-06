// page.jsx
import dynamic from 'next/dynamic';
import Script from 'next/script';

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Category';

// Function to fetch category data
async function getCategoryData(categoryslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug);
  if (!sanitizedCategory) {
    console.error('Invalid category slug:', categoryslug);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/category/${sanitizedCategory}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Failed to fetch category data for ${sanitizedCategory}. Status: ${response.status}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching category data:', error);
    return null;
  }
}

const ClientPage = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  const { categoryslug } = params;
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const formattedCategory = formatSlug(sanitizedCategory);
  const currentYear = new Date().getFullYear();

  const data = await getCategoryData(categoryslug);
  return {
    title: `${currentYear}’s Hottest ${formattedCategory} Deals | Hoteloza`,
    description: `Explore top ${formattedCategory.toLowerCase()} deals for ${currentYear} on Hoteloza. Find the best accommodations for your next trip.`,
    openGraph: {
      title: `Top ${formattedCategory} Deals ${currentYear} | Hoteloza`,
      description: `Explore top ${formattedCategory.toLowerCase()} deals for ${currentYear} on Hoteloza.`,
      url: `https://hoteloza.com/category/${sanitizedCategory}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
  const { categoryslug } = params;
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const formattedCategory = formatSlug(sanitizedCategory);
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/category/${sanitizedCategory}`;

  const data = await getCategoryData(categoryslug);
  const hotels = data?.hotels || [];
  const relatedcategory = data?.relatedcategory || [];

  const hotelItems = hotels.length > 0 ? hotels.map((hotel, index) => ({
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
        addressRegion: hotel.state || 'Unknown Region',
        addressCountry: hotel.country || 'Unknown Country',
      },
      description: hotel.overview || `A ${formattedCategory.toLowerCase()} in ${hotel.city || 'unknown location'}.`,
    },
  })) : [];

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: currentUrl,
        name: `Top ${formattedCategory} Deals ${currentYear}`,
        description: `Explore top ${formattedCategory.toLowerCase()} deals for ${currentYear} on Hoteloza.`,
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
          { '@type': 'ListItem', position: 2, name: formattedCategory, item: currentUrl },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Top ${formattedCategory} Deals ${currentYear}`,
        description: `A list of top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza.`,
        itemListElement: hotelItems,
      },
    ],
  };

  return (
    <>
      <Script
        id="category-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <ClientPage categoryslug={sanitizedCategory} initialData={{ hotels, relatedcategory }} />
    </>
  );
}