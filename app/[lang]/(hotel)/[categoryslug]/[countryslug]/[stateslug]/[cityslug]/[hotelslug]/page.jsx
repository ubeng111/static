// page.jsx (Hotel Single Page Detail)
import { notFound } from 'next/navigation';
import BookNow from '@/components/hotel-single/BookNow';
import ClientPage from './ClientPage';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary'; // Menggunakan alias

// Helper function to format slugs for display purposes
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch hotel data for both metadata and page content
async function getHotelData({ categoryslug, countryslug, stateslug, cityslug, hotelslug }) {
  // Sanitize slugs to prevent invalid characters
  const sanitizedParams = {
    categoryslug: categoryslug?.replace(/[^a-zA-Z0-9-]/g, ''),
    countryslug: countryslug?.replace(/[^a-zA-Z0-9-]/g, ''),
    stateslug: stateslug?.replace(/[^a-zA-Z0-9-]/g, ''),
    cityslug: cityslug?.replace(/[^a-zA-Z0-9-]/g, ''),
    hotelslug: hotelslug?.replace(/[^a-zA-Z0-9-]/g, ''),
  };

  // Validate parameters
  if (
    !sanitizedParams.categoryslug ||
    !sanitizedParams.countryslug ||
    !sanitizedParams.stateslug ||
    !sanitizedParams.cityslug ||
    !sanitizedParams.hotelslug
  ) {
    console.error('Missing required parameters after sanitization:', sanitizedParams);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedParams.categoryslug}/${sanitizedParams.countryslug}/${sanitizedParams.stateslug}/${sanitizedParams.cityslug}/${sanitizedParams.hotelslug}`;
  console.log('Constructed API URL in getHotelData:', apiUrl);

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(
        `Failed to fetch hotel data from API. Status: ${response.status} - ${response.statusText}`
      );
      const errorBody = await response.text();
      console.error('API Error Response Body:', errorBody);
      return null;
    }
    const data = await response.json();
    console.log('Raw data received from API in getHotelData:', data);
    if (!data.hotel) {
      console.error('API response is missing "hotel" property:', data);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error in getHotelData during fetch or JSON parsing:', error);
    return null;
  }
}

export async function generateStaticParams() {
  return [
    {
      categoryslug: 'hotel',
      countryslug: 'usa',
      stateslug: 'california',
      cityslug: 'los-angeles',
      hotelslug: 'the-ritz-carlton-los-angeles',
    },
  ];
}

export async function generateMetadata({ params }) {
  // --- MULAI PERUBAHAN UNTUK generateMetadata ---
  const resolvedParams = await params; // <--- AWAIT PARAMS DI SINI
  console.log('Metadata params:', resolvedParams);
  const { hotelslug, lang: locale } = resolvedParams;
  // --- AKHIR PERUBAHAN ---

  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const commonDict = dictionary?.common || {};

  try {
    const data = await getHotelData(resolvedParams);
    if (!data || !data.hotel) {
      console.log('Metadata: Hotel data is null or missing hotel property for:', hotelslug);
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
        canonical: `https://hoteloza.com/${locale}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${hotelslug}`, // URL Canonical dengan lang
      },
      openGraph: {
        title: (metadataDict.hotelOgTitleTemplate || `{hotelTitle} | Hoteloza`)
          .replace('{hotelTitle}', formattedHotel),
        description: (metadataDict.hotelOgDescriptionTemplate || `Find the best deals at {hotelTitle} with Hoteloza.`)
          .replace('{hotelTitle}', formattedHotel),
        url: `https://hoteloza.com/${locale}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${hotelslug}`, // URL OpenGraph dengan lang
        images: [hotel.img || hotel.slideimg || ''],
      },
      twitter: {
        card: 'summary_large_image',
        title: (metadataDict.hotelOgTitleTemplate || `{hotelTitle} | Hoteloza`)
          .replace('{hotelTitle}', formattedHotel),
        description: (metadataDict.hotelOgDescriptionTemplate || `Find the best deals at {hotelTitle} with Hoteloza.`)
          .replace('{hotelTitle}', formattedHotel),
        images: [hotel.img || hotel.slideimg || ''],
      },
    };
  } catch (error) {
    console.error('Error in generateMetadata (catch block):', error);
    return {
      title: metadataDict.hotelNotFoundTitle || `Hotel Not Found | Hoteloza`,
      description: commonDict.errorLoadingData || `The requested hotel could not be found due to an error.`,
    };
  }
}

export default async function HotelDetailPage({ params }) {
  // --- MULAI PERUBAHAN UNTUK KOMPONEN Page ---
  const resolvedParams = await params; // <--- AWAIT PARAMS DI SINI
  console.log('Received params in HotelDetailPage:', resolvedParams);
  const data = await getHotelData(resolvedParams);
  // --- AKHIR PERUBAHAN ---

  console.log('Data received from getHotelData in HotelDetailPage component:', data);
  const { lang: locale } = resolvedParams;
  const dictionary = await getdictionary(locale);

  const currentLang = locale; // Lang saat ini

  const commonDict = dictionary?.common || {};
  const navigationDict = dictionary?.navigation || {};

  if (!data || !data.hotel) {
    console.error('Hotel data is missing or null in HotelDetailPage. Calling notFound(). Data:', data);
    notFound();
  }

  const hotel = data.hotel;
  const relatedHotels = data.relatedHotels;

  console.log('Hotel object being passed to ClientPage:', hotel);

  const formattedHotel = formatSlug(resolvedParams.hotelslug) || hotel.title;
  const formattedCity = formatSlug(resolvedParams.cityslug) || hotel.city;
  const formattedState = formatSlug(resolvedParams.stateslug) || hotel.state;
  const formattedCountry = formatSlug(resolvedParams.countryslug) || hotel.country;
  const formattedCategory = formatSlug(resolvedParams.categoryslug) || hotel.category;
  const currentYear = new Date().getFullYear();

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': ['Hotel', 'LocalBusiness'],
      name: hotel.title || commonDict.unnamedHotel || 'Unnamed Hotel',
      description: hotel.description || `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza.`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: hotel.city || commonDict.unknownCity || 'Unknown City',
        addressRegion: hotel.state || commonDict.unknownState || 'Unknown Region',
        addressCountry: hotel.country || commonDict.unknownCountry || 'Unknown Country',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: parseFloat(hotel.latitude) || 0,
        longitude: parseFloat(hotel.longitude) || 0,
      },
      image: hotel.img || hotel.slideimg || '',
      numberOfRooms: parseInt(hotel.numberofrooms) || 0,
      telephone: hotel.telephone || '',
      email: hotel.email || '',
      priceRange: hotel.priceRange || '$$$',
      checkinTime: hotel.checkinTime || '15:00',
      checkoutTime: hotel.checkoutTime || '11:00',
      url: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}`, // URL Schema dengan lang
      ...(hotel.ratings && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: parseFloat(hotel.ratings).toFixed(1),
          bestRating: 10,
          worstRating: 1,
          reviewCount: parseInt(hotel.numberofreviews) || 0,
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
        { '@type': 'ListItem', position: 1, name: navigationDict.home || 'Home', item: `https://hoteloza.com/${currentLang}` }, // URL Home dengan lang
        {
          '@type': 'ListItem',
          position: 2,
          name: formatSlug(resolvedParams.categoryslug) || formattedCategory,
          item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}`, // URL Category dengan lang
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: formatSlug(resolvedParams.countryslug) || formattedCountry,
          item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}`, // URL Country dengan lang
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: formatSlug(resolvedParams.stateslug) || formattedState,
          item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}`, // URL State dengan lang
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: formatSlug(resolvedParams.cityslug) || formattedCity,
          item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}`, // URL City dengan lang
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: hotel.title || formattedHotel,
          item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}`, // URL Hotel detail dengan lang
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
        currentLang={currentLang} // Teruskan currentLang
      />
    </>
  );
}