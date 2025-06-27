// app/[lang]/(hotel)/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/page.jsx
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary'; // Menggunakan alias

// **TAMBAHKAN INI UNTUK ISR 1 TAHUN**
export const revalidate = 31536000; // 1 tahun dalam detik (60 * 60 * 24 * 365)

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch city data
async function getCityData(categoryslug, countryslug, stateslug, cityslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);
  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    console.error('Invalid slugs:', { categoryslug, countryslug, stateslug, cityslug });
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`;

  try {
    // **Pastikan fetch() di sini adalah yang Native Web Fetch API**
    // Next.js akan secara otomatis mengaplikasikan `revalidate` yang diekspor di atas
    // ke panggilan fetch ini.
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`Failed to fetch city data for ${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}. Status: ${response.status}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching city data:', error);
    return null;
  }
}

const ClientPage = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  // --- PERBAIKI PENGGUNAAN PARAMS DI generateMetadata ---
  // `params` sudah objek langsung di App Router, tidak perlu await params
  const { categoryslug, countryslug, stateslug, cityslug, lang: locale } = params; 
  // --- AKHIR PERBAIKAN ---
  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const cityPageDict = dictionary?.cityPage || {};
  const commonDict = dictionary?.common || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    return {
      title: metadataDict.cityNotFoundTitle || 'Page Not Found | Hoteloza',
      description: metadataDict.cityNotFoundDescription || 'The requested category, country, state, or city was not found on Hoteloza.',
    };
  }

  const data = await getCityData(categoryslug, countryslug, stateslug, cityslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: metadataDict.cityNotFoundTitle || 'Page Not Found | Hoteloza',
      description: metadataDict.cityNotFoundDescription || 'The requested category, country, state, or city was not found on Hoteloza.',
    };
  }

  const formattedCity = formatSlug(sanitizedCity) || (cityPageDict.cityDefault || 'City');
  const formattedState = formatSlug(sanitizedState) || (cityPageDict.stateDefault || 'State');
  const formattedCountry = formatSlug(sanitizedCountry) || (cityPageDict.countryDefault || 'Country');
  const formattedCategory = formatSlug(sanitizedCategory) || (cityPageDict.categoryDefault || 'Category');
  const currentYear = new Date().getFullYear();

  return {
    title: (metadataDict.cityPageTitleTemplate || `Cheap {formattedCategory} in {formattedCity}, {formattedState}, {formattedCountry} {currentYear} - Big Discounts! | Hoteloza`)
      .replace('{formattedCategory}', formattedCategory)
      .replace('{formattedCity}', formattedCity)
      .replace('{formattedState}', formattedState)
      .replace('{formattedCountry}', formattedCountry)
      .replace('{currentYear}', currentYear),
    description: (metadataDict.cityPageDescriptionTemplate || `Find the best {formattedCategory} in {formattedCity}, {formattedState}, {formattedCountry} for {currentYear} on Hoteloza. Exclusive discounts, top facilities, and unbeatable prices. Book your dream stay now!`)
      .replace('{formattedCategory}', formattedCategory.toLowerCase())
      .replace('{formattedCity}', formattedCity)
      .replace('{formattedState}', formattedState)
      .replace('{formattedCountry}', formattedCountry)
      .replace('{currentYear}', currentYear),
    openGraph: {
      title: (metadataDict.cityOgTitleTemplate || `Best {formattedCategory} in {formattedCity}, {formattedState}, {formattedCountry} {currentYear} | Hoteloza`)
        .replace('{formattedCategory}', formattedCategory)
        .replace('{formattedCity}', formattedCity)
        .replace('{formattedState}', formattedState)
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      description: (metadataDict.cityOgDescriptionTemplate || `Discover top {formattedCategory} in {formattedCity}, {formattedState}, {formattedCountry} for {currentYear} on Hoteloza. Book now for exclusive deals and premium facilities!`)
        .replace('{formattedCategory}', formattedCategory.toLowerCase())
        .replace('{formattedCity}', formattedCity)
        .replace('{formattedState}', formattedState)
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      url: `https://hoteloza.com/${locale}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`, // URL OpenGraph dengan lang
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
  // --- PERBAIKI PENGGUNAAN PARAMS DI KOMPONEN Page ---
  // `params` sudah objek langsung di App Router, tidak perlu await params
  const { categoryslug, countryslug, stateslug, cityslug, lang: locale } = params; 
  // --- AKHIR PERBAIKAN ---
  const dictionary = await getdictionary(locale);

  const currentLang = locale; // Lang saat ini

  const commonDict = dictionary?.common || {};
  const cityPageDict = dictionary?.cityPage || {};
  const metadataDict = dictionary?.metadata || {};
  const navigationDict = dictionary?.navigation || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    notFound();
  }

  const data = await getCityData(categoryslug, countryslug, stateslug, cityslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  const formattedCity = formatSlug(sanitizedCity) || (cityPageDict.cityDefault || 'City');
  const formattedState = formatSlug(sanitizedState) || (cityPageDict.stateDefault || 'State');
  const formattedCountry = formatSlug(sanitizedCountry) || (cityPageDict.countryDefault || 'Country');
  const formattedCategory = formatSlug(sanitizedCategory) || (cityPageDict.categoryDefault || 'Category');
  const currentYear = new Date().getFullYear();

  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`; // URL dasar dengan lang

  const hotelItems = data.hotels.map((hotel, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Hotel',
      name: hotel.name || hotel.title || commonDict.unnamedHotel || 'Unnamed Hotel',
      url: hotel.hotelslug
        ? `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}/${hotel.hotelslug}` // URL hotel detail dengan lang
        : `${currentUrl}/${hotel.id || index + 1}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: hotel.lokasi || commonDict.unknownAddress || 'Unknown Address',
        addressLocality: hotel.kota ? formatSlug(hotel.kota) : formattedCity || commonDict.unknownCity || 'Unknown City',
        addressRegion: hotel['negara bagian'] ? formatSlug(hotel['negara bagian']) : formattedState || commonDict.unknownRegion || 'Unknown Region',
        addressCountry: hotel.country ? formatSlug(hotel.country) : formattedCountry || commonDict.unknownCountry || 'Unknown Country',
      },
      description: hotel.description || hotel.overview || `A ${formattedCategory.toLowerCase()} in ${formattedCity}, ${formattedState}.`,
    },
  }));

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: currentUrl,
        name: (metadataDict.cityOgTitleTemplate || `Top {formattedCategory} in {formattedCity}, {formattedState} {currentYear}`)
          .replace('{formattedCategory}', formattedCategory)
          .replace('{formattedCity}', formattedCity)
          .replace('{formattedState}', formattedState)
          .replace('{currentYear}', currentYear),
        description: (metadataDict.cityOgDescriptionTemplate || `Book top {formattedCategory} in {formattedCity}, {formattedState} for {currentYear} on Hoteloza with exclusive deals and amenities.`)
          .replace('{formattedCategory}', formattedCategory.toLowerCase())
          .replace('{formattedCity}', formattedCity)
          .replace('{formattedState}', formattedState)
          .replace('{currentYear}', currentYear),
        publisher: {
          '@type': 'Organization',
          name: 'Hoteloza',
          logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: navigationDict.home || 'Home', item: `${baseUrl}/${currentLang}` }, // URL Home dengan lang
          { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${currentLang}/${sanitizedCategory}` }, // URL Category dengan lang
          { '@type': 'ListItem', position: 3, name: formattedCountry, item: `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}` }, // URL Country dengan lang
          { '@type': 'ListItem', position: 4, name: formattedState, item: `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}` }, // URL State dengan lang
          { '@type': 'ListItem', position: 5, name: formattedCity, item: currentUrl },
        ],
      },
      {
        '@type': 'ItemList',
        name: (metadataDict.cityOgTitleTemplate || `Top {formattedCategory} in {formattedCity}, {formattedState}`)
          .replace('{formattedCategory}', formattedCategory)
          .replace('{formattedCity}', formattedCity)
          .replace('{formattedState}', formattedState),
        description: (metadataDict.cityOgDescriptionTemplate || `A list of top {formattedCategory} in {formattedCity}, {formattedState} for {currentYear} on Hoteloza.`)
          .replace('{formattedCategory}', formattedCategory.toLowerCase())
          .replace('{formattedCity}', formattedCity)
          .replace('{formattedState}', formattedState)
          .replace('{currentYear}', currentYear),
        itemListElement: hotelItems,
      },
    ],
  };

  return (
    <>
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      <ClientPage
        categoryslug={sanitizedCategory}
        countryslug={sanitizedCountry}
        stateslug={sanitizedState}
        cityslug={sanitizedCity}
        dictionary={dictionary}
        currentLang={currentLang} // Teruskan currentLang
      />
    </>
  );
}

// **Penting untuk Dynamic Routes di App Router:**
// Anda harus mengembalikan semua kombinasi `lang`, `categoryslug`, `countryslug`, `stateslug`, dan `cityslug` yang mungkin
// untuk dibangun secara statis saat waktu build.
// Jika Anda memiliki terlalu banyak kombinasi, Anda bisa mengembalikan daftar kosong atau sebagian kecil,
// dan Next.js akan merender halaman secara on-demand (SSR atau ISR tergantung pada konfigurasi `revalidate`).
export async function generateStaticParams() {
  // Contoh: Mengambil daftar kategori, negara, provinsi/negara bagian, dan kota yang didukung.
  // Ini harus diganti dengan panggilan API aktual yang mengembalikan semua slug
  // yang valid dari backend Anda.
  const allCategories = ['hotel-discounts', 'luxury-hotels']; // Contoh slug kategori
  const allCountries = ['indonesia', 'malaysia']; // Contoh slug negara
  const allStates = ['bali', 'jakarta']; // Contoh slug provinsi/negara bagian untuk Indonesia
  const allCities = ['denpasar', 'ubud']; // Contoh slug kota untuk Bali/Jakarta

  const supportedLangs = ['en', 'us', 'id']; // Bahasa yang Anda dukung

  const params = [];
  for (const lang of supportedLangs) {
    for (const category of allCategories) {
      for (const country of allCountries) {
        for (const state of allStates) {
          // Asumsi cities hanya relevan untuk kombinasi kategori/negara/provinsi tertentu
          for (const city of allCities) {
            params.push({ lang: lang, categoryslug: category, countryslug: country, stateslug: state, cityslug: city });
          }
        }
      }
    }
  }
  return params;

  // Catatan: Jika Anda memiliki jutaan kombinasi, mengembalikan daftar kosong dari
  // generateStaticParams (`return [];`) akan membuat Next.js tidak membangun halaman ini saat build time.
  // Halaman akan dirender secara on-demand saat permintaan pertama.
  // Pastikan `revalidate` diekspor di level `page.jsx` agar on-demand render tersebut
  // tetap memanfaatkan caching dan revalidasi Next.js.
  // Contoh:
  // return [];
}