import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch country data
async function getCountryData(categoryslug, countryslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  if (!sanitizedCategory || !sanitizedCountry) {
    console.error('Invalid slugs:', { categoryslug, countryslug });
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Failed to fetch country data for ${sanitizedCategory}/${sanitizedCountry}. Status: ${response.status}`);
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
  const { categoryslug, countryslug } = params;
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);

  if (!sanitizedCategory || !sanitizedCountry) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category or country was not found on Hoteloza.',
    };
  }

  const data = await getCountryData(categoryslug, countryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category or country was not found on Hoteloza.',
    };
  }

  const formattedCountry = formatSlug(sanitizedCountry) || 'Country';
  const formattedCategory = formatSlug(sanitizedCategory) || 'Category';
  const currentYear = new Date().getFullYear();

  return {
    title: `Cheap ${formattedCategory} in ${formattedCountry} ${currentYear} - Don’t Miss Out! | Hoteloza`,
    description: `Score the hottest ${formattedCategory.toLowerCase()} in ${formattedCountry} for ${currentYear} on Hoteloza. Limited deals await—book today for unbeatable prices!`,
    openGraph: {
      title: `Best ${formattedCategory} in ${formattedCountry} ${currentYear} | Hoteloza`,
      description: `Find the best ${formattedCategory.toLowerCase()} in ${formattedCountry} for ${currentYear} on Hoteloza. Book now for top hotels and exclusive deals!`,
      url: `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
  const { categoryslug, countryslug } = params;
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);

  if (!sanitizedCategory || !sanitizedCountry) {
    notFound();
  }

  const data = await getCountryData(categoryslug, countryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  const formattedCountry = formatSlug(sanitizedCountry) || 'Country';
  const formattedCategory = formatSlug(sanitizedCategory) || 'Category';
  const currentYear = new Date().getFullYear();

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: `Best ${formattedCategory} in ${formattedCountry} ${currentYear}`,
        description: `Find the best ${formattedCategory.toLowerCase()} in ${formattedCountry} for ${currentYear} on Hoteloza with top hotels and exclusive deals.`,
        url: `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hoteloza.com' },
          { '@type': 'ListItem', position: 2, name: formattedCategory, item: `https://hoteloza.com/${sanitizedCategory}` },
          { '@type': 'ListItem', position: 3, name: formattedCountry, item: `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}` },
        ],
      },
    ],
  };

  return <ClientPage categoryslug={sanitizedCategory} countryslug={sanitizedCountry} schema={schema} />;
}