// app/[lang]/(hotel)/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/[hotelslug]/page.jsx

import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Suspense } from 'react'; // Import Suspense
import { getdictionary } from '@/dictionaries/get-dictionary';
import BookNow from '@/components/hotel-single/BookNow';

// Hapus dynamic import ClientPageDynamic dari sini.
// Sekarang kita akan import ClientPage secara langsung dan membungkusnya dengan Suspense.
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

// Helper function to format slugs for display
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch hotel data for both metadata and page content
async function getHotelData({ categoryslug, countryslug, stateslug, cityslug, hotelslug }) {
  const sanitizedParams = {
    categoryslug: sanitizeSlug(categoryslug),
    countryslug: sanitizeSlug(countryslug),
    stateslug: sanitizeSlug(stateslug),
    cityslug: sanitizeSlug(cityslug),
    hotelslug: sanitizeSlug(hotelslug),
  };

  // console.log('getHotelData: Sanitized parameters:', sanitizedParams); // Aktifkan untuk debugging

  if (
    !sanitizedParams.categoryslug ||
    !sanitizedParams.countryslug ||
    !sanitizedParams.stateslug ||
    !sanitizedParams.cityslug ||
    !sanitizedParams.hotelslug
  ) {
    console.error('getHotelData: Missing or invalid required parameters after sanitization. Cannot fetch hotel data.', sanitizedParams);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedParams.categoryslug}/${sanitizedParams.countryslug}/${sanitizedParams.stateslug}/${sanitizedParams.cityslug}/${sanitizedParams.hotelslug}`;
  // console.log('getHotelData: Constructed API URL:', apiUrl); // Aktifkan untuk debugging

  try {
    const response = await fetch(apiUrl, {
      // Opsi cache untuk fetch di Server Components
      // Secara default Next.js akan menerapkan revalidate dari page.jsx
      // Anda bisa menimpa atau menambahkan opsi di sini jika diperlukan.
      // cache: 'no-store' // Untuk memastikan data selalu baru (jika tidak ingin ISR)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `getHotelData: Failed to fetch hotel data from API. Status: ${response.status} - ${response.statusText}. Response Body: ${errorBody}`
      );
      return null;
    }
    const data = await response.json();
    if (!data.hotel) {
      console.error('getHotelData: API response is missing "hotel" property or is empty:', data);
      return null;
    }
    // console.log('getHotelData: Successfully fetched hotel data (truncated):', JSON.stringify(data, null, 2).substring(0, 500) + '...'); // Aktifkan untuk debugging
    return data;
  } catch (error) {
    console.error('getHotelData: Error during fetch or JSON parsing:', error);
    return null;
  }
}

// Hapus const ClientPageDynamic = dynamic(() => import('./ClientPage'), { ssr: false, }); dari sini.
// Ini adalah penyebab errornya.


export async function generateMetadata({ params }) {
  const resolvedParams = params;

  const { hotelslug, lang: locale } = resolvedParams;

  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const commonDict = dictionary?.common || {};

  try {
    const data = await getHotelData(resolvedParams);
    if (!data || !data.hotel) {
      console.warn('generateMetadata: Hotel data is null or missing hotel property for metadata. Returning default.', hotelslug);
      const formattedHotel = formatSlug(hotelslug) || commonDict.unnamedHotel || 'Hotel';
      const formattedCity = formatSlug(resolvedParams.cityslug) || commonDict.unknownCity || 'City';
      return {
        title: metadataDict.hotelNotFoundTitle || `${formattedHotel}, ${formattedCity} - Hotel Not Found | Hoteloza`,
        description: metadataDict.hotelNotFoundDescription || `The hotel ${formattedHotel} in ${formattedCity} was not found on Hoteloza.`,
      };
    }

    const hotel = data.hotel;
    const formattedHotel = formatSlug(hotelslug) || hotel.title;
    const formattedCity = formatSlug(resolvedParams.cityslug) || hotel.city;
    const formattedState = formatSlug(resolvedParams.stateslug) || hotel.state;
    const formattedCountry = formatSlug(resolvedParams.countryslug) || hotel.country;
    const currentYear = new Date().getFullYear();

    const ogImages = (hotel.img || hotel.slideimg) ? [hotel.img || hotel.slideimg] : ['https://hoteloza.com/og-image.jpg'];

    return {
      title: (metadataDict.hotelPageTitleTemplate || `{hotelTitle} - Book Now on Hoteloza!`)
        .replace('{hotelTitle}', formattedHotel)
        .replace('{cityName}', formattedCity),
      description: (metadataDict.hotelPageDescriptionTemplate || `Book your stay at {hotelTitle} in {city}, {state}, {country}. Find the best deals, facilities, and reviews for an unforgettable experience with Hoteloza.`)
        .replace('{hotelTitle}', formattedHotel)
        .replace('{city}', formattedCity)
        .replace('{state}', formattedState)
        .replace('{country}', formattedCountry),
      alternates: {
        canonical: `https://hoteloza.com/${locale}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${hotelslug}`,
        languages: {
          'en-US': `https://hoteloza.com/en/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${hotelslug}`,
          'id-ID': `https://hoteloza.com/id/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${hotelslug}`,
          'x-default': `https://hoteloza.com/en/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${hotelslug}`,
        },
      },
      openGraph: {
        title: (metadataDict.hotelOgTitleTemplate || `{hotelTitle} | Hoteloza`)
          .replace('{hotelTitle}', formattedHotel),
        description: (metadataDict.hotelOgDescriptionTemplate || `Find the best deals at {hotelTitle} with Hoteloza.`)
          .replace('{hotelTitle}', formattedHotel),
        url: `https://hoteloza.com/${locale}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${hotelslug}`,
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: (metadataDict.hotelOgTitleTemplate || `{hotelTitle} | Hoteloza`)
          .replace('{hotelTitle}', formattedHotel),
        description: (metadataDict.hotelOgDescriptionTemplate || `Find the best deals at {hotelTitle} with Hoteloza.`)
          .replace('{hotelTitle}', formattedHotel),
        images: ogImages,
      },
    };
  } catch (error) {
    console.error('generateMetadata: Error in metadata generation (catch block):', error);
    return {
      title: metadataDict.hotelNotFoundTitle || `Hotel Not Found | Hoteloza`,
      description: commonDict.errorLoadingData || `The requested hotel could not be found due to an error.`,
    };
  }
}

export default async function HotelDetailPage({ params }) {
  const resolvedParams = params;

  const data = await getHotelData(resolvedParams);

  const { lang: locale } = resolvedParams;
  const dictionary = await getdictionary(locale);

  const currentLang = locale;

  const commonDict = dictionary?.common || {};
  const navigationDict = dictionary?.navigation || {};

  if (!data || !data.hotel) {
    console.error('HotelDetailPage: Hotel data is missing or null. Calling notFound(). Data:', data);
    notFound();
  }

  const hotel = data.hotel;
  const relatedHotels = data.relatedHotels;

  const formattedHotel = formatSlug(resolvedParams.hotelslug) || hotel.title;
  const formattedCity = formatSlug(resolvedParams.cityslug) || hotel.city;
  const formattedState = formatSlug(resolvedParams.stateslug) || hotel.state;
  const formattedCountry = formatSlug(resolvedParams.countryslug) || hotel.country;
  const formattedCategory = formatSlug(resolvedParams.categoryslug) || hotel.category;
  const currentYear = new Date().getFullYear();

  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}`;

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': ['Hotel', 'LocalBusiness'],
      name: hotel.title || commonDict.unnamedHotel || 'Unnamed Hotel',
      description: hotel.description || `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza.`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: hotel.lokasi || commonDict.unknownAddress || 'Unknown Address',
        addressLocality: hotel.city || commonDict.unknownCity || 'Unknown City',
        addressRegion: hotel.state || commonDict.unknownState || 'Unknown Region',
        addressCountry: hotel.country || commonDict.unknownCountry || 'Unknown Country',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: parseFloat(hotel.latitude) || 0,
        longitude: parseFloat(hotel.longitude) || 0,
      },
      image: hotel.img || hotel.slideimg || 'https://hoteloza.com/default-hotel-image.jpg',
      numberOfRooms: parseInt(hotel.numberofrooms) || 0,
      telephone: hotel.telephone || '',
      email: hotel.email || '',
      priceRange: hotel.priceRange || '$$$',
      checkinTime: hotel.checkinTime || '15:00',
      checkoutTime: hotel.checkoutTime || '11:00',
      url: currentUrl,
      ...(hotel.numberofreviews && parseInt(hotel.numberofreviews) > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: parseFloat(hotel.ratings).toFixed(1),
          bestRating: 10,
          worstRating: 1,
          reviewCount: parseInt(hotel.numberofreviews),
        },
      }),
      ...(hotel.starRating && {
        starRating: {
          '@type': 'Rating',
          ratingValue: parseFloat(hotel.starRating),
          bestRating: 5,
        },
      }),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: navigationDict.home || 'Home', item: `${baseUrl}/${currentLang}` },
        {
          '@type': 'ListItem',
          position: 2,
          name: formatSlug(resolvedParams.categoryslug) || formattedCategory,
          item: `${baseUrl}/${currentLang}/${resolvedParams.categoryslug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: formatSlug(resolvedParams.countryslug) || formattedCountry,
          item: `${baseUrl}/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: formatSlug(resolvedParams.stateslug) || formattedState,
          item: `${baseUrl}/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: formatSlug(resolvedParams.cityslug) || formattedCity,
          item: `${baseUrl}/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}`,
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: hotel.title || formattedHotel,
          item: currentUrl,
        },
      ],
    },
  ];

  return (
    <>
      <Script
        id="hotel-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      {/* Bungkus ClientPage dengan Suspense */}
      <Suspense fallback={<div>Memuat detail hotel...</div>}>
        <BookNow hotel={data.hotel} hotelId={data.hotel?.id} dictionary={dictionary} />
        <ClientPage
          hotel={hotel}
          relatedHotels={relatedHotels}
          useHotels2={true}
          hotelslug={resolvedParams.hotelslug}
          categoryslug={resolvedParams.categoryslug}
          countryslug={resolvedParams.countryslug}
          stateslug={resolvedParams.stateslug}
          cityslug={resolvedParams.cityslug}
          dictionary={dictionary}
          currentLang={currentLang}
        />
      </Suspense>
    </>
  );
}

// **Penting untuk Dynamic Routes di App Router:**
// Anda harus mengembalikan semua kombinasi slug yang mungkin
// untuk dibangun secara statis saat waktu build.
export async function generateStaticParams() {
  const allCategories = ['hotel-discounts', 'luxury-hotels'];
  const allCountries = ['indonesia', 'malaysia'];
  const allStates = ['bali', 'jakarta'];
  const allCities = ['denpasar', 'ubud'];
  const allHotels = ['hotel-grand-bali', 'hotel-bintang-ubud'];

  const supportedLangs = ['en', 'us', 'id'];

  const params = [];
  for (const lang of supportedLangs) {
    for (const category of allCategories) {
      for (const country of allCountries) {
        for (const state of allStates) {
          for (const city of allCities) {
            for (const hotel of allHotels) {
              params.push({
                lang: lang,
                categoryslug: category,
                countryslug: country,
                stateslug: state,
                cityslug: city,
                hotelslug: hotel,
              });
            }
          }
        }
      }
    }
  }
  return params;
}