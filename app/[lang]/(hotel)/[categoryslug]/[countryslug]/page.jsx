// app/[lang]/(hotel)/[categoryslug]/[countryslug]/page.jsx
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary';

const sanitizeSlug = (slug) => {
  const sanitized = slug?.replace(/[^a-zA-Z0-9-]/g, '');
  if (!sanitized && slug) {
    console.warn(`sanitizeSlug: Input '${slug}' resulted in empty/null slug.`);
  }
  return sanitized;
};

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

async function getCountryData(categoryslug, countryslug) {
  console.log('getCountryData: Received slugs - category:', categoryslug, 'country:', countryslug);

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);

  console.log('getCountryData: Sanitized slugs - category:', sanitizedCategory, 'country:', sanitizedCountry);

  if (!sanitizedCategory || !sanitizedCountry) {
    console.error('getCountryData: INVALID OR MISSING SLUGS AFTER SANITIZATION. category:', sanitizedCategory, 'country:', sanitizedCountry);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}`;
  console.log('getCountryData: Constructed API URL:', apiUrl);

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `getCountryData: Failed to fetch country data from API. Status: ${response.status} - ${response.statusText}. Response Body: ${errorText}`
      );
      return null;
    }
    const data = await response.json();
    console.log('getCountryData: Raw data received from API:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('getCountryData: Error fetching country data:', error);
    return null;
  }
}

const ClientPageCountry = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const { categoryslug, countryslug, lang: locale } = awaitedParams;

  console.log('generateMetadata (Country): Received params - category:', categoryslug, 'country:', countryslug, 'lang:', locale);

  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const countryPageDict = dictionary?.countryPage || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);

  if (!sanitizedCategory || !sanitizedCountry) {
    console.error('generateMetadata (Country): Missing required slugs after sanitization. Returning default metadata.');
    return {
      title: metadataDict.countryNotFoundTitle || 'Page Not Found | Hoteloza',
      description: metadataDict.countryNotFoundDescription || 'The requested category or country was not found on Hoteloza.',
    };
  }

  const data = await getCountryData(categoryslug, countryslug);
  console.log('generateMetadata (Country): Data from getCountryData for metadata:', JSON.stringify(data, null, 2));
  if (!data || !data.hotels || data.hotels.length === 0) {
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
  const awaitedParams = await params;
  const { categoryslug, countryslug, lang: locale } = awaitedParams;

  console.log('Page component (Country): Received params - category:', categoryslug, 'country:', countryslug, 'lang:', locale);

  const dictionary = await getdictionary(locale);
  const currentLang = locale;

  const commonDict = dictionary?.common || {};
  const countryPageDict = dictionary?.countryPage || {};
  const metadataDict = dictionary?.metadata || {};
  const navigationDict = dictionary?.navigation || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);

  console.log('Page component (Country): Sanitized slugs for component - category:', sanitizedCategory, 'country:', sanitizedCountry);

  if (!sanitizedCategory || !sanitizedCountry) {
    console.error('Page component (Country): Missing required slugs after sanitization. Calling notFound(). category:', sanitizedCategory, 'country:', sanitizedCountry);
    notFound();
  }

  const data = await getCountryData(categoryslug, countryslug);
  console.log('Page component (Country): Data from getCountryData:', JSON.stringify(data, null, 2));

  if (!data || !data.hotels || data.hotels.length === 0) {
    console.error('Page component (Country): Country data is null, or hotels array is missing/empty. Calling notFound(). Data:', data);
    notFound();
  }

  const formattedCountry = formatSlug(sanitizedCountry) || (countryPageDict.countryDefault || 'Country');
  const formattedCategory = formatSlug(sanitizedCategory) || (countryPageDict.categoryDefault || 'Category');
  const currentYear = new Date().getFullYear();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hoteloza.com'; // Menggunakan env var
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
          image: hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : ''), // Diperbaiki: Akses elemen pertama dari slideImg jika ada
          address: {
            '@type': 'PostalAddress',
            streetAddress: hotel.location || commonDict.unknownAddress, // PERBAIKAN: Gunakan hotel.location
            addressLocality: hotel.city ? formatSlug(hotel.city) : commonDict.unknownCity, // PERBAIKAN: Gunakan hotel.city
            addressRegion: hotel.state ? formatSlug(hotel.state) : commonDict.unknownRegion, // PERBAIKAN: Gunakan hotel.state
            addressCountry: hotel.country ? formatSlug(hotel.country) : (commonDict.unknownCountry || formattedCountry),
          },
          description: hotel.overview || commonDict.unknownCategory || `${formattedCategory.toLowerCase()} in ${hotel.city ? formatSlug(hotel.city) : (commonDict.unknownLocation || 'unknown location')}, ${formattedCountry}.`, // PERBAIKAN: Prioritaskan overview, dan perbaiki fallback umum untuk kota
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