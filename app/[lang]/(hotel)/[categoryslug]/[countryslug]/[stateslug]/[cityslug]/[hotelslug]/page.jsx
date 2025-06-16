// app/[lang]/(hotel)/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/[hotelslug]/page.jsx
import { notFound } from 'next/navigation';
import BookNow from '@/components/hotel-single/BookNow';
import ClientPage from './ClientPage';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary';

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

async function getHotelData({ categoryslug, countryslug, stateslug, cityslug, hotelslug }) {
  const sanitizedParams = {
    categoryslug: categoryslug?.replace(/[^a-zA-Z0-9-]/g, '') || '',
    countryslug: countryslug?.replace(/[^a-zA-Z0-9-]/g, '') || '',
    stateslug: stateslug?.replace(/[^a-zA-Z0-9-]/g, '') || '',
    cityslug: cityslug?.replace(/[^a-zA-Z0-9-]/g, '') || '',
    hotelslug: hotelslug?.replace(/[^a-zA-Z0-9-]/g, '') || '',
  };

  if (!sanitizedParams.categoryslug || !sanitizedParams.countryslug || !sanitizedParams.stateslug || !sanitizedParams.cityslug || !sanitizedParams.hotelslug) {
    console.error('Missing required parameters after sanitization:', sanitizedParams);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedParams.categoryslug}/${sanitizedParams.countryslug}/${sanitizedParams.stateslug}/${sanitizedParams.cityslug}/${sanitizedParams.hotelslug}`;
  console.log('Constructed API URL in getHotelData:', apiUrl);

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Failed to fetch hotel data from API. Status: ${response.status} - ${response.statusText}`);
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

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  console.log('Metadata params:', resolvedParams);
  const { hotelslug, lang: locale } = resolvedParams;

  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const commonDict = dictionary?.common || {};

  try {
    const data = await getHotelData(resolvedParams);
    if (!data || !data.hotel) {
      console.log('Metadata: Hotel data is null or missing hotel property for:', hotelslug);
      const formattedHotel = formatSlug(hotelslug) || 'Hotel'; // No dict fallback here
      const formattedCity = formatSlug(resolvedParams.cityslug) || 'City'; // No dict fallback here
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
      title: (metadataDict.hotelPageTitleTemplate || `{hotelTitle} - Book Now on Hoteloza!`).replace('{hotelTitle}', formattedHotel).replace('{cityName}', formattedCity),
      description: (metadataDict.hotelPageDescriptionTemplate || `Book your stay at {hotelTitle} in {city}, {state}, {country}.`).replace('{hotelTitle}', formattedHotel).replace('{city}', formattedCity).replace('{state}', formattedState).replace('{country}', formattedCountry),
      alternates: {
        canonical: `https://hoteloza.com/${locale}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${hotelslug}`,
      },
      openGraph: {
        title: (metadataDict.hotelOgTitleTemplate || `{hotelTitle} | Hoteloza`).replace('{hotelTitle}', formattedHotel),
        description: (metadataDict.hotelOgDescriptionTemplate || `Find the best deals at {hotelTitle} with Hoteloza.`).replace('{hotelTitle}', formattedHotel),
        url: `https://hoteloza.com/${locale}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${hotelslug}`,
        images: [hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : '')], // Corrected
      },
      twitter: {
        card: 'summary_large_image',
        title: (metadataDict.hotelOgTitleTemplate || `{hotelTitle} | Hoteloza`).replace('{hotelTitle}', formattedHotel),
        description: (metadataDict.hotelOgDescriptionTemplate || `Find the best deals at {hotelTitle} with Hoteloza.`).replace('{hotelTitle}', formattedHotel),
        images: [hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : '')], // Corrected
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
  const resolvedParams = await params;
  console.log('Received params in HotelDetailPage:', resolvedParams);
  const data = await getHotelData(resolvedParams);

  console.log('Data received from getHotelData in HotelDetailPage component:', data);
  const { lang: locale } = resolvedParams;
  const dictionary = await getdictionary(locale);
  const currentLang = locale;

  const commonDict = dictionary?.common || {};
  const navigationDict = dictionary?.navigation || {};

  if (!data || !data.hotel) {
    console.error('Hotel data is missing or null in HotelDetailPage. Calling notFound(). Data:', data);
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

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': ['Hotel', 'LocalBusiness'],
      name: hotel.title || 'Unnamed Hotel', // No dict fallback
      description: hotel.overview || `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza.`, // Corrected: prioritize overview, literal fallback
      address: {
        '@type': 'PostalAddress',
        streetAddress: hotel.location || 'Unknown Address', // Corrected: use hotel.location, no dict fallback
        addressLocality: hotel.city || 'Unknown City', // Corrected: use hotel.city, no dict fallback
        addressRegion: hotel.state || 'Unknown Region', // Corrected: use hotel.state, no dict fallback
        addressCountry: hotel.country || 'Unknown Country', // Corrected: use hotel.country, no dict fallback
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: parseFloat(hotel.latitude) || 0,
        longitude: parseFloat(hotel.longitude) || 0,
      },
      image: hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : ''), // Corrected
      numberOfRooms: parseInt(hotel.numberrooms) || 0, // Corrected
      telephone: hotel.telephone || '', // Assuming this might be present in API but not in example
      email: hotel.email || '', // Assuming this might be present in API but not in example
      priceRange: hotel.price !== null && hotel.price !== undefined ? '$$' : '$$$', // More robust check for price being not null/undefined
      checkinTime: hotel.checkinTime || '15:00', // Assuming this might be present in API
      checkoutTime: hotel.checkoutTime || '11:00', // Assuming this might be present in API
      url: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}`,
      ...(hotel.ratings && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: parseFloat(hotel.ratings).toFixed(1),
          bestRating: 10,
          worstRating: 1,
          reviewCount: parseInt(hotel.numberOfReviews) || 0, // Corrected
        },
      }),
      // Removed starRating section as per previous discussion if not consistently available
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: navigationDict.home || 'Home', item: `https://hoteloza.com/${currentLang}` },
        { '@type': 'ListItem', position: 2, name: formatSlug(resolvedParams.categoryslug) || 'Category', item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}` }, // Literal fallback
        { '@type': 'ListItem', position: 3, name: formatSlug(resolvedParams.countryslug) || 'Country', item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}` }, // Literal fallback
        { '@type': 'ListItem', position: 4, name: formatSlug(resolvedParams.stateslug) || 'State', item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}` }, // Literal fallback
        { '@type': 'ListItem', position: 5, name: formatSlug(resolvedParams.cityslug) || 'City', item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}` }, // Literal fallback
        { '@type': 'ListItem', position: 6, name: hotel.title || formattedHotel, item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}` },
      ],
    },
  ];

  return (
    <>
      <Script id="hotel-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
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
    </>
  );
}