// app/[lang]/(hotel)/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/page.jsx
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary';

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
    const response = await fetch(apiUrl, { cache: 'no-store' });
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
  const awaitedParams = await params;
  const { categoryslug, countryslug, stateslug, cityslug, lang: locale } = awaitedParams;
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
      url: `https://hoteloza.com/${locale}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
  const awaitedParams = await params;
  const { categoryslug, countryslug, stateslug, cityslug, lang: locale } = awaitedParams;
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
  const currentUrl = `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`;

  const hotelItems = data.hotels.map((hotel, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Hotel',
      name: hotel.title || hotel.name || 'Unnamed Hotel', // No dict fallback
      url: hotel.hotelslug
        ? `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}/${hotel.hotelslug}`
        : `${currentUrl}/${hotel.id || index + 1}`,
      image: hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : ''), // Corrected: access first element of slideImg
      address: {
        '@type': 'PostalAddress',
        streetAddress: hotel.location || 'Unknown Address', // Corrected: use hotel.location, no dict fallback
        addressLocality: hotel.city ? formatSlug(hotel.city) : 'Unknown City', // Corrected: use hotel.city, no dict fallback
        addressRegion: hotel.state ? formatSlug(hotel.state) : 'Unknown Region', // Corrected: use hotel.state, no dict fallback
        addressCountry: hotel.country ? formatSlug(hotel.country) : 'Unknown Country', // Corrected: use hotel.country, no dict fallback
      },
      description: hotel.overview || `A ${formattedCategory.toLowerCase()} in ${hotel.city ? formatSlug(hotel.city) : 'unknown location'}, ${hotel.state ? formatSlug(hotel.state) : 'unknown state'}.`, // Corrected: prioritize overview, literal fallback
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      <ClientPage
        categoryslug={sanitizedCategory}
        countryslug={sanitizedCountry}
        stateslug={sanitizedState}
        cityslug={sanitizedCity}
        dictionary={dictionary}
        currentLang={currentLang}
      />
    </>
  );
}