// page.jsx (State)
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary'; // Menggunakan alias

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch state data
async function getStateData(categoryslug, countryslug, stateslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) {
    console.error('Invalid slugs:', { categoryslug, countryslug, stateslug });
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Failed to fetch state data for ${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}. Status: ${response.status}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching state data:', error);
    return null;
  }
}

const ClientPage = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  // --- MULAI PERUBAHAN UNTUK generateMetadata ---
  const awaitedParams = await params; // <--- AWAIT PARAMS DI SINI
  const { categoryslug, countryslug, stateslug, lang: locale } = awaitedParams; // <--- GUNAKAN awaitedParams
  // --- AKHIR PERUBAHAN UNTUK generateMetadata ---

  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const statePageDict = dictionary?.statePage || {};
  const commonDict = dictionary?.common || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) {
    return {
      title: metadataDict.stateNotFoundTitle || 'Page Not Found | Hoteloza',
      description: metadataDict.stateNotFoundDescription || 'The requested category, country, or state was not found on Hoteloza.',
    };
  }

  const data = await getStateData(categoryslug, countryslug, stateslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: metadataDict.stateNotFoundTitle || 'Page Not Found | Hoteloza',
      description: metadataDict.stateNotFoundDescription || 'The requested category, country, or state was not found on Hoteloza.',
    };
  }

  const formattedState = formatSlug(sanitizedState) || (statePageDict.stateDefault || 'Province');
  const formattedCountry = formatSlug(sanitizedCountry) || (statePageDict.countryDefault || 'Country');
  const formattedCategory = formatSlug(sanitizedCategory) || (statePageDict.categoryDefault || 'Category');
  const currentYear = new Date().getFullYear();

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
      url: `https://hoteloza.com/${locale}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`, // URL OpenGraph dengan lang
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
  // --- MULAI PERUBAHAN UNTUK KOMPONEN Page ---
  const awaitedParams = await params; // <--- AWAIT PARAMS DI SINI
  const { categoryslug, countryslug, stateslug, lang: locale } = awaitedParams; // <--- GUNAKAN awaitedParams
  // --- AKHIR PERUBAHAN UNTUK KOMPONEN Page ---

  const dictionary = await getdictionary(locale);

  const currentLang = locale; // Lang saat ini

  const commonDict = dictionary?.common || {};
  const statePageDict = dictionary?.statePage || {};
  const metadataDict = dictionary?.metadata || {};
  const navigationDict = dictionary?.navigation || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState) {
    notFound();
  }

  const data = await getStateData(categoryslug, countryslug, stateslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  const formattedState = formatSlug(sanitizedState) || (statePageDict.stateDefault || 'Province');
  const formattedCountry = formatSlug(sanitizedCountry) || (statePageDict.countryDefault || 'Country');
  const formattedCategory = formatSlug(sanitizedCategory) || (statePageDict.categoryDefault || 'Category');
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}`; // URL dasar dengan lang

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
        { '@type': 'ListItem', position: 1, name: navigationDict.home || 'Home', item: `${baseUrl}/${currentLang}` }, // URL Home dengan lang
        { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${currentLang}/${sanitizedCategory}` }, // URL Category dengan lang
        { '@type': 'ListItem', position: 3, name: formattedCountry, item: `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}` }, // URL Country dengan lang
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
            ? `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${hotel.cityslug}/${hotel.hotelslug}` // URL hotel detail dengan lang
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
      <ClientPage categoryslug={sanitizedCategory} countryslug={sanitizedCountry} stateslug={sanitizedState} dictionary={dictionary} currentLang={currentLang} />
    </>
  );
}