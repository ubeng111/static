// app/(hotel)/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/page.jsx
import { notFound } from 'next/navigation';
import contentTemplates from '@/utils/contentTemplates'; // Ensure this path is correct
import Script from 'next/script';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Aliased 'dynamic' import to avoid conflict with the 'export const dynamic' page configuration.
import dynamicComponent from 'next/dynamic';


const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SUBTLE_CUSCUS,
  ssl: { ca: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'root.crt')) },
});

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
    return { hotels: [] }; // Always return an object with an empty hotels array
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`;
  console.log('SERVER DEBUG [page.jsx - getCityData]: Constructed API URL:', apiUrl);

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 31536000 } });
    if (!response.ok) {
      if (response.status === 404) {
          console.warn(`SERVER WARN [page.jsx - getCityData]: City data not found for ${sanitizedCity}. Status: 404.`);
      } else {
          console.error(
              `SERVER ERROR [page.jsx - getCityData]: Failed to fetch city data for ${sanitizedCity}. Status: ${response.status} - ${response.statusText}`
          );
      }
      return { hotels: [] }; // Ensure empty array on non-OK response
    }
    const data = await response.json();
    return data || { hotels: [] }; // Ensure data itself is not null/undefined and has hotels array
  } catch (error) {
    console.error('SERVER FATAL ERROR [page.jsx - getCityData]: Error fetching city data:', error);
    return { hotels: [] }; // Ensure empty array on fetch error
  }
}

// ClientPage is dynamically loaded, requiring the aliased 'dynamicComponent' import.
const ClientPage = dynamicComponent(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  // MODIFIKASI SESUAI PERMINTAAN: Menambahkan 'await' pada params
  const awaitedParams = await params;
  const { categoryslug, countryslug, stateslug, cityslug } = awaitedParams;

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory || 'hotels'}/${sanitizedCountry || 'country'}/${sanitizedState || 'state'}/${sanitizedCity || 'city'}`;

  let title = 'Page Not Found | Hoteloza';
  let description = 'The requested category, country, state, or city was not found on Hoteloza. Discover amazing hotel deals!';
  let ogTitle = 'Explore Hotel Deals | Hoteloza';
  let ogDescription = 'Discover amazing hotel deals and premium amenities on Hoteloza.';

  // If any slug is invalid, return generic metadata
  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    return {
      title,
      description,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: currentUrl,
        type: 'website',
      },
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  // Fetch data for dynamic metadata
  const data = await getCityData(categoryslug, countryslug, stateslug, cityslug);

  // Initialize longDescriptionSegments to an empty array for safety
  let longDescriptionSegments = [];

  if (data && data.hotels && data.hotels.length > 0) {
    const hotel = data.hotels[0]; // Use the first hotel for consistent metadata
    const formattedCity = formatSlug(hotel.kota || sanitizedCity);
    const formattedState = formatSlug(hotel['negara bagian'] || sanitizedState);
    const formattedCountry = formatSlug(hotel.country || sanitizedCountry);
    const formattedCategory = formatSlug(hotel.category || sanitizedCategory);
    const currentYear = new Date().getFullYear();

    longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
      formattedCategory,
      'city',
      formattedCity,
      formattedCity, // Passing formattedCity twice as per template
      formattedState,
      formattedCountry
    );

    const firstParagraphContent = longDescriptionSegments[0]?.content || '';
    // Ensure meta description is not too long and is relevant
    const metaDescription = firstParagraphContent.substring(0, 160) + (firstParagraphContent.length > 160 ? '...' : '');

    title = `Best ${formattedCategory} in ${formattedCity}, ${formattedState} ${currentYear} - Book Now! | Hoteloza`;
    description = metaDescription;
    ogTitle = `Top ${formattedCategory} in ${formattedCity}, ${formattedState} ${currentYear} | Hoteloza`;
    ogDescription = `Discover the best ${formattedCategory.toLowerCase()} in ${formattedCity}, ${formattedState} for ${currentYear} on Hoteloza. Book now for exclusive offers and premium amenities!`;
  } else {
    // Fallback metadata if no hotels are found
    const formattedCityFallback = formatSlug(sanitizedCity) || 'City';
    const formattedStateFallback = formatSlug(sanitizedState) || 'State';
    const formattedCountryFallback = formatSlug(sanitizedCountry) || 'Country';
    const formattedCategoryFallback = formatSlug(sanitizedCategory) || 'Hotels';

    // Even if no hotels, generate fallback longDescriptionSegments for consistent structure
    longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
        formattedCategoryFallback,
        'city',
        formattedCityFallback,
        formattedCityFallback,
        formattedStateFallback,
        formattedCountryFallback
    );

    title = `Hotels in ${formattedCityFallback}, ${formattedStateFallback}, ${formattedCountryFallback} | Hoteloza`;
    description = `Discover amazing hotel deals and premium accommodations in ${formattedCityFallback}, ${formattedStateFallback}, ${formattedCountryFallback} on Hoteloza. Find your perfect stay!`;
    ogTitle = `Best Hotels in ${formattedCityFallback}, ${formattedStateFallback}, ${formattedCountryFallback} | Hoteloza`;
    ogDescription = `Explore a wide range of hotels and accommodations in ${formattedCityFallback}, ${formattedStateFallback}, ${formattedCountryFallback} for your next trip on Hoteloza.`;
  }

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: currentUrl,
      type: 'website',
    },
    alternates: {
      canonical: currentUrl,
    },
  };
}

export default async function Page({ params }) {
  // MODIFIKASI SESUAI PERMINTAAN: Menambahkan 'await' pada params
  const awaitedParams = await params;
  const { categoryslug, countryslug, stateslug, cityslug } = awaitedParams;
  
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);

  // If any slug is invalid, we might want to show a 404 or redirect.
  // The generateMetadata function already handles this, but for the page content,
  // we should also ensure we don't proceed with invalid data.
  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    // Optionally, you could redirect or render a specific "not found" message here.
    // For now, we'll proceed with fallback values, mirroring the metadata behavior.
    console.warn('SERVER WARN [page.jsx]: One or more slugs are invalid for rendering the page content. Proceeding with fallbacks.');
  }

  let formattedCategory = 'Hotels';
  let formattedCountry = 'Country';
  let formattedState = 'State';
  let formattedCity = 'City';
  let data = { hotels: [] }; // Always initialize data with an empty hotels array

  // Only attempt to fetch data if all slugs are valid
  if (sanitizedCategory && sanitizedCountry && sanitizedState && sanitizedCity) {
    data = await getCityData(categoryslug, countryslug, stateslug, cityslug);
  }

  // Ensure data.hotels is an array for safety, even though getCityData should handle it.
  const hotelsData = data?.hotels || [];

  if (hotelsData.length > 0) {
    const hotel = hotelsData[0];
    formattedCategory = formatSlug(hotel.category || sanitizedCategory);
    formattedCountry = formatSlug(hotel.country || sanitizedCountry);
    formattedState = formatSlug(hotel['negara bagian'] || sanitizedState);
    formattedCity = formatSlug(hotel.kota || sanitizedCity);
  } else {
    // Use sanitized slugs as fallbacks if no hotel data
    formattedCategory = formatSlug(sanitizedCategory) || 'Hotels';
    formattedCountry = formatSlug(sanitizedCountry) || 'Country';
    formattedState = formatSlug(sanitizedState) || 'State';
    formattedCity = formatSlug(sanitizedCity) || 'City';
  }

  // Fetch long description segments from contentTemplates
  // This is crucial for passing to ClientPage
  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    formattedCategory,
    'city', // entityType
    formattedCity, // entityName
    formattedCity, // cityName (used again here as per template, ensure it's correct)
    formattedState,
    formattedCountry
  );

  const currentYear = new Date().getFullYear();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory || 'hotels'}/${sanitizedCountry || 'country'}/${sanitizedState || 'state'}/${sanitizedCity || 'city'}`;

  // Use the formatted values for display and schema, which are derived from actual data or sanitized fallbacks
  const displayCity = formattedCity;
  const displayState = formattedState;
  const displayCountry = formattedCountry;
  const displayCategory = formattedCategory;

  const schemaDescription = longDescriptionSegments.map(segment => segment.content).join(' ');

  const hotelItems = (hotelsData || []).map((hotel, index) => ({ // Ensure hotelsData is an array here
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Hotel',
      name: hotel.name || hotel.title || 'Unnamed Hotel',
      url: hotel.hotelslug && hotel.cityslug && hotel.stateslug && hotel.countryslug && hotel.categoryslug
        ? `${baseUrl}/${hotel.categoryslug}/${hotel.countryslug}/${hotel.stateslug}/${hotel.cityslug}/${hotel.hotelslug}`
        : `${currentUrl}/${hotel.id || index + 1}`, // Fallback URL generation
      image: hotel.img || hotel.slideimg || '',
      address: {
        '@type': 'PostalAddress',
        streetAddress: hotel.lokasi || 'Unknown Address',
        addressLocality: formatSlug(hotel.kota || formattedCity) || 'Unknown City',
        addressRegion: formatSlug(hotel['negara bagian'] || formattedState) || 'Unknown Region',
        addressCountry: formatSlug(hotel.country || formattedCountry) || 'Unknown Country',
      },
      description: hotel.description || hotel.overview || `A ${displayCategory.toLowerCase()} in ${displayCity}, ${displayState}, ${displayCountry}.`,
    },
  }));

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: currentUrl,
        name: `Best ${displayCategory} in ${displayCity}, ${displayState} ${currentYear}`,
        description: schemaDescription,
        publisher: {
          '@type': 'Organization',
          name: 'Hoteloza',
          logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: displayCategory, item: `${baseUrl}/${sanitizedCategory || 'hotels'}` },
          { '@type': 'ListItem', position: 3, name: displayCountry, item: `${baseUrl}/${sanitizedCategory || 'hotels'}/${sanitizedCountry || 'country'}` },
          { '@type': 'ListItem', position: 4, name: displayState, item: `${baseUrl}/${sanitizedCategory || 'hotels'}/${sanitizedCountry || 'country'}/${sanitizedState || 'state'}` },
          { '@type': 'ListItem', position: 5, name: displayCity, item: currentUrl },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Top ${displayCategory} in ${displayCity}, ${displayState}`,
        description: schemaDescription.substring(0, 160) + '...', // Shorten description for ItemList if needed
        itemListElement: hotelItems,
      },
    ],
  };

  return (
    <>
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      <ClientPage
        categoryslug={sanitizedCategory || 'hotels'}
        countryslug={sanitizedCountry || 'country'}
        stateslug={sanitizedState || 'state'}
        cityslug={sanitizedCity || 'city'}
        formattedCategory={formattedCategory}
        formattedCity={formattedCity}
        formattedState={formattedState}
        formattedCountry={formattedCountry}
        initialHotelsData={hotelsData} // Pass the guaranteed array
        longDescriptionSegments={longDescriptionSegments} 
      />
    </>
  );
}