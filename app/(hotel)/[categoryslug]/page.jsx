// page.jsx (Category)
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates'; // Import template konten

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

  // IMPORTANT: Ensure NEXT_PUBLIC_API_BASE_URL on your VPS is set to https://hoteloza.com or your correct API URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}`;

  try {
    // ISR with revalidate 1 year (31,536,000 seconds)
    const response = await fetch(apiUrl, { next: { revalidate: 31536000 } });
    if (!response.ok) {
      if (response.status === 404) {
          console.warn(`Failed to fetch category data: 404 Not Found for ${apiUrl}`);
      } else {
          console.error(`Failed to fetch category data for ${apiUrl}. Status: ${response.status} - ${response.statusText}`);
      }
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching category data:', error);
    return null;
  }
}

const ClientPage = dynamic(() => import('./ClientPage'));

// ------ FIX: Dynamically fetch category slugs from the database via API ------
export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Ensure this is correctly set on your VPS!
  if (!baseUrl) {
    console.error("ERROR: NEXT_PUBLIC_API_BASE_URL is not defined for generateStaticParams. Cannot fetch category paths.");
    return []; // Return empty array if not defined
  }

  try {
    // Call your API Route to get all possible category paths
    // Example API endpoint: /api/all-category-paths
    const response = await fetch(`${baseUrl}/api/all-category-paths`, {
      // Use 'no-store' to always get the latest data during build or revalidation
      // This is crucial to ensure the list of paths is always up-to-date
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch all category paths. Status: ${response.status} - ${response.statusText}`);
      // Throw an error to make the build fail if fetching path data is critical.
      // This helps prevent mass 404s in production.
      throw new Error(`Failed to fetch all category paths during build: ${response.statusText}`);
    }

    const paths = await response.json();
    
    // Ensure `paths` is an array of objects with the expected 'categoryslug' property
    // Expected format example: [{ categoryslug: 'hotel' }, { categoryslug: 'motel' }, ...]
    if (!Array.isArray(paths) || paths.some(p => !p.categoryslug)) {
      console.error("Fetched category paths are not in the expected format for generateStaticParams:", paths);
      return []; // Return empty array if data format is incorrect
    }

    console.log(`SERVER DEBUG [page.jsx - generateStaticParams]: Successfully fetched ${paths.length} category paths.`);
    return paths;

  } catch (error) {
    console.error('SERVER FATAL ERROR [page.jsx - generateStaticParams]: Error fetching static paths for categories:', error);
    // Return an empty array on fatal error, will cause 404s for category pages
    return [];
  }
}
// --------------------------------------------------------------------------

export async function generateMetadata({ params }) {
  // As per Next.js guidelines, `params` should be awaited.
  const awaitedParams = await params;
  const categoryslug = awaitedParams.categoryslug;

  const sanitizedCategory = sanitizeSlug(categoryslug);

  const currentUrl = `https://hoteloza.com/${sanitizedCategory}`; // Define canonical URL here

  if (!sanitizedCategory) {
    return {
      title: 'Category Not Found | Hoteloza',
      description: 'The requested category was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl, // Points to itself
      },
    };
  }

  const data = await getCategoryData(categoryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Category Not Found | Hoteloza',
      description: 'The requested category was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl, // Points to itself
      },
    };
  }

  const formattedCategory = formatSlug(sanitizedCategory);
  const currentYear = new Date().getFullYear();

  const longDescriptionSegments = contentTemplates.getCategoryPageDescription(formattedCategory);

  const firstParagraphContent = longDescriptionSegments[0]?.content || '';
  const metaDescription = firstParagraphContent.substring(0, 160) + (firstParagraphContent.length > 160 ? '...' : '');

  return {
    title: `Unbelievable ${formattedCategory} Deals for ${currentYear} - Save Big on Hoteloza!`,
    description: metaDescription,
    openGraph: {
      title: `Top ${formattedCategory} Deals in ${currentYear} | Hoteloza`,
      description: `Explore top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza. Book now for exclusive deals and premium amenities!`,
      url: currentUrl,
      type: 'website',
    },
    // Add canonical tag here
    alternates: {
      canonical: currentUrl, // Points to itself
    },
  };
}

export default async function Page({ params }) {
  // As per Next.js guidelines, `params` should be awaited.
  const awaitedParams = await params;
  const categoryslug = awaitedParams.categoryslug;

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
  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory}`;

  const longDescriptionSegments = contentTemplates.getCategoryPageDescription(formattedCategory);

  const schemaDescription = longDescriptionSegments.map(segment => segment.content).join(' ');

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Top ${formattedCategory} Deals in ${currentYear}`,
      description: schemaDescription,
      url: currentUrl,
      publisher: {
        '@type': 'Organization',
        name: 'Hoteloza',
        logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: formattedCategory, item: currentUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Top ${formattedCategory} in ${currentYear}`,
      description: `A list of top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza.`,
      itemListElement: data.hotels.map((hotel, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Hotel',
          name: hotel.title || hotel.name || 'Unnamed Hotel',
          url: hotel.hotelslug && hotel.countryslug && hotel.stateslug && hotel.cityslug
            ? `${baseUrl}/${hotel.categoryslug}/${hotel.countryslug}/${hotel.stateslug}/${hotel.cityslug}/${hotel.hotelslug}`
            : `${currentUrl}/${hotel.id || index + 1}`,
          image: hotel.img || hotel.slideimg || '',
          address: {
            '@type': 'PostalAddress',
            streetAddress: hotel.lokasi || 'Unknown Address',
            addressLocality: hotel.kota ? formatSlug(hotel.kota) : 'Unknown City',
            addressRegion: hotel['negara bagian'] ? formatSlug(hotel['negara bagian']) : 'Unknown Region',
            addressCountry: hotel.country ? formatSlug(hotel.country) : 'Unknown Country',
          },
          description: hotel.description || hotel.overview || `A ${formattedCategory.toLowerCase()} in ${hotel.kota ? formatSlug(hotel.kota) : 'unknown location'}.`,
        },
      })),
    },
  ];

  return (
    <>
      <Script
        id="category-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <ClientPage categoryslug={sanitizedCategory} longDescriptionSegments={longDescriptionSegments} />
    </>
  );
}