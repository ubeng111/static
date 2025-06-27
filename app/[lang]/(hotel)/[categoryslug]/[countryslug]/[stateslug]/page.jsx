// app/[lang]/(hotel)/[categoryslug]/[countryslug]/[stateslug]/page.jsx
// Hapus dynamic import 'next/dynamic' dari sini, karena tidak lagi diperlukan di Server Component ini
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Suspense } from 'react'; // Pastikan Suspense diimpor
import { getdictionary } from '@/dictionaries/get-dictionary'; // Menggunakan alias

// Import ClientPage secara langsung karena ClientPage sekarang adalah Client Component dengan 'use client;'
import ClientPage from './ClientPage';


// **TAMBAHKAN INI UNTUK ISR 1 TAHUN**
export const revalidate = 31536000; // 1 tahun dalam detik (60 * 60 * 24 * 365)

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => {
  const sanitized = slug?.replace(/[^a-zA-Z0-9-]/g, '') || '';
  if (!sanitized && slug) {
    console.warn(`sanitizeSlug: Input '${slug}' resulted in empty/null slug.`);
  }
  return sanitized;
};

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch state data
async function getStateData(categoryslug, countryslug, stateslug) {
  console.log('getStateData: Received slugs - category:', categoryslug, 'country:', countryslug, 'state:', stateslug);

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) {
    console.error('getStateData: INVALID OR MISSING SLUGS AFTER SANITIZATION. category:', sanitizedCategory, 'country:', sanitizedCountry, 'state:', sanitizedState);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`;
  console.log('getStateData: Constructed API URL:', apiUrl);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `getStateData: Failed to fetch state data from API. Status: ${response.status} - ${response.statusText}. Response Body: ${errorText}`
      );
      return null;
    }
    const data = await response.json();
    console.log('getStateData: Raw data received from API (truncated for brevity):', JSON.stringify(data, null, 2).substring(0, 500) + '...');
    return data;
  } catch (error) {
    console.error('getStateData: Error fetching state data:', error);
    return null;
  }
}

// Hapus dynamic import ClientPage dari sini. Ini penyebab errornya.


export async function generateMetadata({ params }) {
  const { categoryslug, countryslug, stateslug, lang: locale } = params;

  console.log('generateMetadata (State): Received params - category:', categoryslug, 'country:', countryslug, 'state:', stateslug, 'lang:', locale);

  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const statePageDict = dictionary?.statePage || {};
  const commonDict = dictionary?.common || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) {
    console.warn('generateMetadata (State): Missing required slugs after sanitization. Returning default metadata.');
    return {
      title: metadataDict.stateNotFoundTitle || 'Page Not Found | Hoteloza',
      description: metadataDict.stateNotFoundDescription || 'The requested category, country, or state was not found on Hoteloza.',
    };
  }

  const data = await getStateData(categoryslug, countryslug, stateslug);
  console.log('generateMetadata (State): Data from getStateData for metadata (truncated):', JSON.stringify(data, null, 2).substring(0, 500) + '...');
  if (!data || !data.hotels || data.hotels.length === 0) {
    console.warn('generateMetadata (State): State data is null, or hotels array is missing/empty. Data:', data);
    return {
      title: metadataDict.stateNotFoundTitle || 'Page Not Found | Hoteloza',
      description: metadataDict.stateNotFoundDescription || 'The requested category, country, or state was not found on Hoteloza.',
    };
  }

  const formattedState = formatSlug(sanitizedState) || (statePageDict.stateDefault || 'Province');
  const formattedCountry = formatSlug(sanitizedCountry) || (statePageDict.countryDefault || 'Country');
  const formattedCategory = formatSlug(sanitizedCategory) || (statePageDict.categoryDefault || 'Category');
  const currentYear = new Date().getFullYear();

  const ogUrl = `https://hoteloza.com/${locale}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`;
  const ogImage = data.hotels[0]?.img || data.hotels[0]?.slideimg || 'https://hoteloza.com/og-image.jpg';

  return {
    title: (metadataDict.statePageTitleTemplate || `Cheap {formattedCategory} in {formattedState}, {formattedCountry} {currentYear} - Book Now! | Hoteloza`)
      .replace('{formattedCategory}', formattedCategory)
      .replace('{formattedState}', formattedState)
      .replace('{formattedCountry}', formattedCountry)
      .replace('{currentYear}', currentYear),
    description: (metadataDict.statePageDescriptionTemplate || `Find the best {formattedCategory} in {formattedState}, {formattedCountry} for {currentYear} on Hoteloza. Exclusive deals, great prices, and top-notch facilities. Book your unforgettable stay!`)
      .replace('{formattedCategory}', formattedCategory.toLowerCase())
      .replace('{formattedState}', formattedState)
      .replace('{formattedCountry}', formattedCountry)
      .replace('{currentYear}', currentYear),
    openGraph: {
      title: (metadataDict.stateOgTitleTemplate || `Best {formattedCategory} in {formattedState}, {formattedCountry} {currentYear} | Hoteloza`)
        .replace('{formattedCategory}', formattedCategory)
        .replace('{formattedState}', formattedState)
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      description: (metadataDict.stateOgDescriptionTemplate || `Discover top {formattedCategory} in {formattedState}, {formattedCountry} for {currentYear} on Hoteloza. Book now for exclusive deals and premium facilities!`)
        .replace('{formattedCategory}', formattedCategory.toLowerCase())
        .replace('{formattedState}', formattedState)
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      url: ogUrl,
      images: [{ url: ogImage }],
      type: 'website',
    },
    alternates: {
      canonical: ogUrl,
      languages: {
        'en-US': `https://hoteloza.com/en/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`,
        'id-ID': `https://hoteloza.com/id/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`,
        'x-default': `https://hoteloza.com/en/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`,
      },
    },
  };
}

export default async function Page({ params }) {
  const { categoryslug, countryslug, stateslug, lang: locale } = params;

  console.log('Page component (State): Received params - category:', categoryslug, 'country:', countryslug, 'state:', stateslug, 'lang:', locale);

  const dictionary = await getdictionary(locale);

  const currentLang = locale;

  const commonDict = dictionary?.common || {};
  const statePageDict = dictionary?.statePage || {};
  const metadataDict = dictionary?.metadata || {};
  const navigationDict = dictionary?.navigation || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);

  console.log('Page component (State): Sanitized slugs for component - category:', sanitizedCategory, 'country:', sanitizedCountry, 'state:', sanitizedState);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) {
    console.error('Page component (State): Missing required slugs after sanitization. Calling notFound(). category:', sanitizedCategory, 'country:', sanitizedCountry, 'state:', sanitizedState);
    notFound();
  }

  const data = await getStateData(categoryslug, countryslug, stateslug);
  console.log('Page component (State): Data from getStateData (truncated):', JSON.stringify(data, null, 2).substring(0, 500) + '...');

  if (!data || !data.hotels || data.hotels.length === 0) {
    console.error('Page component (State): State data is null, or hotels array is missing/empty. Calling notFound(). Data:', data);
    notFound();
  }

  const formattedState = formatSlug(sanitizedState) || (statePageDict.stateDefault || 'Province');
  const formattedCountry = formatSlug(sanitizedCountry) || (statePageDict.countryDefault || 'Country');
  const formattedCategory = formatSlug(sanitizedCategory) || (statePageDict.categoryDefault || 'Category');
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`;

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: (metadataDict.statePageTitleTemplate || `Best {formattedCategory} in {formattedState}, {formattedCountry} {currentYear}`)
        .replace('{formattedCategory}', formattedCategory)
        .replace('{formattedState}', formattedState)
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      description: (metadataDict.statePageDescriptionTemplate || `Discover the best {formattedCategory} in {formattedState}, {formattedCountry} for {currentYear} on Hoteloza. Book your perfect stay with top amenities and exclusive offers.`)
        .replace('{formattedCategory}', formattedCategory.toLowerCase())
        .replace('{formattedState}', formattedState)
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
        { '@type': 'ListItem', position: 3, name: formattedCountry, item: `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}` },
        { '@type': 'ListItem', position: 4, name: formattedState, item: currentUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: (metadataDict.stateOgTitleTemplate || `Top {formattedCategory} in {formattedState}, {formattedCountry} {currentYear}`)
        .replace('{formattedCategory}', formattedCategory)
        .replace('{formattedState}', formattedState)
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      description: (metadataDict.stateOgDescriptionTemplate || `A list of top {formattedCategory} in {formattedState}, {formattedCountry} for {currentYear} on Hoteloza.`)
        .replace('{formattedCategory}', formattedCategory.toLowerCase())
        .replace('{formattedState}', formattedState)
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      itemListElement: data.hotels.map((hotel, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Hotel',
          name: hotel.title || hotel.name || commonDict.unnamedHotel || 'Unnamed Hotel',
          url: hotel.hotelslug && hotel.cityslug
            ? `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${hotel.cityslug}/${hotel.hotelslug}`
            : `${currentUrl}/${hotel.id || index + 1}`,
          image: hotel.img || hotel.slideimg || '',
          address: {
            '@type': 'PostalAddress',
            streetAddress: hotel.lokasi || commonDict.unknownAddress || 'Unknown Address',
            addressLocality: hotel.kota ? formatSlug(hotel.kota) : commonDict.unknownCity || 'Unknown City',
            addressRegion: hotel['negara bagian'] ? formatSlug(hotel['negara bagian']) : formattedState || commonDict.unknownState || 'Unknown Province',
            addressCountry: hotel.country ? formatSlug(hotel.country) : formattedCountry || commonDict.unknownCountry || 'Unknown Country',
          },
          description: hotel.description || hotel.overview || `A ${formattedCategory.toLowerCase()} in ${hotel.kota ? formatSlug(hotel.kota) : commonDict.unknownLocation || 'unknown location'}, ${formattedState}, ${formattedCountry}.`,
        },
      })),
    },
  ];

  return (
    <>
      <Script
        id="state-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      {/* Tambahkan Suspense di sini untuk membungkus ClientPage */}
      <Suspense fallback={<div>Memuat konten provinsi...</div>}>
        <ClientPage
          categoryslug={sanitizedCategory}
          countryslug={sanitizedCountry}
          stateslug={sanitizedState}
          dictionary={dictionary}
          currentLang={currentLang}
          initialData={data} // Meneruskan data yang sudah di-fetch ke ClientPage
        />
      </Suspense>
    </>
  );
}

// **Penting untuk Dynamic Routes di App Router:**
// Anda harus mengembalikan semua kombinasi `lang`, `categoryslug`, `countryslug`, dan `stateslug` yang mungkin
// untuk dibangun secara statis saat waktu build.
export async function generateStaticParams() {
  const allCategories = ['hotel-discounts', 'luxury-hotels'];
  const allCountries = ['indonesia', 'malaysia'];
  const allStates = ['bali', 'jakarta']; // Contoh slug provinsi/negara bagian untuk Indonesia

  const supportedLangs = ['en', 'us', 'id'];

  const params = [];
  for (const lang of supportedLangs) {
    for (const category of allCategories) {
      for (const country of allCountries) {
        for (const state of allStates) {
          params.push({ lang: lang, categoryslug: category, countryslug: country, stateslug: state });
        }
      }
    }
  }
  return params;
}