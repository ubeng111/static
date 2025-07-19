// app/(hotel)/[categoryslug]/page.jsx
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates';

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

  // MENGGUNAKAN URL LENGKAP HTTPS://HOTELOZA.COM untuk FETCH DATA KATEGORI
  const apiUrl = `https://hoteloza.com/api/${sanitizedCategory}`;
  console.log('SERVER DEBUG [page.jsx - getCategoryData]: Constructed API URL:', apiUrl);

  try {
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

// MENGGUNAKAN generateStaticParams YANG MEMANGGIL API all-category-paths DARI HTTPS://HOTELOZA.COM
export async function generateStaticParams() {
  console.warn("SERVER DEBUG [generateStaticParams]: Attempting to fetch all category paths from https://hoteloza.com/api/all-category-paths.");
  
  try {
    const response = await fetch(`https://hoteloza.com/api/all-category-paths`, { 
      cache: 'no-store' 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SERVER ERROR [generateStaticParams]: Failed to fetch all category paths. Status: ${response.status} - ${response.statusText}. Response: ${errorText}`);
      throw new Error(`Failed to fetch all category paths during build from https://hoteloza.com: ${response.statusText}`);
    }

    const paths = await response.json();
    
    if (!Array.isArray(paths) || paths.some(p => !p.categoryslug)) {
      console.error("SERVER ERROR [generateStaticParams]: Fetched category paths are not in the expected format:", paths);
      return []; 
    }

    console.log(`SERVER DEBUG [generateStaticParams]: Successfully fetched ${paths.length} category paths.`);
    return paths;

  } catch (error) {
    console.error('SERVER FATAL ERROR [generateStaticParams]: Error fetching static paths for categories:', error);
    return []; 
  }
}

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const categoryslug = awaitedParams.categoryslug;

  const sanitizedCategory = sanitizeSlug(categoryslug);

  const currentUrl = `https://hoteloza.com/${sanitizedCategory}`;

  if (!sanitizedCategory) {
    return {
      title: 'Category Not Found | Hoteloza',
      description: 'The requested category was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  const data = await getCategoryData(categoryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Category Not Found | Hoteloza',
      description: 'The requested category was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl,
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
    alternates: {
      canonical: currentUrl,
    },
  };
}

export default async function Page({ params }) {
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