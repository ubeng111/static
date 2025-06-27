// app/[lang]/(hotel)/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/page.jsx
// Hapus dynamic import 'ClientPage' langsung dari sini.
// Import Suspense dari React
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary'; // Menggunakan alias

// Import ClientPage secara langsung (karena ClientPage sendiri adalah Client Component)
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

// Function to fetch city data
async function getCityData(categoryslug, countryslug, stateslug, cityslug) {
  console.log('getCityData: Received slugs - category:', categoryslug, 'country:', countryslug, 'state:', stateslug, 'city:', cityslug);

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    console.error('getCityData: INVALID OR MISSING SLUGS AFTER SANITIZATION. category:', sanitizedCategory, 'country:', sanitizedCountry, 'state:', sanitizedState, 'city:', sanitizedCity);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`;
  console.log('getCityData: Constructed API URL:', apiUrl);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `getCityData: Failed to fetch city data from API. Status: ${response.status} - ${response.statusText}. Response Body: ${errorText}`
      );
      return null;
    }
    const data = await response.json();
    console.log('getCityData: Raw data received from API (truncated for brevity):', JSON.stringify(data, null, 2).substring(0, 500) + '...');
    return data;
  } catch (error) {
    console.error('getCityData: Error fetching city data:', error);
    return null;
  }
}

// Hapus dynamic import ClientPage dari sini.
// ClientPage sudah didefinisikan dengan 'use client'; di file ClientPage.jsx.
// Kita akan memanggilnya langsung di JSX di bawah, dibungkus oleh Suspense.


export async function generateMetadata({ params }) {
  const { categoryslug, countryslug, stateslug, cityslug, lang: locale } = params;

  console.log('generateMetadata (City): Received params - category:', categoryslug, 'country:', countryslug, 'state:', stateslug, 'city:', cityslug, 'lang:', locale);

  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const cityPageDict = dictionary?.cityPage || {};
  const commonDict = dictionary?.common || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    console.warn('generateMetadata (City): Missing required slugs after sanitization. Returning default metadata.');
    return {
      title: metadataDict.cityNotFoundTitle || 'Page Not Found | Hoteloza',
      description: metadataDict.cityNotFoundDescription || 'The requested category, country, state, or city was not found on Hoteloza.',
    };
  }

  const data = await getCityData(categoryslug, countryslug, stateslug, cityslug);
  console.log('generateMetadata (City): Data from getCityData for metadata (truncated):', JSON.stringify(data, null, 2).substring(0, 500) + '...');
  if (!data || !data.hotels || data.hotels.length === 0) {
    console.warn('generateMetadata (City): City data is null, or hotels array is missing/empty. Data:', data);
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

  const ogImage = data.hotels[0]?.img || data.hotels[0]?.slideimg || 'https://hoteloza.com/og-image.jpg';

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
      url: `https://hoteloza.com/${locale}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`,
      images: [{ url: ogImage }],
      type: 'website',
    },
    alternates: {
      canonical: `https://hoteloza.com/${locale}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`,
      languages: {
        'en-US': `https://hoteloza.com/en/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`,
        'id-ID': `https://hoteloza.com/id/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`,
        'x-default': `https://hoteloza.com/en/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`,
      },
    },
  };
}

export default async function Page({ params }) {
  const { categoryslug, countryslug, stateslug, cityslug, lang: locale } = params;

  console.log('Page component (City): Received params - category:', categoryslug, 'country:', countryslug, 'state:', stateslug, 'city:', cityslug, 'lang:', locale);

  const dictionary = await getdictionary(locale);
  const currentLang = locale;

  const commonDict = dictionary?.common || {};
  const cityPageDict = dictionary?.cityPage || {};
  const metadataDict = dictionary?.metadata || {};
  const navigationDict = dictionary?.navigation || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);

  console.log('Page component (City): Sanitized slugs for component - category:', sanitizedCategory, 'country:', sanitizedCountry, 'state:', sanitizedState, 'city:', sanitizedCity);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    console.error('Page component (City): Missing required slugs after sanitization. Calling notFound(). category:', sanitizedCategory, 'country:', sanitizedCountry, 'state:', sanitizedState, 'city:', sanitizedCity);
    notFound();
  }

  const data = await getCityData(categoryslug, countryslug, stateslug, cityslug);
  console.log('Page component (City): Data from getCityData (truncated):', JSON.stringify(data, null, 2).substring(0, 500) + '...');

  if (!data || !data.hotels || data.hotels.length === 0) {
    console.error('Page component (City): City data is null, or hotels array is missing/empty. Calling notFound(). Data:', data);
    notFound();
  }

  const formattedCity = formatSlug(sanitizedCity) || (cityPageDict.cityDefault || 'City');
  const formattedState = formatSlug(sanitizedState) || (cityPageDict.stateDefault || 'State');
  const formattedCountry = formatSlug(sanitizedCountry) || (cityPageDict.countryDefault || 'Country');
  const formattedCategory = formatSlug(sanitizedCategory) || (cityPageDict.categoryDefault || 'Category');
  const currentYear = new Date().getFullYear();

  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`;

  const hotelItems = data.hotels.map((hotel, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Hotel',
      name: hotel.name || hotel.title || commonDict.unnamedHotel || 'Unnamed Hotel',
      url: hotel.hotelslug
        ? `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}/${hotel.hotelslug}`
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
          { '@type': 'ListItem', position: 1, name: navigationDict.home || 'Home', item: `${baseUrl}/${currentLang}` },
          { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${currentLang}/${sanitizedCategory}` },
          { '@type': 'ListItem', position: 3, name: formattedCountry, item: `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}` },
          { '@type': 'ListItem', position: 4, name: formattedState, item: `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}` },
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
      {/* Tambahkan Suspense di sini untuk membungkus ClientPage */}
      <Suspense fallback={<div>Memuat konten kota...</div>}>
        {/* Pass initialData ke ClientPage */}
        <ClientPage
          categoryslug={sanitizedCategory}
          countryslug={sanitizedCountry}
          stateslug={sanitizedState}
          cityslug={sanitizedCity}
          dictionary={dictionary}
          currentLang={currentLang}
          initialData={data}
        />
      </Suspense>
    </>
  );
}

// generateStaticParams tetap sama
export async function generateStaticParams() {
  const allCategories = ['hotel-discounts', 'luxury-hotels'];
  const allCountries = ['indonesia', 'malaysia'];
  const allStates = ['bali', 'jakarta'];
  const allCities = ['denpasar', 'ubud'];

  const supportedLangs = ['en', 'us', 'id'];

  const params = [];
  for (const lang of supportedLangs) {
    for (const category of allCategories) {
      for (const country of allCountries) {
        for (const state of allStates) {
          for (const city of allCities) {
            params.push({ lang: lang, categoryslug: category, countryslug: country, stateslug: state, cityslug: city });
          }
        }
      }
    }
  }
  return params;
}