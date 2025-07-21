// app/(hotel)/[categoryslug]/page.jsx
import { notFound } from 'next/navigation';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates';
import { Pool } from 'pg'; // TETAP DIHAPUS DI FINAL CODE, INI HANYA UNTUK MENGINGATKAN!
import fs from 'fs';       // TETAP DIHAPUS DI FINAL CODE, INI HANYA UNTUK MENGINGATKAN!
import path from 'path';     // TETAP DIHAPUS DI FINAL CODE, INI HANYA UNTUK MENGINGATKAN!
import 'dotenv/config';    // TETAP DIHAPUS DI FINAL CODE, INI HANYA UNTUK MENGINGATKAN!
import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

// === PENTING: HAPUS BAGIAN INI DARI FILE PAGE.JSX ANDA ===
// Kode database ini harus berada di API Route Anda (misalnya: app/api/hotel/[...slug]/route.js)
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
//   ssl: { ca: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'root.crt')) },
// });
// === AKHIR BAGIAN YANG HARUS DIHAPUS ===


// Helper function to format slugs (tetap digunakan untuk tampilan, bukan untuk sanitasi URL API)
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch category data - VERSI YANG LEBIH SEDERHANA
async function getCategoryData(categoryslug) {
  if (!categoryslug) {
    console.error('SERVER ERROR [page.jsx - getCategoryData]: categoryslug is empty.');
    return { hotels: [] };
  }

  // === PERUBAHAN UTAMA: Hanya satu pola URL API yang digunakan ===
  // Asumsi: API Route Anda dapat menangani seluruh string categoryslug
  // baik itu "luxury-hotels" atau "nigeria/federal-capital-territory/abuja"
  // API Route Anda harus berupa sesuatu seperti app/api/hotel/[...categoryPath]/route.js
  // atau pages/api/hotel/[...categoryPath].js
  const encodedCategorySlug = encodeURIComponent(categoryslug);
  const baseUrlApi = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrlApi}/api/${encodedCategorySlug}`; // Contoh: http://localhost:3000/api/hotel/nigeria/federal-capital-territory/abuja

  console.log('SERVER DEBUG [page.jsx - getCategoryData]: Constructed API URL:', apiUrl);

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 31536000 } });
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

const ClientPage = dynamicImport(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const categoryslug = awaitedParams.categoryslug;

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
  const awaitedParams = await params;
  const categoryslug = awaitedParams.categoryslug;

  if (!categoryslug) {
    // Consider adding a notFound() here if a page with an empty slug should not exist
  }

  let formattedCategory = 'Hotels'; // Fallback
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
  const currentUrl = `${baseUrl}/hotel/${categoryslug}`;

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
          const itemUrl = `${baseUrl}/hotel/${pathSegment}`;
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
            ? `${baseUrl}/hotel/${hotel.categoryslug || 'hotels'}/${hotel.countryslug}/${hotel.stateslug}/${hotel.cityslug}/${hotel.hotelslug}` // Menambahkan /hotel/
            : `${currentUrl}/${hotel.id || index + 1}`, // Fallback jika slug hotel tidak lengkap
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
        categoryslug={categoryslug || 'hotels'}
        longDescriptionSegments={longDescriptionSegments}
        initialCategoryName={formattedCategory}
        initialHotelsData={data.hotels || []}
      />
    </>
  );
}