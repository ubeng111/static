// app/(hotel)/[categoryslug]/page.jsx
import { notFound } from 'next/navigation';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates';
import dynamicImport from 'next/dynamic';


 
const REVALIDATE_IN_SECONDS = 31536000;

// Function to fetch category data
async function getCategoryData(categoryslug) {
  if (!categoryslug) {
    console.error('SERVER ERROR [page.jsx - getCategoryData]: categoryslug is empty.');
    return { hotels: [] };
  }

  const encodedCategorySlug = encodeURIComponent(categoryslug);
  const baseUrlApi = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrlApi}/api/${encodedCategorySlug}`;

  console.log('SERVER DEBUG [page.jsx - getCategoryData]: Constructed API URL:', apiUrl);

  try {
    const response = await fetch(apiUrl, { 
      // KUNCI ISR: Mengatur revalidasi data setelah REVALIDATE_IN_SECONDS (1 tahun)
      next: { revalidate: REVALIDATE_IN_SECONDS } 
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`SERVER WARN [page.jsx - getCategoryData]: Failed to fetch category data: 404 Not Found for ${apiUrl}`);
      } else {
        const errorText = await response.text();
        console.error(`SERVER ERROR [page.jsx - getCategoryData]: Failed to fetch category data for ${apiUrl}. Status: ${response.status} - ${response.statusText}. Response: ${errorText}`);
      }
      return { hotels: [] };
    }
    const data = await response.json();
    return data || { hotels: [] };
  } catch (error) {
    console.error('SERVER FATAL ERROR [page.jsx - getCategoryData]: Error fetching category data:', error);
    return { hotels: [] };
  }
}

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// dynamic import untuk ClientPage
const ClientPage = dynamicImport(() => import('./ClientPage'));

// HAPUS FUNGSI generateStaticParams
// export async function generateStaticParams() {
//   // Fungsi ini tidak lagi digunakan
//   return [];
// }


export async function generateMetadata({ params }) {
  const categoryslug = params.categoryslug;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/hotel/${categoryslug}`;

  let title = 'Category Not Found | Hoteloza';
  let description = 'The requested category was not found on Hoteloza. Discover amazing hotel deals on Hoteloza!';
  let ogTitle = 'Explore Hotel Deals | Hoteloza';
  let ogDescription = 'Discover amazing hotel deals and premium amenities on Hoteloza.';

  if (!categoryslug) {
    return {
      title,
      description,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: currentUrl,
        type: 'website',
      },
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  const data = await getCategoryData(categoryslug);

  if (data && data.hotels && data.hotels.length > 0) {
    const displayCategoryName = formatSlug(categoryslug.split('/').pop());
    const currentYear = new Date().getFullYear();

    const longDescriptionSegments = contentTemplates.getCategoryPageDescription(displayCategoryName);
    const firstParagraphContent = longDescriptionSegments[0]?.content || '';
    const metaDescription = firstParagraphContent.substring(0, 160) + (firstParagraphContent.length > 160 ? '...' : '');

    title = `Unbelievable ${displayCategoryName} Deals for ${currentYear} - Save Big on Hoteloza!`;
    description = metaDescription;
    ogTitle = `Top ${displayCategoryName} Deals in ${currentYear} | Hoteloza`;
    ogDescription = `Explore top ${displayCategoryName.toLowerCase()} for ${currentYear} on Hoteloza. Book now for exclusive deals and premium amenities!`;
  } else {
    // Fallback for metadata if no hotels are found
    const displayCategoryName = formatSlug(categoryslug.split('/').pop()) || 'Hotels';
    title = `Hotels and Accommodations for ${displayCategoryName} | Hoteloza`;
    description = `Discover amazing hotel deals and premium amenities across various categories on Hoteloza. Find your perfect stay!`;
    ogTitle = `Best Hotel Deals & Accommodations | Hoteloza`;
    ogDescription = `Explore a wide range of hotels and accommodations for your next trip on Hoteloza.`;
  }

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: currentUrl,
      type: 'website',
    },
    alternates: {
      canonical: currentUrl,
    },
  };
}

export default async function Page({ params }) {
  const categoryslug = params.categoryslug;

  if (!categoryslug) {
    notFound();
  }

  let formattedCategory = 'Hotel';
  let data = { hotels: [] };
  let longDescriptionSegments;

  const currentYear = new Date().getFullYear();

  if (categoryslug) {
    data = await getCategoryData(categoryslug);
    if (data && data.hotels && data.hotels.length > 0) {
      formattedCategory = formatSlug(categoryslug.split('/').pop());
    } else {
      formattedCategory = formatSlug(categoryslug.split('/').pop()) || 'Hotels';
    }
  }

  longDescriptionSegments = contentTemplates.getCategoryPageDescription(formattedCategory);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${categoryslug}`;

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
        ...categoryslug.split('/').map((segment, index) => {
          const pathSegment = categoryslug.split('/').slice(0, index + 1).join('/');
          const itemUrl = `${baseUrl}/${pathSegment}`;
          return { '@type': 'ListItem', position: index + 2, name: formatSlug(segment), item: itemUrl };
        }),
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Top ${formattedCategory} in ${currentYear}`,
      description: `A list of top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza.`,
      itemListElement: (data.hotels || []).map((hotel, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Hotel',
          name: hotel.title || hotel.name || 'Unnamed Hotel',
          url: hotel.hotelslug && hotel.countryslug && hotel.stateslug && hotel.cityslug
            ? `${baseUrl}/${hotel.categoryslug || 'hotel'}/${hotel.countryslug}/${hotel.stateslug}/${hotel.cityslug}/${hotel.hotelslug}`
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
      <ClientPage
        categoryslug={categoryslug || 'hotel'}
        longDescriptionSegments={longDescriptionSegments}
        initialCategoryName={formattedCategory}
        initialHotelsData={data.hotels || []}
      />
    </>
  );
}