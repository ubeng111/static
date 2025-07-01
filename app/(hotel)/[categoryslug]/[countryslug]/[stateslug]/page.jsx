// page.jsx (State)
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import contentTemplates from '@/utils/contentTemplates'; // Import template konten

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, ''); //

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : ''; //

// Function to fetch state data
async function getStateData(categoryslug, countryslug, stateslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug); //
  const sanitizedCountry = sanitizeSlug(countryslug); //
  const sanitizedState = sanitizeSlug(stateslug); //
  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) { //
    console.error('Invalid slugs:', { categoryslug, countryslug, stateslug }); //
    return null; //
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'; //
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`; //

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' }); //
    if (!response.ok) { //
      console.error(`Failed to fetch state data for ${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}. Status: ${response.status}`); //
      return null; //
    }
    return response.json(); //
  } catch (error) {
    console.error('Error fetching state data:', error); //
    return null; //
  }
}

const ClientPage = dynamic(() => import('./ClientPage')); //

export async function generateMetadata({ params }) {
  // Sesuai petunjuk Next.js, `params` harus diawait sebelum menggunakan propertinya.
  const awaitedParams = await params; //
  const { categoryslug, countryslug, stateslug } = awaitedParams; //

  const sanitizedCategory = sanitizeSlug(categoryslug); //
  const sanitizedCountry = sanitizeSlug(countryslug); //
  const sanitizedState = sanitizeSlug(stateslug); //

  const currentUrl = `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`; // Definisikan URL kanonis di sini

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) { //
    return {
      title: 'Page Not Found | Hoteloza', //
      description: 'The requested category, country, or state was not found on Hoteloza.', //
      // Tambahkan tag canonical di sini
      alternates: {
        canonical: currentUrl, // Menunjuk ke dirinya sendiri
      },
    };
  }

  const data = await getStateData(categoryslug, countryslug, stateslug); //
  if (!data || !data.hotels || data.hotels.length === 0) { //
    return {
      title: 'Page Not Found | Hoteloza', //
      description: 'The requested category, country, or state was not found on Hoteloza.', //
      // Tambahkan tag canonical di sini
      alternates: {
        canonical: currentUrl, // Menunjuk ke dirinya sendiri
      },
    };
  }

  const formattedState = formatSlug(sanitizedState) || 'State'; //
  const formattedCountry = formatSlug(sanitizedCountry) || 'Country'; //
  const formattedCategory = formatSlug(sanitizedCategory) || 'Category'; //
  const currentYear = new Date().getFullYear(); //

  // Dapatkan longDescription sebagai array objek dari template
  const categoryForTemplate = data.hotels[0]?.category || formattedCategory; //

  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription( //
    categoryForTemplate, //
    'state', // entityType
    formattedState, // entityName
    null, // cityName (tidak relevan untuk State Page)
    formattedState, // stateName (sama dengan entityName untuk State Page)
    formattedCountry // countryName
  ); //

  // Ambil kalimat pertama atau potong dari konten paragraf pertama untuk meta description
  const firstParagraphContent = longDescriptionSegments[0]?.content || ''; //
  const metaDescription = firstParagraphContent.substring(0, 160) + (firstParagraphContent.length > 160 ? '...' : ''); //

  return {
    title: `Cheap ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear} - Now Booking! | Hoteloza`, //
    description: metaDescription, // Gunakan metaDescription dari paragraf pertama
    openGraph: {
      title: `Best ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear} | Hoteloza`, //
      description: `Discover the best ${formattedCategory.toLowerCase()} in ${formattedState}, ${formattedCountry} for ${currentYear} on Hoteloza. Book now for exclusive offers and premium amenities!`, // Bisa juga dari longDescription.substring
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
  // Sesuai petunjuk Next.js, `params` harus diawait sebelum menggunakan propertinya.
  const awaitedParams = await params; //
  const { categoryslug, countryslug, stateslug } = awaitedParams; //

  const sanitizedCategory = sanitizeSlug(categoryslug); //
  const sanitizedCountry = sanitizeSlug(countryslug); //
  const sanitizedState = sanitizeSlug(stateslug); //

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) { //
    notFound(); //
  }

  const data = await getStateData(categoryslug, countryslug, stateslug); //
  if (!data || !data.hotels || data.hotels.length === 0) { //
    notFound(); //
  }

  const formattedState = formatSlug(sanitizedState) || 'State'; //
  const formattedCountry = formatSlug(sanitizedCountry) || 'Country'; //
  const formattedCategory = formatSlug(sanitizedCategory) || 'Category'; //
  const currentYear = new Date().getFullYear(); //
  const baseUrl = 'https://hoteloza.com'; //
  const currentUrl = `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`; //

  // Dapatkan longDescription sebagai array objek dari template
  const categoryForTemplate = data.hotels[0]?.category || formattedCategory; //

  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription( //
    categoryForTemplate, //
    'state', // entityType
    formattedState, // entityName
    null, // cityName
    formattedState, // stateName
    formattedCountry // countryName
  ); //

  // Ambil nama negara, provinsi dari data hotel pertama jika ada untuk FAQ/display
  const displayState = data.hotels[0]?.['negara bagian'] ? formatSlug(data.hotels[0]['negara bagian']) : formattedState; //
  const displayCountry = data.hotels[0]?.country ? formatSlug(data.hotels[0].country) : formattedCountry; //
  const displayCategory = data.hotels[0]?.category ? formatSlug(data.hotels[0].category) : formattedCategory; //
  const displayCity = data.hotels[0]?.kota ? formatSlug(data.hotels[0].kota) : 'Unknown City'; // Untuk skema jika perlu


  // Untuk schema.org description, gabungkan semua konten paragraf menjadi satu string
  const schemaDescription = longDescriptionSegments.map(segment => segment.content).join(' '); //

  const schemas = [
    {
      '@context': 'https://schema.org', //
      '@type': 'WebPage', //
      name: `Best ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear}`, //
      description: schemaDescription, // Gunakan schemaDescription (string gabungan dari konten)
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
        { '@type': 'ListItem', position: 3, name: formattedCountry, item: `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}` }, //
        { '@type': 'ListItem', position: 4, name: formattedState, item: currentUrl }, //
      ],
    },
    {
      '@context': 'https://schema.org', //
      '@type': 'ItemList', //
      name: `Top ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear}`, //
      description: schemaDescription.substring(0, 160) + '...', // Gunakan string gabungan, potong untuk skema item list
      itemListElement: data.hotels.map((hotel, index) => ({ //
        '@type': 'ListItem', //
        position: index + 1, //
        item: {
          '@type': 'Hotel', //
          name: hotel.title || hotel.name || 'Unnamed Hotel', //
          url: hotel.hotelslug && hotel.cityslug //
            ? `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${hotel.cityslug}/${hotel.hotelslug}` //
            : `${currentUrl}/${hotel.id || index + 1}`, //
          image: hotel.img || hotel.slideimg || '', //
          address: {
            '@type': 'PostalAddress', //
            streetAddress: hotel.lokasi || 'Unknown Address', //
            addressLocality: hotel.kota ? formatSlug(hotel.kota) : 'Unknown City', //
            addressRegion: hotel['negara bagian'] ? formatSlug(hotel['negara bagian']) : formattedState || 'Unknown Region', //
            addressCountry: hotel.country ? formatSlug(hotel.country) : formattedCountry || 'Unknown Country', //
          },
          description: hotel.description || hotel.overview || `A ${formattedCategory.toLowerCase()} in ${hotel.kota ? formatSlug(hotel.kota) : 'unknown location'}, ${formattedState}, ${formattedCountry}.`, //
        },
      })),
    },
  ];

  return (
    <>
      <Script
        id="state-schema"
        type="application/ld+json"
        dangeriouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <ClientPage
        categoryslug={sanitizedCategory}
        countryslug={sanitizedCountry}
        stateslug={sanitizedState}
        longDescriptionSegments={longDescriptionSegments} // Teruskan array objek longDescriptionSegments
        formattedCategory={formattedCategory}
        formattedCountry={formattedCountry}
        formattedState={formattedState}
        displayState={displayState}
      />
    </>
  );
}