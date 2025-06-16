// app/[lang]/(hotel)/[categoryslug]/page.jsx
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary'; // cite: 1

const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, ''); // cite: 1
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : ''; // cite: 1

async function getCategoryData(categoryslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug); // cite: 1
  if (!sanitizedCategory) { // cite: 1
    console.error('Invalid category slug:', categoryslug); // cite: 1
    return null; // cite: 1
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'; // cite: 1
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}`; // cite: 1

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' }); // cite: 1
    if (!response.ok) { // cite: 1
      console.error(`Failed to fetch category data for ${sanitizedCategory}. Status: ${response.status}`); // cite: 1
      return null; // cite: 1
    }
    return response.json(); // cite: 1
  } catch (error) { // cite: 1
    console.error('Error fetching category data:', error); // cite: 1
    return null; // cite: 1
  }
}

const ClientPage = dynamic(() => import('./ClientPage')); // cite: 1

export async function generateMetadata({ params }) {
  const awaitedParams = await params; // cite: 1
  const { categoryslug, lang: locale } = awaitedParams; // cite: 1

  const dictionary = await getdictionary(locale); // cite: 1
  const metadataDict = dictionary?.metadata || {}; // cite: 1
  const categoryPageDict = dictionary?.categoryPage || {}; // cite: 1

  const sanitizedCategory = sanitizeSlug(categoryslug); // cite: 1

  if (!sanitizedCategory) { // cite: 1
    return { // cite: 1
      title: metadataDict.categoryNotFoundTitle || 'Category Not Found | Hoteloza', // cite: 1
      description: metadataDict.categoryNotFoundDescription || 'The requested category was not found on Hoteloza.', // cite: 1
    };
  }

  const data = await getCategoryData(categoryslug); // cite: 1
  if (!data || !data.hotels || data.hotels.length === 0) { // cite: 1
    return { // cite: 1
      title: metadataDict.categoryNotFoundTitle || 'Category Not Found | Hoteloza', // cite: 1
      description: metadataDict.categoryNotFoundDescription || 'The requested category was not found on Hoteloza.', // cite: 1
    };
  }

  const formattedCategory = formatSlug(sanitizedCategory); // cite: 1
  const currentYear = new Date().getFullYear(); // cite: 1

  return { // cite: 1
    title: (metadataDict.categoryPageTitleTemplate || `Best {formattedCategory} Discounts {currentYear} - Save Big on Hoteloza!`) // cite: 1
      .replace('{formattedCategory}', formattedCategory) // cite: 1
      .replace('{currentYear}', currentYear), // cite: 1
    description: (metadataDict.categoryPageDescriptionTemplate || `Find the best {formattedCategory} in {currentYear} with Hoteloza. Enjoy exclusive discounts, great prices, and premium amenities. Book now for an unforgettable stay!.`) // cite: 1
      .replace('{formattedCategory}', formattedCategory.toLowerCase()) // cite: 1
      .replace('{currentYear}', currentYear), // cite: 1
    openGraph: { // cite: 1
      title: (metadataDict.categoryOgTitleTemplate || `Top {formattedCategory} Deals in {currentYear} | Hoteloza`) // cite: 1
        .replace('{formattedCategory}', formattedCategory) // cite: 1
        .replace('{currentYear}', currentYear), // cite: 1
      description: (metadataDict.categoryOgDescriptionTemplate || `Explore top {formattedCategory} for {currentYear} on Hoteloza. Book now for exclusive deals and premium amenities!`) // cite: 1
        .replace('{formattedCategory}', formattedCategory.toLowerCase()) // cite: 1
        .replace('{currentYear}', currentYear), // cite: 1
      url: `https://hoteloza.com/${locale}/${sanitizedCategory}`, // cite: 1
      type: 'website', // cite: 1
    },
  };
}

export default async function Page({ params }) {
  const awaitedParams = await params; // cite: 1
  const { categoryslug, lang: locale } = awaitedParams; // cite: 1

  const dictionary = await getdictionary(locale); // cite: 1

  const currentLang = locale; // cite: 1

  const sanitizedCategory = sanitizeSlug(categoryslug); // cite: 1

  if (!sanitizedCategory) { // cite: 1
    notFound(); // cite: 1
  }

  const data = await getCategoryData(categoryslug); // cite: 1
  if (!data || !data.hotels || data.hotels.length === 0) { // cite: 1
    notFound(); // cite: 1
  }

  const formattedCategory = formatSlug(sanitizedCategory); // cite: 1
  const currentYear = new Date().getFullYear(); // cite: 1
  const baseUrl = 'https://hoteloza.com'; // cite: 1
  const currentUrl = `${baseUrl}/${currentLang}/${sanitizedCategory}`; // cite: 1

  const metadataDict = dictionary?.metadata || {}; // cite: 1
  const commonDict = dictionary?.common || {}; // cite: 1
  const categoryPageDict = dictionary?.categoryPage || {}; // cite: 1
  const navigationDict = dictionary?.navigation || {}; // cite: 1

  const webPageName = (metadataDict.categoryWebPageNameTemplate || `Top ${formattedCategory} Deals in ${currentYear}`) // cite: 1
    ?.replace('{formattedCategory}', formattedCategory) // cite: 1
    ?.replace('{currentYear}', currentYear); // cite: 1

  const webPageDescription = (metadataDict.categoryWebPageDescriptionTemplate || `Explore top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza with exclusive deals and premium amenities.`) // cite: 1
    ?.replace('{formattedCategory}', formattedCategory.toLowerCase()) // cite: 1
    ?.replace('{currentYear}', currentYear); // cite: 1

  const schemas = [ // cite: 1
    {
      '@context': 'https://schema.org', // cite: 1
      '@type': 'WebPage', // cite: 1
      name: webPageName, // cite: 1
      description: webPageDescription, // cite: 1
      url: currentUrl, // cite: 1
      publisher: { // cite: 1
        '@type': 'Organization', // cite: 1
        name: 'Hoteloza', // cite: 1
        logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` }, // cite: 1
      },
    },
    {
      '@context': 'https://schema.org', // cite: 1
      '@type': 'BreadcrumbList', // cite: 1
      itemListElement: [ // cite: 1
        { '@type': 'ListItem', position: 1, name: navigationDict.home || 'Home', item: `${baseUrl}/${currentLang}` }, // cite: 1
        { '@type': 'ListItem', position: 2, name: formattedCategory, item: currentUrl }, // cite: 1
      ],
    },
    {
      '@context': 'https://schema.org', // cite: 1
      '@type': 'ItemList', // cite: 1
      name: (metadataDict.categoryWebPageNameTemplate || `Top ${formattedCategory} in ${currentYear}`) // cite: 1
        ?.replace('{formattedCategory}', formattedCategory) // cite: 1
        ?.replace('{currentYear}', currentYear), // cite: 1
      description: (metadataDict.categoryWebPageDescriptionTemplate || `A list of top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza.`) // cite: 1
        ?.replace('{formattedCategory}', formattedCategory.toLowerCase()) // cite: 1
        ?.replace('{currentYear}', currentYear), // cite: 1
      itemListElement: data.hotels.map((hotel, index) => ({ // cite: 1
        '@type': 'ListItem', // cite: 1
        position: index + 1, // cite: 1
        item: {
          '@type': 'Hotel', // cite: 1
          name: hotel.title || hotel.name || commonDict.unnamedHotel || 'Unnamed Hotel', // cite: 1
          url: hotel.hotelslug && hotel.countryslug && hotel.stateslug && hotel.cityslug // cite: 1
            ? `${baseUrl}/${currentLang}/${sanitizedCategory}/${hotel.countryslug}/${hotel.stateslug}/${hotel.cityslug}/${hotel.hotelslug}` // cite: 1
            : `${currentUrl}/${hotel.id || index + 1}`, // cite: 1
          image: hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : ''), // Diperbaiki: Akses elemen pertama dari slideImg jika ada
          address: {
            '@type': 'PostalAddress', // cite: 1
            streetAddress: hotel.location || commonDict.unknownAddress || 'Unknown Address', // Perbaikan di sini
            addressLocality: hotel.city ? formatSlug(hotel.city) : commonDict.unknownCity || 'Unknown City', // Perbaikan di sini
            addressRegion: hotel.state ? formatSlug(hotel.state) : commonDict.unknownRegion || 'Unknown Region', // Perbaikan di sini
            addressCountry: hotel.country ? formatSlug(hotel.country) : commonDict.unknownCountry || 'Unknown Country', // cite: 1
          },
          description: hotel.overview || commonDict.unknownCategory || `${categoryPageDict.categoryDefault || 'A category'} in ${hotel.city ? formatSlug(hotel.city) : commonDict.unknownLocation || 'unknown location'}.`, // Perbaikan: Prioritaskan overview, dan perbaiki fallback umum
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