// app/[lang]/(hotel)/[categoryslug]/page.jsx
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary';

const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

async function getCategoryData(categoryslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug);
  if (!sanitizedCategory) {
    console.error('Invalid category slug:', categoryslug);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Failed to fetch category data for ${sanitizedCategory}. Status: ${response.status}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching category data:', error);
    return null;
  }
}

const ClientPage = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const { categoryslug, lang: locale } = awaitedParams;

  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const categoryPageDict = dictionary?.categoryPage || {};
  const commonDict = dictionary?.common || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);

  if (!sanitizedCategory) {
    return {
      title: metadataDict.categoryNotFoundTitle || 'Category Not Found | Hoteloza',
      description: metadataDict.categoryNotFoundDescription || 'The requested category was not found on Hoteloza.',
    };
  }

  const data = await getCategoryData(categoryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: metadataDict.categoryNotFoundTitle || 'Category Not Found | Hoteloza',
      description: metadataDict.categoryNotFoundDescription || 'The requested category was not found on Hoteloza.',
    };
  }

  const formattedCategory = formatSlug(sanitizedCategory);
  const currentYear = new Date().getFullYear();

  return {
    title: (metadataDict.categoryPageTitleTemplate || `Best {formattedCategory} Discounts {currentYear} - Save Big on Hoteloza!`)
      .replace('{formattedCategory}', formattedCategory)
      .replace('{currentYear}', currentYear),
    description: (metadataDict.categoryPageDescriptionTemplate || `Find the best {formattedCategory} in {currentYear} with Hoteloza. Enjoy exclusive discounts, great prices, and premium amenities. Book now for an unforgettable stay!.`)
      .replace('{formattedCategory}', formattedCategory.toLowerCase())
      .replace('{currentYear}', currentYear),
    openGraph: {
      title: (metadataDict.categoryOgTitleTemplate || `Top {formattedCategory} Deals in {currentYear} | Hoteloza`)
        .replace('{formattedCategory}', formattedCategory)
        .replace('{currentYear}', currentYear),
      description: (metadataDict.categoryOgDescriptionTemplate || `Explore top {formattedCategory} for {currentYear} on Hoteloza. Book now for exclusive deals and premium amenities!`)
        .replace('{formattedCategory}', formattedCategory.toLowerCase())
        .replace('{currentYear}', currentYear),
      url: `https://hoteloza.com/${locale}/${sanitizedCategory}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
  const awaitedParams = await params;
  const { categoryslug, lang: locale } = awaitedParams;

  const dictionary = await getdictionary(locale);

  const currentLang = locale;

  const sanitizedCategory = sanitizeSlug(categoryslug);

  if (!sanitizedCategory) {
    notFound();
  }

  const data = await getCategoryData(categoryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  const formattedCategory = formatSlug(sanitizedCategory);
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${currentLang}/${sanitizedCategory}`;

  const metadataDict = dictionary?.metadata || {};
  const commonDict = dictionary?.common || {};
  const categoryPageDict = dictionary?.categoryPage || {};
  const navigationDict = dictionary?.navigation || {};

  const webPageName = (metadataDict.categoryWebPageNameTemplate || `Top ${formattedCategory} Deals in ${currentYear}`)
    ?.replace('{formattedCategory}', formattedCategory)
    ?.replace('{currentYear}', currentYear);

  const webPageDescription = (metadataDict.categoryWebPageDescriptionTemplate || `Explore top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza with exclusive deals and premium amenities.`)
    ?.replace('{formattedCategory}', formattedCategory.toLowerCase())
    ?.replace('{currentYear}', currentYear);

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: webPageName,
      description: webPageDescription,
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
        { '@type': 'ListItem', position: 2, name: formattedCategory, item: currentUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: (metadataDict.categoryWebPageNameTemplate || `Top ${formattedCategory} in ${currentYear}`)
        ?.replace('{formattedCategory}', formattedCategory)
        ?.replace('{currentYear}', currentYear),
      description: (metadataDict.categoryWebPageDescriptionTemplate || `A list of top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza.`)
        ?.replace('{formattedCategory}', formattedCategory.toLowerCase())
        ?.replace('{currentYear}', currentYear),
      itemListElement: data.hotels.map((hotel, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Hotel',
          name: hotel.title || hotel.name || 'Unnamed Hotel', // No dict fallback here, only literal
          url: hotel.hotelslug && hotel.countryslug && hotel.stateslug && hotel.cityslug
            ? `${baseUrl}/${currentLang}/${sanitizedCategory}/${hotel.countryslug}/${hotel.stateslug}/${hotel.cityslug}/${hotel.hotelslug}`
            : `${currentUrl}/${hotel.id || index + 1}`,
          image: hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : ''), // Corrected: access first element of slideImg if array
          address: {
            '@type': 'PostalAddress',
            streetAddress: hotel.location || 'Unknown Address', // Corrected: use hotel.location, no dict fallback
            addressLocality: hotel.city ? formatSlug(hotel.city) : 'Unknown City', // Corrected: use hotel.city, no dict fallback
            addressRegion: hotel.state ? formatSlug(hotel.state) : 'Unknown Region', // Corrected: use hotel.state, no dict fallback
            addressCountry: hotel.country ? formatSlug(hotel.country) : 'Unknown Country', // Corrected: use hotel.country, no dict fallback
          },
          description: hotel.overview || `A ${formattedCategory.toLowerCase()} in ${hotel.city ? formatSlug(hotel.city) : 'unknown location'}.`, // Corrected: prioritize overview, literal fallback
        },
      })),
    },
  ];

  return (
    <>
      <Script
        id="category-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      {/* Meneruskan currentLang sebagai prop ke ClientPage */}
      <ClientPage categoryslug={sanitizedCategory} dictionary={dictionary} currentLang={currentLang} />
    </>
  );
}