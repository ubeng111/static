// page.jsx (Country)
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates'; // Import template konten

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, ''); //

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : ''; //

// Function to fetch country data
async function getCountryData(categoryslug, countryslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug); //
  const sanitizedCountry = sanitizeSlug(countryslug); //
  if (!sanitizedCategory || !sanitizedCountry) { //
    console.error('Invalid slugs:', { categoryslug, countryslug }); //
    return null; //
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'; //
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}`; //

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' }); //
    if (!response.ok) { //
      console.error(`Failed to fetch country data for ${sanitizedCategory}/${sanitizedCountry}. Status: ${response.status}`); //
      return null; //
    }
    return response.json(); //
  } catch (error) {
    console.error('Error fetching country data:', error); //
    return null; //
  }
}

const ClientPage = dynamic(() => import('./ClientPage')); //

export async function generateMetadata({ params }) {
  // Sesuai petunjuk Next.js, `params` harus diawait.
  const awaitedParams = await params; //
  const categoryslug = awaitedParams.categoryslug; //
  const countryslug = awaitedParams.countryslug; //

  const sanitizedCategory = sanitizeSlug(categoryslug); //
  const sanitizedCountry = sanitizeSlug(countryslug); //

  const currentUrl = `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}`; // Definisi URL kanonis di sini

  if (!sanitizedCategory || !sanitizedCountry) { //
    return {
      title: 'Page Not Found | Hoteloza', //
      description: 'The requested category or country was not found on Hoteloza.', //
      alternates: {
        canonical: currentUrl, // Menunjuk ke dirinya sendiri
      },
    };
  }

  const data = await getCountryData(categoryslug, countryslug); //
  if (!data || !data.hotels || data.hotels.length === 0) { //
    return {
      title: 'Page Not Found | Hoteloza', //
      description: 'The requested category or country was not found on Hoteloza.', //
      alternates: {
        canonical: currentUrl, // Menunjuk ke dirinya sendiri
      },
    };
  }

  const formattedCountry = formatSlug(sanitizedCountry) || 'Country'; //
  const formattedCategory = formatSlug(sanitizedCategory) || 'Category'; //
  const currentYear = new Date().getFullYear(); //

  // Dapatkan longDescription sebagai array objek dari template
  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription( //
    formattedCategory, //
    'country', // entityType
    formattedCountry, // entityName
    null, // cityName (tidak relevan untuk Country Page)
    null, // stateName (tidak relevan untuk Country Page)
    formattedCountry // countryName (sama dengan entityName untuk Country Page)
  );

  // Ambil kalimat pertama atau potong dari konten paragraf pertama untuk meta description
  const firstParagraphContent = longDescriptionSegments[0]?.content || ''; //
  const metaDescription = firstParagraphContent.substring(0, 160) + (firstParagraphContent.length > 160 ? '...' : ''); //

  return {
    title: `Cheap ${formattedCategory} in ${formattedCountry} ${currentYear} - Don’t Miss Out! | Hoteloza`, //
    description: metaDescription, // Gunakan metaDescription dari paragraf pertama
    openGraph: {
      title: `Best ${formattedCategory} in ${formattedCountry} ${currentYear} | Hoteloza`, //
      description: `Find the best ${formattedCategory.toLowerCase()} in ${formattedCountry} for ${currentYear} on Hoteloza. Book now for top hotels and exclusive deals!`, //
      url: currentUrl, //
      type: 'website', //
    },
    // Tambahkan tag canonical di sini
    alternates: {
      canonical: currentUrl, // Menunjuk ke dirinya sendiri
    },
  };
}

export default async function Page({ params }) {
  // Sesuai petunjuk Next.js, `params` harus diawait.
  const awaitedParams = await params; //
  const categoryslug = awaitedParams.categoryslug; //
  const countryslug = awaitedParams.countryslug; //
  
  const sanitizedCategory = sanitizeSlug(categoryslug); //
  const sanitizedCountry = sanitizeSlug(countryslug); //

  if (!sanitizedCategory || !sanitizedCountry) { //
    notFound(); //
  }

  const data = await getCountryData(categoryslug, countryslug); //
  if (!data || !data.hotels || data.hotels.length === 0) { //
    notFound(); //
  }

  const formattedCountry = formatSlug(sanitizedCountry) || 'Country'; //
  const formattedCategory = formatSlug(sanitizedCategory) || 'Category'; //
  const currentYear = new Date().getFullYear(); //
  const baseUrl = 'https://hoteloza.com'; //
  const currentUrl = `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}`; //

  // Dapatkan longDescription sebagai array objek dari template
  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription( //
    formattedCategory, //
    'country', // entityType
    formattedCountry, // entityName
    null, // cityName
    null, // stateName
    formattedCountry // countryName
  );

  // Ambil nama negara, provinsi dari data hotel pertama jika ada untuk FAQ/display
  const displayCountry = data.hotels[0]?.country ? formatSlug(data.hotels[0].country) : formattedCountry; //

  // Untuk schema.org description, gabungkan semua konten paragraf menjadi satu string
  const schemaDescription = longDescriptionSegments.map(segment => segment.content).join(' '); //

  const schemas = [
    {
      '@context': 'https://schema.org', //
      '@type': 'WebPage', //
      name: `Best ${formattedCategory} in ${formattedCountry} ${currentYear}`, //
      description: schemaDescription, // Gunakan string gabungan untuk schema
      url: currentUrl, //
      publisher: {
        '@type': 'Organization', //
        name: 'Hoteloza', //
        logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` }, //
      },
    },
    {
      '@context': 'https://schema.org', //
      '@type': 'BreadcrumbList', //
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl }, //
        { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${sanitizedCategory}` }, //
        { '@type': 'ListItem', position: 3, name: formattedCountry, item: currentUrl }, //
      ],
    },
    {
      '@context': 'https://schema.org', //
      '@type': 'ItemList', //
      name: `Top ${formattedCategory} in ${formattedCountry} ${currentYear}`, //
      description: schemaDescription.substring(0, 160) + '...', // Gunakan string gabungan, potong untuk skema item list
      itemListElement: data.hotels.map((hotel, index) => ({ //
        '@type': 'ListItem', //
        position: index + 1, //
        item: {
          '@type': 'Hotel', //
          name: hotel.title || hotel.name || 'Unnamed Hotel', //
          url: hotel.hotelslug && hotel.countryslug && hotel.stateslug && hotel.cityslug //
            ? `${baseUrl}/${hotel.categoryslug}/${hotel.countryslug}/${hotel.stateslug}/${hotel.cityslug}/${hotel.hotelslug}` //
            : `${currentUrl}/${hotel.id || index + 1}`, //
          image: hotel.img || hotel.slideimg || '', //
          address: {
            '@type': 'PostalAddress', //
            streetAddress: hotel.lokasi || 'Unknown Address', //
            addressLocality: hotel.kota ? formatSlug(hotel.kota) : 'Unknown City', //
            addressRegion: hotel['negara bagian'] ? formatSlug(hotel['negara bagian']) : 'Unknown Region', //
            addressCountry: hotel.country ? formatSlug(hotel.country) : formattedCountry || 'Unknown Country', //
          },
          description: hotel.description || hotel.overview || `A ${formattedCategory.toLowerCase()} in ${hotel.kota ? formatSlug(hotel.kota) : 'unknown location'}, ${formattedCountry}.`, //
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
        longDescriptionSegments={longDescriptionSegments} // Teruskan array objek
        displayCountry={displayCountry}
        formattedCategory={formattedCategory}
      />
    </>
  );
}