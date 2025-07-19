// page.jsx (Country)
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates'; // Import template konten

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

  // IMPORTANT: Ensure NEXT_PUBLIC_API_BASE_URL on your VPS is set to https://hoteloza.com or your correct API URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}`;

  try {
    // ISR with revalidate 1 year (31,536,000 seconds)
    const response = await fetch(apiUrl, { next: { revalidate: 31536000 } });
    if (!response.ok) {
      if (response.status === 404) {
          console.warn(`Failed to fetch country data: 404 Not Found for ${apiUrl}`);
      } else {
          console.error(`Failed to fetch country data for ${apiUrl}. Status: ${response.status} - ${response.statusText}`);
      }
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching country data:', error);
    return null;
  }
}

const ClientPage = dynamic(() => import('./ClientPage'));

// ------ FIX: Dynamically fetch country slugs from the database via API ------
export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Ensure this is correctly set on your VPS!
  if (!baseUrl) {
    console.error("ERROR: NEXT_PUBLIC_API_BASE_URL is not defined for generateStaticParams. Cannot fetch country paths.");
    return []; // Return empty array if not defined
  }

  try {
    // Call your API Route to get all possible country paths
    // Example API endpoint: /api/all-country-paths
    const response = await fetch(`${baseUrl}/api/all-country-paths`, {
      // Use 'no-store' to always get the latest data during build or revalidation
      // This is crucial to ensure the list of paths is always up-to-date
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch all country paths. Status: ${response.status} - ${response.statusText}`);
      // Throw an error to make the build fail if fetching path data is critical.
      // This helps prevent mass 404s in production.
      throw new Error(`Failed to fetch all country paths during build: ${response.statusText}`);
    }

    const paths = await response.json();
    
    // Ensure `paths` is an array of objects with the expected properties
    // Expected format example: [{ categoryslug: '...', countryslug: '...' }, ...]
    if (!Array.isArray(paths) || paths.some(p => 
      !p.categoryslug || !p.countryslug
    )) {
      console.error("Fetched country paths are not in the expected format for generateStaticParams:", paths);
      return []; // Return empty array if data format is incorrect
    }

    console.log(`SERVER DEBUG [page.jsx - generateStaticParams]: Successfully fetched ${paths.length} country paths.`);
    return paths;

  } catch (error) {
    console.error('SERVER FATAL ERROR [page.jsx - generateStaticParams]: Error fetching static paths for countries:', error);
    // Return an empty array on fatal error, will cause 404s for country pages
    return [];
  }
}
// --------------------------------------------------------------------------

export async function generateMetadata({ params }) {
  // As per Next.js guidelines, `params` should be awaited.
  const awaitedParams = await params;
  const categoryslug = awaitedParams.categoryslug;
  const countryslug = awaitedParams.countryslug;

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);

  const currentUrl = `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}`; // Canonical URL definition here

  if (!sanitizedCategory || !sanitizedCountry) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category or country was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl, // Points to itself
      },
    };
  }

  const data = await getCountryData(categoryslug, countryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category or country was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl, // Points to itself
      },
    };
  }

  const formattedCountry = formatSlug(sanitizedCountry) || 'Country';
  const formattedCategory = formatSlug(sanitizedCategory) || 'Category';
  const currentYear = new Date().getFullYear();

  // Get longDescription as an array of objects from the template
  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    formattedCategory,
    'country', // entityType
    formattedCountry, // entityName
    null, // cityName (not relevant for Country Page)
    null, // stateName (not relevant for Country Page)
    formattedCountry // countryName (same as entityName for Country Page)
  );

  // Get the first sentence or cut from the first paragraph content for meta description
  const firstParagraphContent = longDescriptionSegments[0]?.content || '';
  const metaDescription = firstParagraphContent.substring(0, 160) + (firstParagraphContent.length > 160 ? '...' : '');

  return {
    title: `Cheap ${formattedCategory} in ${formattedCountry} ${currentYear} - Don’t Miss Out! | Hoteloza`,
    description: metaDescription, // Use metaDescription from the first paragraph
    openGraph: {
      title: `Best ${formattedCategory} in ${formattedCountry} ${currentYear} | Hoteloza`,
      description: `Find the best ${formattedCategory.toLowerCase()} in ${formattedCountry} for ${currentYear} on Hoteloza. Book now for top hotels and exclusive deals!`,
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
  const countryslug = awaitedParams.countryslug;
  
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
  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}`;

  // Get longDescription as an array of objects from the template
  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    formattedCategory,
    'country', // entityType
    formattedCountry, // entityName
    null, // cityName
    null, // stateName
    formattedCountry // countryName
  );

  // Get country name, state from the first hotel data if available for FAQ/display
  const displayCountry = data.hotels[0]?.country ? formatSlug(data.hotels[0].country) : formattedCountry;

  // For schema.org description, concatenate all paragraph contents into a single string
  const schemaDescription = longDescriptionSegments.map(segment => segment.content).join(' ');

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Best ${formattedCategory} in ${formattedCountry} ${currentYear}`,
      description: schemaDescription, // Use concatenated string for schema
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
        { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${sanitizedCategory}` },
        { '@type': 'ListItem', position: 3, name: formattedCountry, item: currentUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Top ${formattedCategory} in ${formattedCountry} ${currentYear}`,
      description: schemaDescription.substring(0, 160) + '...', // Use concatenated string, truncate for item list schema
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
            addressCountry: hotel.country ? formatSlug(hotel.country) : formattedCountry || 'Unknown Country',
          },
          description: hotel.description || hotel.overview || `A ${formattedCategory.toLowerCase()} in ${hotel.kota ? formatSlug(hotel.kota) : 'unknown location'}, ${formattedCountry}.`,
        },
      })),
    },
  ];

  return (
    <>
      <Script
        id="country-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <ClientPage
        categoryslug={sanitizedCategory}
        countryslug={sanitizedCountry}
        longDescriptionSegments={longDescriptionSegments} // Pass array of objects
        displayCountry={displayCountry}
        formattedCategory={formattedCategory}
      />
    </>
  );
}