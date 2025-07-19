// app/(hotel)/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/[hotelslug]/page.jsx
import { notFound } from 'next/navigation';
import BookNow from '@/components/hotel-single/BookNow';
import ClientPage from './ClientPage';
import Script from 'next/script';

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

async function getHotelData({ categoryslug, countryslug, stateslug, cityslug, hotelslug }) {
  const sanitizedParams = {
    categoryslug: categoryslug?.replace(/[^a-zA-Z0-9-]/g, ''),
    countryslug: countryslug?.replace(/[^a-zA-Z0-9-]/g, ''),
    stateslug: stateslug?.replace(/[^a-zA-Z0-9-]/g, ''),
    cityslug: cityslug?.replace(/[^a-zA-Z0-9-]/g, ''),
    hotelslug: hotelslug?.replace(/[^a-zA-Z0-9-]/g, ''),
  };

  if (
    !sanitizedParams.categoryslug ||
    !sanitizedParams.countryslug ||
    !sanitizedParams.stateslug ||
    !sanitizedParams.cityslug ||
    !sanitizedParams.hotelslug
  ) {
    console.error('SERVER ERROR [page.jsx - getHotelData]: Missing required parameters after sanitization:', sanitizedParams);
    return null;
  }

  // MENGGUNAKAN URL LENGKAP HTTPS://HOTELOZA.COM untuk FETCH DATA HOTEL
  const apiUrl = `https://hoteloza.com/api/${sanitizedParams.categoryslug}/${sanitizedParams.countryslug}/${sanitizedParams.stateslug}/${sanitizedParams.cityslug}/${sanitizedParams.hotelslug}`;
  console.log('SERVER DEBUG [page.jsx - getHotelData]: Constructed API URL:', apiUrl);

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 31536000 } }); 
    if (!response.ok) {
      if (response.status === 404) {
          console.warn(`SERVER WARN [page.jsx - getHotelData]: Hotel not found for ${sanitizedParams.hotelslug}. Status: 404.`);
      } else {
          console.error(
              `SERVER ERROR [page.jsx - getHotelData]: Failed to fetch hotel data for ${sanitizedParams.hotelslug}. Status: ${response.status} - ${response.statusText}`
          );
      }
      return null;
    }
    return response.json();
  } catch (error) {
      console.error('SERVER FATAL ERROR [page.jsx - getHotelData]: Error fetching hotel data:', error);
      return null;
  }
}

async function getLandmarkDataForHotel(hotelLatitude, hotelLongitude, hotelCityId) { 
  if (!hotelLatitude || !hotelLongitude || !hotelCityId) {
    console.warn("SERVER WARN [page.jsx - getLandmarkDataForHotel]: Hotel coordinates or cityId missing. Cannot find relevant landmarks. Returning empty array.");
    return [];
  }

  // MENGGUNAKAN URL LENGKAP HTTPS://HOTELOZA.COM untuk FETCH DATA LANDMARK
  const allLandmarksApiUrl = `https://hoteloza.com/api/fast-landmarks-by-city?city_id=${hotelCityId}`; 
  console.log(`SERVER DEBUG [page.jsx - getLandmarkDataForHotel]: Calling SQL API for landmarks: ${allLandmarksApiUrl}`);

  try {
    const response = await fetch(allLandmarksApiUrl, { next: { revalidate: 31536000 } }); 
    
    if (!response.ok) {
      console.warn(`SERVER WARN [page.jsx - getLandmarkDataForHotel]: Failed to fetch landmark data from SQL API. Status: ${response.status}`);
      return [];
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
        console.warn("SERVER WARN [page.jsx - getLandmarkDataForHotel]: SQL API for landmarks did not return an array. Returning empty array.");
        return [];
    }
    console.log(`SERVER DEBUG [page.jsx - getLandmarkDataForHotel]: Received ${data.length} landmarks from SQL API for city_id ${hotelCityId}.`);

    const MAX_RELEVANT_DISTANCE_KM = 20; 
    const POOL_SIZE_FOR_SHUFFLE = 30; 
    const FINAL_DISPLAY_COUNT = 12; 

    let processedLandmarks = data.map(landmark => {
      const landmarkLat = parseFloat(landmark.latitude);
      const landmarkLon = parseFloat(landmark.longitude);

      if (isNaN(landmarkLat) || isNaN(landmarkLon)) {
          console.warn(`SERVER WARN [page.jsx - getLandmarkDataForHotel]: Invalid coordinates for landmark ${landmark.name}. Skipping.`);
          return null; 
      }

      const distance = calculateDistance(
        parseFloat(hotelLatitude), parseFloat(hotelLongitude),
        landmarkLat, landmarkLon
      );
      return {
        ...landmark,
        distance: distance, 
      };
    }).filter(landmark => 
      landmark !== null && landmark.distance <= MAX_RELEVANT_DISTANCE_KM && landmark.slug && landmark.name
    );

    processedLandmarks.sort((a, b) => a.distance - b.distance); 

    const relevantAndLimitedPool = processedLandmarks.slice(0, POOL_SIZE_FOR_SHUFFLE);

    for (let i = relevantAndLimitedPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [relevantAndLimitedPool[i], relevantAndLimitedPool[j]] = [relevantAndLimitedPool[j], relevantAndLimitedPool[i]];
    }

    const finalLandmarks = relevantAndLimitedPool.slice(0, FINAL_DISPLAY_COUNT);

    console.log(`SERVER DEBUG [page.jsx - getLandmarkDataForHotel]: Returning ${finalLandmarks.length} relevant, random, and limited landmarks.`);
    return finalLandmarks; 

  } catch (error) {
    console.error("SERVER FATAL ERROR [page.jsx - getLandmarkDataForHotel]: Error processing landmark data:", error);
    return [];
  }
}

// MENGGUNAKAN generateStaticParams YANG MEMANGGIL API all-hotel-paths DARI HTTPS://HOTELOZA.COM
export async function generateStaticParams() {
  console.warn("SERVER DEBUG [generateStaticParams]: Attempting to fetch all hotel paths from https://hoteloza.com/api/all-hotel-paths.");
  
  try {
    const response = await fetch(`https://hoteloza.com/api/all-hotel-paths`, { 
      cache: 'no-store' // Penting: cache: 'no-store' agar selalu mengambil data terbaru saat build
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SERVER ERROR [generateStaticParams]: Failed to fetch all hotel paths. Status: ${response.status} - ${response.statusText}. Response: ${errorText}`);
      throw new Error(`Failed to fetch all hotel paths during build from https://hoteloza.com: ${response.statusText}`);
    }

    const paths = await response.json();
    
    if (!Array.isArray(paths) || paths.some(p => 
      !p.categoryslug || !p.countryslug || !p.stateslug || !p.cityslug || !p.hotelslug
    )) {
      console.error("SERVER ERROR [generateStaticParams]: Fetched hotel paths are not in the expected format:", paths);
      return []; 
    }

    console.log(`SERVER DEBUG [generateStaticParams]: Successfully fetched ${paths.length} hotel paths.`);
    return paths;

  } catch (error) {
    console.error('SERVER FATAL ERROR [generateStaticParams]: Error fetching static paths for hotels:', error);
    return []; 
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { categoryslug, countryslug, stateslug, cityslug, hotelslug } = resolvedParams;

  try {
    const data = await getHotelData(resolvedParams);
    if (!data || !data.hotel) {
      const formattedHotel = formatSlug(hotelslug) || 'Hotel';
      const formattedCity = formatSlug(cityslug) || 'City';
      return {
        title: `${formattedHotel}, ${formattedCity} - Hotel Not Found | Hoteloza`,
        description: `The hotel ${formattedHotel} in ${formattedCity} was not found on Hoteloza.`,
      };
    }

    const hotel = data.hotel;
    const formattedHotel = formatSlug(hotelslug) || hotel.title;
    const formattedCity = formatSlug(cityslug) || hotel.city;
    const currentYear = new Date().getFullYear();

    return {
      title: `${formattedHotel}, ${formattedCity} - ${currentYear} Luxury Awaits on Hoteloza!`,
      description: `Stay in style at ${formattedHotel}, ${formattedCity} with Hoteloza’s ${currentYear} exclusive offers. Book now for premium amenities and a stay you’ll never forget!`,
      alternates: {
        canonical: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
      },
      openGraph: {
        title: `${formattedHotel}, ${formattedCity} - Book Your ${currentYear} Stay | Hoteloza`,
        description: `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza. Enjoy a memorable stay with exclusive offers.`,
        url: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
        images: [hotel.img || hotel.slideimg || ''],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${formattedHotel}, ${formattedCity} - Book Your ${currentYear} Stay | Hoteloza`,
        description: `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza. Enjoy a memorable stay with exclusive offers.`,
        images: [hotel.img || hotel.slideimg || ''],
      },
    };
  } catch (error) {
    console.error('SERVER FATAL ERROR [page.jsx - generateMetadata]: Error in generateMetadata:', error);
    return {
      title: `Hotel Not Found | Hoteloza`,
      description: `The requested hotel could not be found due to an error.`,
    };
  }
}

export default async function HotelDetailPage({ params }) {
  const resolvedParams = await params;
  const data = await getHotelData(resolvedParams);

  if (!data || !data.hotel) {
    notFound();
  }

  const hotel = data.hotel;

  const landmarksForDisplay = await getLandmarkDataForHotel(
    hotel.latitude, 
    hotel.longitude,
    hotel.city_id 
  );

  const formattedHotel = formatSlug(resolvedParams.hotelslug) || hotel.title;
  const formattedCity = formatSlug(resolvedParams.cityslug) || hotel.city;
  const currentYear = new Date().getFullYear();

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': ['Hotel', 'LocalBusiness'],
      name: hotel.title,
      description: hotel.description || `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza.`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: hotel.city,
        addressRegion: hotel.state,
        addressCountry: hotel.country,
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
      url: `https://hoteloza.com/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}`,
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
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hoteloza.com' },
        {
          '@type': 'ListItem',
          position: 2,
          name: formatSlug(resolvedParams.categoryslug),
          item: `https://hoteloza.com/${resolvedParams.categoryslug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: formatSlug(resolvedParams.countryslug),
          item: `https://hoteloza.com/${resolvedParams.categoryslug}/${resolvedParams.countryslug}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: formatSlug(resolvedParams.stateslug),
          item: `https://hoteloza.com/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: formatSlug(resolvedParams.cityslug),
          item: `https://hoteloza.com/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}`,
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: hotel.title,
          item: `https://hoteloza.com/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}`,
        },
      ].concat(
        landmarksForDisplay.map((landmark, index) => ({
          '@type': 'ListItem',
          position: 7 + index,
          name: landmark.name,
          item: `https://hoteloza.com/landmark/${landmark.slug}`
        }))
      ),
    },
  ];

  return (
    <>
      <Script
        id="hotel-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <BookNow hotel={data.hotel} hotelId={data.hotel?.id} />
      <ClientPage
        hotel={data.hotel}
        relatedHotels={data.relatedHotels}
        landmarks={landmarksForDisplay}
        useHotels2={true}
        hotelslug={resolvedParams.hotelslug}
        categoryslug={resolvedParams.categoryslug}
        countryslug={resolvedParams.countryslug}
        stateslug={resolvedParams.stateslug}
        cityslug={resolvedParams.cityslug}
      />
    </>
  );
}