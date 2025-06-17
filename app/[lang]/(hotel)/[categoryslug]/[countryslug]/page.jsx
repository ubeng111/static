// app/[lang]/(hotel)/[categoryslug]/[countryslug]/page.jsx
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary';
import ClientPage from './ClientPage';

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
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);

  if (!sanitizedCategory || !sanitizedCountry) {
    console.error('getCountryData: INVALID OR MISSING SLUGS AFTER SANITIZATION. category:', sanitizedCategory, 'country:', sanitizedCountry);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}`;

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 86400 } });
    if (!response.ok) {
      console.error(
        `getCountryData: Failed to fetch country data from API. Status: ${response.status} - ${response.statusText}`
      );
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching country data:', error);
    return null;
  }
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { categoryslug, countryslug, lang: locale } = await params;

  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const countryPageDict = dictionary?.countryPage || {};
  const commonDict = dictionary?.common || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);

  if (!sanitizedCategory || !sanitizedCountry) {
    return {
      title: metadataDict.countryNotFoundTitle || 'Page Not Found | Hoteloza',
      description: metadataDict.countryNotFoundDescription || 'The requested category or country was not found on Hoteloza.',
    };
  }

  const data = await getCountryData(categoryslug, countryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
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
  const { categoryslug, countryslug, lang: locale } = await params;
  const dictionary = await getdictionary(locale);
  const currentLang = locale;

  const commonDict = dictionary?.common || {};
  const countryPageDict = dictionary?.countryPage || {};
  const metadataDict = dictionary?.metadata || {};
  const navigationDict = dictionary?.navigation || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);

  if (!sanitizedCategory || !sanitizedCountry) {
    notFound();
  }

  const data = await getCountryData(categoryslug, countryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  const formattedCountry = formatSlug(sanitizedCountry) || (countryPageDict.countryDefault || 'Country');
  const formattedCategory = formatSlug(sanitizedCategory) || (countryPageDict.categoryDefault || 'Category');
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}`;

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: (metadataDict.countryPageTitleTemplate || `Best ${formattedCategory} in ${formattedCountry} ${currentYear}`)
        .replace('{formattedCategory}', formattedCategory)
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      description: (metadataDict.countryPageDescriptionTemplate || `Find the best ${formattedCategory.toLowerCase()} in ${formattedCountry} for ${currentYear} on Hoteloza with top hotels and exclusive deals.`)
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
      name: (metadataDict.countryOgTitleTemplate || `Top ${formattedCategory} in ${formattedCountry} ${currentYear}`)
        .replace('{formattedCategory}', formattedCategory)
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      description: (metadataDict.countryOgDescriptionTemplate || `A list of top ${formattedCategory.toLowerCase()} in ${formattedCountry} for ${currentYear} on Hoteloza.`)
        .replace('{formattedCategory}', formattedCategory.toLowerCase())
        .replace('{formattedCountry}', formattedCountry)
        .replace('{currentYear}', currentYear),
      itemListElement: data.hotels.map((hotel, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Hotel',
          name: hotel.title || hotel.name || 'Unnamed Hotel',
          url: hotel.hotelslug && hotel.stateslug && hotel.cityslug
            ? `${baseUrl}/${currentLang}/${sanitizedCategory}/${sanitizedCountry}/${hotel.stateslug}/${hotel.cityslug}/${hotel.hotelslug}`
            : `${currentUrl}/${hotel.id || index + 1}`,
          image: hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : ''),
          address: {
            '@type': 'PostalAddress',
            streetAddress: hotel.location || 'Unknown Address',
            addressLocality: hotel.city ? formatSlug(hotel.city) : 'Unknown City',
            addressRegion: hotel.state ? formatSlug(hotel.state) : 'Unknown Region',
            addressCountry: hotel.country ? formatSlug(hotel.country) : 'Unknown Country',
          },
          description: hotel.overview || `${formattedCategory.toLowerCase()} in ${hotel.city ? formatSlug(hotel.city) : 'unknown location'}, ${formattedCountry}.`,
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
        dictionary={dictionary}
        currentLang={currentLang}
        initialData={data}
      />
    </>
  );
}
