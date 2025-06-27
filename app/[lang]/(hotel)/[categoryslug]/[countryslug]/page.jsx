// app/[lang]/(hotel)/[categoryslug]/[countryslug]/page.jsx
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary';

// **TAMBAHKAN INI UNTUK ISR 1 TAHUN**
export const revalidate = 31536000; // 1 tahun dalam detik (60 * 60 * 24 * 365)

const sanitizeSlug = (slug) => {
  const sanitized = slug?.replace(/[^a-zA-Z0-9-]/g, '');
  if (!sanitized && slug) {    console.warn(`sanitizeSlug: Input '${slug}' resulted in empty/null slug.`);
  }
  return sanitized;
};

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

async function getCountryData(categoryslug, countryslug) {  console.log('getCountryData: Received slugs - category:', categoryslug, 'country:', countryslug);

  const sanitizedCategory = sanitizeSlug(categoryslug);  const sanitizedCountry = sanitizeSlug(countryslug);

  console.log('getCountryData: Sanitized slugs - category:', sanitizedCategory, 'country:', sanitizedCountry);

  if (!sanitizedCategory || !sanitizedCountry) {    console.error('getCountryData: INVALID OR MISSING SLUGS AFTER SANITIZATION. category:', sanitizedCategory, 'country:', sanitizedCountry);
    return null;
  }

  // Ensure NEXT_PUBLIC_API_BASE_URL is correctly set in your .env file
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}`;  console.log('getCountryData: Constructed API URL:', apiUrl);

  try {
    // **Pastikan fetch() di sini adalah yang Native Web Fetch API**
    // Next.js akan secara otomatis mengaplikasikan `revalidate` yang diekspor di atas
    // ke panggilan fetch ini.
    const response = await fetch(apiUrl); 
    if (!response.ok) {
      const errorText = await response.text();      console.error(
        `getCountryData: Failed to fetch country data from API. Status: ${response.status} - ${response.statusText}. Response Body: ${errorText}`
      );
      return null;
    }
    const data = await response.json();    console.log('getCountryData: Raw data received from API:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {    console.error('getCountryData: Error fetching country data:', error);
    return null;
  }
}

const ClientPageCountry = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  // `params` sudah objek langsung di App Router, tidak perlu await params
  const { categoryslug, countryslug, lang: locale } = params; 

  console.log('generateMetadata (Country): Received params - category:', categoryslug, 'country:', countryslug, 'lang:', locale);

  const dictionary = await getdictionary(locale);  const metadataDict = dictionary?.metadata || {};
  const countryPageDict = dictionary?.countryPage || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);  const sanitizedCountry = sanitizeSlug(countryslug);

  if (!sanitizedCategory || !sanitizedCountry) {    console.error('generateMetadata (Country): Missing required slugs after sanitization. Returning default metadata.');
    return {
      title: metadataDict.countryNotFoundTitle || 'Page Not Found | Hoteloza',
      description: metadataDict.countryNotFoundDescription || 'The requested category or country was not found on Hoteloza.',
    };
  }

  // Data ini juga akan di-cache sesuai `revalidate` yang diekspor di atas.
  const data = await getCountryData(categoryslug, countryslug);
  // Enhanced logging for metadata generation
  console.log('generateMetadata (Country): Data from getCountryData for metadata:', JSON.stringify(data, null, 2));  if (!data || !data.hotels || data.hotels.length === 0) {
    console.error('generateMetadata (Country): Country data is null, or hotels array is missing/empty. Data:', data);
    return {
      title: metadataDict.countryNotFoundTitle || 'Page Not Found | Hoteloza',
      description: metadataDict.countryNotFoundDescription || 'The requested category or country was not found on Hoteloza.',
    };
  }

  const formattedCountry = formatSlug(sanitizedCountry) || (countryPageDict.countryDefault || 'Country');
  const formattedCategory = formatSlug(sanitizedCategory) || (countryPageDict.categoryDefault || 'Category');
  const currentYear = new Date().getFullYear();

  return {
    title: (metadataDict.countryPageTitleTemplate || `Cheap {formattedCategory} in {formattedCountry} {currentYear} - Don’t Miss Out! | Hoteloza`)
      .replace('{formattedCategory}', formattedCategory)
      .replace('{formattedCountry}', formattedCountry)
      .replace('{currentYear}', currentYear),
    description: (metadataDict.countryPageDescriptionTemplate || `Score the best {formattedCategory} in {formattedCountry} for {currentYear} on Hoteloza. Get exclusive deals, low prices, and top amenities. Limited offers—book your stay today!`)
      .replace('{formattedCategory}', formattedCategory.toLowerCase())
      .replace('{formattedCountry}', formattedCountry)
      .replace('{currentYear}', currentYear),
    openGraph: {
      title: (metadataDict.countryOgTitleTemplate || `Best {formattedCategory} in {formattedCountry} {currentYear} | Hoteloza`)
        .replace('{formattedCategory}', formattedCategory)
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      description: (metadataDict.countryOgDescriptionTemplate || `Find the best {formattedCategory} in {formattedCountry} for {currentYear} on Hoteloza. Book now for top hotels and exclusive deals!`)
        .replace('{formattedCategory}', formattedCategory.toLowerCase())
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      url: `https://hoteloza.com/${locale}/${sanitizedCategory}/${sanitizedCountry}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
  // `params` sudah objek langsung di App Router, tidak perlu await params
  const { categoryslug, countryslug, lang: locale } = params; 

  console.log('Page component (Country): Received params - category:', categoryslug, 'country:', countryslug, 'lang:', locale);

  const dictionary = await getdictionary(locale);  const currentLang = locale;

  const commonDict = dictionary?.common || {};
  const countryPageDict = dictionary?.countryPage || {};
  const metadataDict = dictionary?.metadata || {};
  const navigationDict = dictionary?.navigation || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);  const sanitizedCountry = sanitizeSlug(countryslug);

  console.log('Page component (Country): Sanitized slugs for component - category:', sanitizedCategory, 'country:', sanitizedCountry);


  if (!sanitizedCategory || !sanitizedCountry) {    console.error('Page component (Country): Missing required slugs after sanitization. Calling notFound(). category:', sanitizedCategory, 'country:', sanitizedCountry);
    notFound();
  }

  // Data ini juga akan di-cache sesuai `revalidate` yang diekspor di atas.
  const data = await getCountryData(categoryslug, countryslug);  console.log('Page component (Country): Data from getCountryData:', JSON.stringify(data, null, 2));

  // This is the primary check causing your error.
  // The 'data' object must be not null/undefined, AND
  // 'data.hotels' must exist AND be a non-empty array.
  if (!data || !data.hotels || data.hotels.length === 0) {    console.error('Page component (Country): Country data is null, or hotels array is missing/empty. Calling notFound(). Data:', data);
    notFound();
  }

  const formattedCountry = formatSlug(sanitizedCountry) || (countryPageDict.countryDefault || 'Country');
  const formattedCategory = formatSlug(sanitizedCategory) || (countryPageDict.categoryDefault || 'Category');
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com'; // This should probably come from an env var too, or be dynamic
  const currentUrl = `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}`;

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: (metadataDict.countryPageTitleTemplate || `Best {formattedCategory} in {formattedCountry} {currentYear}`)
        .replace('{formattedCategory}', formattedCategory)
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      description: (metadataDict.countryPageDescriptionTemplate || `Find the best {formattedCategory} in {formattedCountry} for {currentYear} on Hoteloza with top hotels and exclusive deals.`)
        .replace('{formattedCategory}', formattedCategory.toLowerCase())
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
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
        { '@type': 'ListItem', position: 1, name: navigationDict.home || 'Home', item: `${baseUrl}/${currentLang}` },
        { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${currentLang}/${sanitizedCategory}` },
        { '@type': 'ListItem', position: 3, name: formattedCountry, item: currentUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: (metadataDict.countryOgTitleTemplate || `Top {formattedCategory} in {formattedCountry} {currentYear}`)
        .replace('{formattedCategory}', formattedCategory)
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      description: (metadataDict.countryOgDescriptionTemplate || `A list of top {formattedCategory} in {formattedCountry} for {currentYear} on Hoteloza.`)
        .replace('{formattedCategory}', formattedCategory.toLowerCase())
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      itemListElement: data.hotels.map((hotel, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Hotel',
          name: hotel.title || hotel.name || commonDict.unnamedHotel,
          url: hotel.hotelslug && hotel.stateslug && hotel.cityslug
            ? `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${hotel.stateslug}/${hotel.cityslug}/${hotel.hotelslug}`
            : `${currentUrl}/${hotel.id || index + 1}`,
          image: hotel.img || hotel.slideimg || '',
          address: {
            '@type': 'PostalAddress',
            streetAddress: hotel.lokasi || commonDict.unknownAddress,
            addressLocality: hotel.kota ? formatSlug(hotel.kota) : commonDict.unknownCity,
            addressRegion: hotel['negara bagian'] ? formatSlug(hotel['negara bagian']) : commonDict.unknownRegion,
            addressCountry: hotel.country ? formatSlug(hotel.country) : (commonDict.unknownCountry || formattedCountry),
          },
          description: hotel.description || hotel.overview || `${formattedCategory.toLowerCase()} in ${hotel.kota ? formatSlug(hotel.kota) : (commonDict.unknownLocation || 'unknown location')}, ${formattedCountry}.`,
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
      {/* Pass initialData to ClientPageCountry for SWR hydration */}
      <ClientPageCountry
        categoryslug={sanitizedCategory}
        countryslug={sanitizedCountry}
        dictionary={dictionary}
        currentLang={currentLang}
        initialData={data} // Pass the fetched data as initialData
      />
    </>
  );
}

// **Penting untuk Dynamic Routes di App Router:**
// Anda harus mengembalikan semua kombinasi `lang`, `categoryslug`, dan `countryslug` yang mungkin
// untuk dibangun secara statis saat waktu build. Jika Anda memiliki terlalu banyak,
// Anda bisa mengembalikan daftar kosong atau sebagian kecil, dan Next.js akan merender
// halaman secara on-demand (SSR atau ISR tergantung pada konfigurasi `revalidate`).
export async function generateStaticParams() {
  // Contoh: Mengambil daftar kategori dan negara yang didukung.
  // Ini harus diganti dengan panggilan API aktual yang mengembalikan semua slug
  // kategori dan negara yang valid dari backend Anda.
  const allCategories = ['hotel-discounts', 'luxury-hotels']; // Contoh slug kategori
  const allCountries = ['indonesia', 'malaysia', 'thailand']; // Contoh slug negara
  const supportedLangs = ['en', 'us', 'id']; // Bahasa yang Anda dukung

  const params = [];
  for (const lang of supportedLangs) {
    for (const category of allCategories) {
      for (const country of allCountries) {
        params.push({ lang: lang, categoryslug: category, countryslug: country });
      }
    }
  }
  return params;

  // Catatan: Jika Anda memiliki jutaan kombinasi, mengembalikan daftar kosong dari
  // generateStaticParams akan membuat Next.js tidak membangun halaman ini saat build time.
  // Halaman akan dirender secara on-demand saat permintaan pertama.
  // Pastikan `revalidate` diekspor di level `page.jsx` agar on-demand render tersebut
  // tetap memanfaatkan caching dan revalidasi Next.js.
  // return []; // Contoh jika Anda tidak ingin membangun apapun di build time
}