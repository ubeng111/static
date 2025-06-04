import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch category data
async function getCategoryData(categoryslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug);
  if (!sanitizedCategory) {
    console.error('Invalid category slug:', categoryslug);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}`;

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

  if (!sanitizedCategory) {
    return {
      title: 'Category Not Found | Hoteloza',
      description: 'The requested category was not found on Hoteloza.',
    };
  }

  const data = await getCategoryData(categoryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Category Not Found | Hoteloza',
      description: 'The requested category was not found on Hoteloza.',
    };
  }

  const formattedCategory = formatSlug(sanitizedCategory);
  const currentYear = new Date().getFullYear();

  return {
    title: `Unbelievable ${formattedCategory} Deals for ${currentYear} - Save Big on Hoteloza!`,
    description: `Snag jaw-dropping ${formattedCategory.toLowerCase()} deals for ${currentYear} on Hoteloza! Book now for exclusive discounts and luxury amenities you’ll love.`,
    openGraph: {
      title: `Top ${formattedCategory} Deals in ${currentYear} | Hoteloza`,
      description: `Explore top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza. Book now for exclusive deals and premium amenities!`,
      url: `https://hoteloza.com/${sanitizedCategory}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
  const { categoryslug } = params;
  const sanitizedCategory = sanitizeSlug(categoryslug);

  if (!sanitizedCategory) {
    notFound();
  }

  const data = await getCategoryData(categoryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  const formattedCategory = formatSlug(sanitizedCategory);
  const currentYear = new Date().getFullYear();

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: `Top ${formattedCategory} Deals in ${currentYear}`,
        description: `Explore top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza with exclusive deals and premium amenities.`,
        url: `https://hoteloza.com/${sanitizedCategory}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hoteloza.com' },
          { '@type': 'ListItem', position: 2, name: formattedCategory, item: `https://hoteloza.com/${sanitizedCategory}` },
        ],
      },
    ],
  };

  return <ClientPage categoryslug={sanitizedCategory} schema={schema} />;
}