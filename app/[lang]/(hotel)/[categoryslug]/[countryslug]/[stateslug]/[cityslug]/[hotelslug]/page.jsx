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

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 86400 } });
    if (!response.ok) {
      console.error(`Failed to fetch hotel data from API. Status: ${response.status} - ${response.statusText}`);
      return null;
    }
    const data = await response.json();
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
  return [];
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { hotelslug, lang: locale } = resolvedParams;

  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const commonDict = dictionary?.common || {};

  try {
    const data = await getHotelData(resolvedParams);
    if (!data || !data.hotel) {
      const formattedHotel = formatSlug(hotelslug) || 'Hotel';
      const formattedCity = formatSlug(resolvedParams.cityslug) || 'City';
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
        images: [hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : '')],
      },
      twitter: {
        card: 'summary_large_image',
        title: (metadataDict.hotelOgTitleTemplate || `{hotelTitle} | Hoteloza`).replace('{hotelTitle}', formattedHotel),
        description: (metadataDict.hotelOgDescriptionTemplate || `Find the best deals at {hotelTitle} with Hoteloza.`).replace('{hotelTitle}', formattedHotel),
        images: [hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : '')],
      },
    };
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    return {
      title: metadataDict.hotelNotFoundTitle || `Hotel Not Found | Hoteloza`,
      description: commonDict.errorLoadingData || `The requested hotel could not be found due to an error.`,
    };
  }
}

export default async function HotelDetailPage({ params }) {
  const resolvedParams = await params;
  const { lang: locale } = resolvedParams;
  const dictionary = await getdictionary(locale);
  const currentLang = locale;

  const data = await getHotelData(resolvedParams);
  if (!data || !data.hotel) {
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
      name: hotel.title || 'Unnamed Hotel',
      description: hotel.overview || `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza.`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: hotel.location || 'Unknown Address',
        addressLocality: hotel.city || 'Unknown City',
        addressRegion: hotel.state || 'Unknown Region',
        addressCountry: hotel.country || 'Unknown Country',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: parseFloat(hotel.latitude) || 0,
        longitude: parseFloat(hotel.longitude) || 0,
      },
      image: hotel.img || (Array.isArray(hotel.slideImg) && hotel.slideImg.length > 0 ? hotel.slideImg[0] : ''),
      numberOfRooms: parseInt(hotel.numberrooms) || 0,
      telephone: hotel.telephone || '',
      email: hotel.email || '',
      priceRange: hotel.price !== null && hotel.price !== undefined ? '$$' : '$$$',
      checkinTime: hotel.checkinTime || '15:00',
      checkoutTime: hotel.checkoutTime || '11:00',
      url: currentUrl,
      ...(hotel.ratings && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: parseFloat(hotel.ratings).toFixed(1),
          bestRating: 10,
          worstRating: 1,
          reviewCount: parseInt(hotel.numberOfReviews) || 0,
        },
      }),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: dictionary?.navigation?.home || 'Home', item: `${baseUrl}/${currentLang}` },
        { '@type': 'ListItem', position: 2, name: formatSlug(resolvedParams.categoryslug) || 'Category', item: `${baseUrl}/${currentLang}/${resolvedParams.categoryslug}` },
        { '@type': 'ListItem', position: 3, name: formatSlug(resolvedParams.countryslug) || 'Country', item: `${baseUrl}/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}` },
        { '@type': 'ListItem', position: 4, name: formatSlug(resolvedParams.stateslug) || 'State', item: `${baseUrl}/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}` },
        { '@type': 'ListItem', position: 5, name: formatSlug(resolvedParams.cityslug) || 'City', item: `${baseUrl}/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}` },
        { '@type': 'ListItem', position: 6, name: hotel.title || formattedHotel, item: currentUrl },
      ],
    },
  ];

  return (
    <>
      <Script id="hotel-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <BookNow hotel={hotel} hotelId={hotel?.id} dictionary={dictionary} />
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
