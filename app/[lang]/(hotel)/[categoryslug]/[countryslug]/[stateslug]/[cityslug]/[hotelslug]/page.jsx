// app/[lang]/(hotel)/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/[hotelslug]/page.jsx
import { notFound } from 'next/navigation';
import BookNow from '@/components/hotel-single/BookNow';
import ClientPage from './ClientPage';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary'; // cite: 0

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : ''; // cite: 0

async function getHotelData({ categoryslug, countryslug, stateslug, cityslug, hotelslug }) { // cite: 0
  const sanitizedParams = {
    categoryslug: categoryslug?.replace(/[^a-zA-Z0-9-]/g, '') || '', // cite: 0
    countryslug: countryslug?.replace(/[^a-zA-Z0-9-]/g, '') || '', // cite: 0
    stateslug: stateslug?.replace(/[^a-zA-Z0-9-]/g, '') || '', // cite: 0
    cityslug: cityslug?.replace(/[^a-zA-Z0-9-]/g, '') || '', // cite: 0
    hotelslug: hotelslug?.replace(/[^a-zA-Z0-9-]/g, '') || '', // cite: 0
  };

  if (!sanitizedParams.categoryslug || !sanitizedParams.countryslug || !sanitizedParams.stateslug || !sanitizedParams.cityslug || !sanitizedParams.hotelslug) { // cite: 0
    console.error('Missing required parameters after sanitization:', sanitizedParams); // cite: 0
    return null; // cite: 0
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'; // cite: 0
  const apiUrl = `${baseUrl}/api/${sanitizedParams.categoryslug}/${sanitizedParams.countryslug}/${sanitizedParams.stateslug}/${sanitizedParams.cityslug}/${sanitizedParams.hotelslug}`; // cite: 0
  console.log('Constructed API URL in getHotelData:', apiUrl); // cite: 0

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' }); // cite: 0
    if (!response.ok) { // cite: 0
      console.error(`Failed to fetch hotel data from API. Status: ${response.status} - ${response.statusText}`); // cite: 0
      const errorBody = await response.text(); // cite: 0
      console.error('API Error Response Body:', errorBody); // cite: 0
      return null; // cite: 0
    }
    const data = await response.json(); // cite: 0
    console.log('Raw data received from API in getHotelData:', data); // cite: 0
    if (!data.hotel) { // cite: 0
      console.error('API response is missing "hotel" property:', data); // cite: 0
      return null; // cite: 0
    }
    return data; // cite: 0
  } catch (error) {
    console.error('Error in getHotelData during fetch or JSON parsing:', error); // cite: 0
    return null; // cite: 0
  }
}

export async function generateMetadata({ params }) { // cite: 0
  const resolvedParams = await params; // cite: 0
  console.log('Metadata params:', resolvedParams); // cite: 0
  const { hotelslug, lang: locale } = resolvedParams; // cite: 0

  const dictionary = await getdictionary(locale); // cite: 0
  const metadataDict = dictionary?.metadata || {}; // cite: 0
  const commonDict = dictionary?.common || {}; // cite: 0

  try {
    const data = await getHotelData(resolvedParams); // cite: 0
    if (!data || !data.hotel) { // cite: 0
      console.log('Metadata: Hotel data is null or missing hotel property for:', hotelslug); // cite: 0
      const formattedHotel = formatSlug(hotelslug) || commonDict.unnamedHotel || 'Hotel'; // cite: 0
      const formattedCity = formatSlug(resolvedParams.cityslug) || commonDict.unknownCity || 'City'; // cite: 0
      return {
        title: metadataDict.hotelNotFoundTitle || `${formattedHotel}, ${formattedCity} - Hotel Not Found | Hoteloza`, // cite: 0
        description: metadataDict.hotelNotFoundDescription || `The hotel ${formattedHotel} in ${formattedCity} was not found on Hoteloza.`, // cite: 0
      };
    }

    const hotel = data.hotel; // cite: 0
    const formattedHotel = formatSlug(hotelslug) || hotel.title; // cite: 0
    const formattedCity = formatSlug(resolvedParams.cityslug) || hotel.city; // cite: 0
    const formattedState = formatSlug(resolvedParams.stateslug) || hotel.state; // cite: 0
    const formattedCountry = formatSlug(resolvedParams.countryslug) || hotel.country; // cite: 0
    const currentYear = new Date().getFullYear(); // cite: 0

    return {
      title: (metadataDict.hotelPageTitleTemplate || `{hotelTitle} - Book Now on Hoteloza!`).replace('{hotelTitle}', formattedHotel).replace('{cityName}', formattedCity), // cite: 0
      description: (metadataDict.hotelPageDescriptionTemplate || `Book your stay at {hotelTitle} in {city}, {state}, {country}.`).replace('{hotelTitle}', formattedHotel).replace('{city}', formattedCity).replace('{state}', formattedState).replace('{country}', formattedCountry), // cite: 0
      alternates: {
        canonical: `https://hoteloza.com/${locale}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${hotelslug}`, // cite: 0
      },
      openGraph: {
        title: (metadataDict.hotelOgTitleTemplate || `{hotelTitle} | Hoteloza`).replace('{hotelTitle}', formattedHotel), // cite: 0
        description: (metadataDict.hotelOgDescriptionTemplate || `Find the best deals at {hotelTitle} with Hoteloza.`).replace('{hotelTitle}', formattedHotel), // cite: 0
        url: `https://hoteloza.com/${locale}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${hotelslug}`, // cite: 0
        images: [hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : '')], // Diperbaiki: Akses elemen pertama dari slideImg
      },
      twitter: {
        card: 'summary_large_image', // cite: 0
        title: (metadataDict.hotelOgTitleTemplate || `{hotelTitle} | Hoteloza`).replace('{hotelTitle}', formattedHotel), // cite: 0
        description: (metadataDict.hotelOgDescriptionTemplate || `Find the best deals at {hotelTitle} with Hoteloza.`).replace('{hotelTitle}', formattedHotel), // cite: 0
        images: [hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : '')], // Diperbaiki: Akses elemen pertama dari slideImg
      },
    };
  } catch (error) {
    console.error('Error in generateMetadata (catch block):', error); // cite: 0
    return {
      title: metadataDict.hotelNotFoundTitle || `Hotel Not Found | Hoteloza`, // cite: 0
      description: commonDict.errorLoadingData || `The requested hotel could not be found due to an error.`, // cite: 0
    };
  }
}

export default async function HotelDetailPage({ params }) { // cite: 0
  const resolvedParams = await params; // cite: 0
  console.log('Received params in HotelDetailPage:', resolvedParams); // cite: 0
  const data = await getHotelData(resolvedParams); // cite: 0

  console.log('Data received from getHotelData in HotelDetailPage component:', data); // cite: 0
  const { lang: locale } = resolvedParams; // cite: 0
  const dictionary = await getdictionary(locale); // cite: 0
  const currentLang = locale; // cite: 0

  const commonDict = dictionary?.common || {}; // cite: 0
  const navigationDict = dictionary?.navigation || {}; // cite: 0

  if (!data || !data.hotel) { // cite: 0
    console.error('Hotel data is missing or null in HotelDetailPage. Calling notFound(). Data:', data); // cite: 0
    notFound(); // cite: 0
  }

  const hotel = data.hotel; // cite: 0
  const relatedHotels = data.relatedHotels; // cite: 0

  const formattedHotel = formatSlug(resolvedParams.hotelslug) || hotel.title; // cite: 0
  const formattedCity = formatSlug(resolvedParams.cityslug) || hotel.city; // cite: 0
  const formattedState = formatSlug(resolvedParams.stateslug) || hotel.state; // cite: 0
  const formattedCountry = formatSlug(resolvedParams.countryslug) || hotel.country; // cite: 0
  const formattedCategory = formatSlug(resolvedParams.categoryslug) || hotel.category; // cite: 0
  const currentYear = new Date().getFullYear(); // cite: 0

  const schemas = [ // cite: 0
    {
      '@context': 'https://schema.org', // cite: 0
      '@type': ['Hotel', 'LocalBusiness'], // cite: 0
      name: hotel.title || commonDict.unnamedHotel || 'Unnamed Hotel', // cite: 0
      description: hotel.overview || commonDict.defaultSchemaDescription || `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza.`, // Diperbaiki: Prioritaskan 'overview'
      address: {
        '@type': 'PostalAddress', // cite: 0
        streetAddress: hotel.location || commonDict.unknownAddress || 'Unknown Address', // Diperbaiki: Menambahkan streetAddress dari 'location'
        addressLocality: hotel.city || commonDict.unknownCity || 'Unknown City', // cite: 0
        addressRegion: hotel.state || commonDict.unknownState || 'Unknown Region', // cite: 0
        addressCountry: hotel.country || commonDict.unknownCountry || 'Unknown Country', // cite: 0
      },
      geo: {
        '@type': 'GeoCoordinates', // cite: 0
        latitude: parseFloat(hotel.latitude) || 0, // cite: 0
        longitude: parseFloat(hotel.longitude) || 0, // cite: 0
      },
      image: hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : ''), // Diperbaiki: Akses elemen pertama dari slideImg
      numberOfRooms: parseInt(hotel.numberrooms) || 0, // Diperbaiki: Menggunakan 'numberrooms'
      telephone: hotel.telephone || '', // cite: 0
      email: hotel.email || '', // cite: 0
      priceRange: hotel.priceRange || (hotel.price !== null ? '$$' : '$$$'), // Diperbaiki: Coba tentukan priceRange berdasarkan 'price' jika ada
      checkinTime: hotel.checkinTime || '15:00', // cite: 0
      checkoutTime: hotel.checkoutTime || '11:00', // cite: 0
      url: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}`, // cite: 0
      ...(hotel.ratings && {
        aggregateRating: {
          '@type': 'AggregateRating', // cite: 0
          ratingValue: parseFloat(hotel.ratings).toFixed(1), // cite: 0
          bestRating: 10, // cite: 0
          worstRating: 1, // cite: 0
          reviewCount: parseInt(hotel.numberOfReviews) || 0, // Diperbaiki: Menggunakan 'numberOfReviews'
        },
      }),
      // Menghapus starRating jika tidak ada di API untuk menghindari properti kosong
      // ...(hotel.starRating && {
      //   starRating: {
      //     '@type': 'Rating',
      //     ratingValue: parseFloat(hotel.starRating),
      //     bestRating: 5,
      //   },
      // }),
    },
    {
      '@context': 'https://schema.org', // cite: 0
      '@type': 'BreadcrumbList', // cite: 0
      itemListElement: [ // cite: 0
        { '@type': 'ListItem', position: 1, name: navigationDict.home || 'Home', item: `https://hoteloza.com/${currentLang}` }, // cite: 0
        { '@type': 'ListItem', position: 2, name: formatSlug(resolvedParams.categoryslug) || formattedCategory, item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}` }, // cite: 0
        { '@type': 'ListItem', position: 3, name: formatSlug(resolvedParams.countryslug) || formattedCountry, item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}` }, // cite: 0
        { '@type': 'ListItem', position: 4, name: formatSlug(resolvedParams.stateslug) || formattedState, item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}` }, // cite: 0
        { '@type': 'ListItem', position: 5, name: formatSlug(resolvedParams.cityslug) || formattedCity, item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}` }, // cite: 0
        { '@type': 'ListItem', position: 6, name: hotel.title || formattedHotel, item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}` }, // cite: 0
      ],
    },
  ];

  return (
    <>
      <Script id="hotel-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} /> {/* cite: 0 */}
      <BookNow hotel={data.hotel} hotelId={data.hotel?.id} dictionary={dictionary} /> {/* cite: 0 */}
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
    </>
  );
}