// app/(hotel)/[categoryslug]/[countryslug]/page.jsx
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates';

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

  // MENGGUNAKAN URL LENGKAP HTTPS://HOTELOZA.COM untuk FETCH DATA NEGARA
  const apiUrl = `https://hoteloza.com/api/${sanitizedCategory}/${sanitizedCountry}`;
  console.log('SERVER DEBUG [page.jsx - getCountryData]: Constructed API URL:', apiUrl);

  try {
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

// MENGGUNAKAN generateStaticParams YANG MEMANGGIL API all-country-paths DARI HTTPS://HOTELOZA.COM
export async function generateStaticParams() {
  console.warn("SERVER DEBUG [generateStaticParams]: Attempting to fetch all country paths from https://hoteloza.com/api/all-country-paths.");
  
  try {
    const response = await fetch(`https://hoteloza.com/api/all-country-paths`, { 
      cache: 'no-store' 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SERVER ERROR [generateStaticParams]: Failed to fetch all country paths. Status: ${response.status} - ${response.statusText}. Response: ${errorText}`);
      throw new Error(`Failed to fetch all country paths during build from https://hoteloza.com: ${response.statusText}`);
    }

    const paths = await response.json();
    
    if (!Array.isArray(paths) || paths.some(p => 
      !p.categoryslug || !p.countryslug
    )) {
      console.error("SERVER ERROR [generateStaticParams]: Fetched country paths are not in the expected format:", paths);
      return []; 
    }

    console.log(`SERVER DEBUG [generateStaticParams]: Successfully fetched ${paths.length} country paths.`);
    return paths;

  } catch (error) {
    console.error('SERVER FATAL ERROR [generateStaticParams]: Error fetching static paths for countries:', error);
    return []; 
  }
}

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const categoryslug = awaitedParams.categoryslug;
  const countryslug = awaitedParams.countryslug;

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);

  const currentUrl = `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}`;

  if (!sanitizedCategory || !sanitizedCountry) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category or country was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  const data = await getCountryData(categoryslug, countryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category or country was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  const formattedCountry = formatSlug(sanitizedCountry) || 'Country';
  const formattedCategory = formatSlug(sanitizedCategory) || 'Category';
  const currentYear = new Date().getFullYear();

  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    formattedCategory,
    'country',
    formattedCountry,
    null,
    null,
    formattedCountry
  );

  const firstParagraphContent = longDescriptionSegments[0]?.content || '';
  const metaDescription = firstParagraphContent.substring(0, 160) + (firstParagraphContent.length > 160 ? '...' : '');

  return {
    title: `Cheap ${formattedCategory} in ${formattedCountry} ${currentYear} - Don’t Miss Out! | Hoteloza`,
    description: metaDescription,
    openGraph: {
      title: `Best ${formattedCategory} in ${formattedCountry} ${currentYear} | Hoteloza`,
      description: `Find the best ${formattedCategory.toLowerCase()} in ${formattedCountry} for ${currentYear} on Hoteloza. Book now for top hotels and exclusive deals!`,
      url: currentUrl,
      type: 'website',
    },
    alternates: {
      canonical: currentUrl,
    },
  };
}

export default async function Page({ params }) {
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

  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    formattedCategory,
    'country',
    formattedCountry,
    null,
    null,
    formattedCountry
  );

  const displayCountry = data.hotels[0]?.country ? formatSlug(data.hotels[0].country) : formattedCountry;

  const schemaDescription = longDescriptionSegments.map(segment => segment.content).join(' ');

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Best ${formattedCategory} in ${formattedCountry} ${currentYear}`,
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
        { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${sanitizedCategory}` },
        { '@type': 'ListItem', position: 3, name: formattedCountry, item: currentUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Top ${formattedCategory} in ${formattedCountry} ${currentYear}`,
      description: schemaDescription.substring(0, 160) + '...',
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
        longDescriptionSegments={longDescriptionSegments}
        displayCountry={displayCountry}
        formattedCategory={formattedCategory}
      />
    </>
  );
}