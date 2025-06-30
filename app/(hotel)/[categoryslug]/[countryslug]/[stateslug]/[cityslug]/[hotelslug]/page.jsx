// page.jsx
import { notFound } from 'next/navigation';
import BookNow from '@/components/hotel-single/BookNow';
import ClientPage from './ClientPage';
import Script from 'next/script';

// Helper function to format slugs for display purposes
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// *** FUNGSI calculateDistance DIMASUKKAN DI SINI ***
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

  // Use environment variable for base URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedParams.categoryslug}/${sanitizedParams.countryslug}/${sanitizedParams.stateslug}/${sanitizedParams.cityslug}/${sanitizedParams.hotelslug}`;
  console.log('Constructed API URL:', apiUrl);

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(
        `Failed to fetch hotel data for ${sanitizedParams.hotelslug}. Status: ${response.status} - ${response.statusText}`
      );
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching hotel data in getHotelData:', error);
    return null;
  }
}

// *** FUNGSI BARU UNTUK MENGAMBIL DATA LANDMARK DI SISI SERVER ***
async function getLandmarkData(latitude, longitude) {
  if (!latitude || !longitude) {
    return [];
  }

  const OVERPASS_RADIUS_KM = 5;
  const RESULTS_LIMIT = 15;
  const radiusInMeters = OVERPASS_RADIUS_KM * 1000;

  try {
    const proxyUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/overpass`;

    const overpassQuery = `
      [out:json];
      (
        node(around:${radiusInMeters},${latitude},${longitude})[amenity=hospital][!"place"];
        way(around:${radiusInMeters},${latitude},${longitude})[amenity=hospital][!"place"];
        node(around:${radiusInMeters},${latitude},${longitude})[aeroway=aerodrome][!"place"];
        way(around:${radiusInMeters},${latitude},${longitude})[aeroway=aerodrome][!"place"];
        node(around:${radiusInMeters},${latitude},${longitude})[railway=station][!"place"];
        way(around:${radiusInMeters},${latitude},${longitude})[railway=station][!"place"];
        node(around:${radiusInMeters},${latitude},${longitude})[tourism~"^(attraction|museum|theme_park|zoo|monument|artwork|memorial|viewpoint|castle|ruins)$"][!"place"];
        way(around:${radiusInMeters},${latitude},${longitude})[tourism~"^(attraction|museum|theme_park|zoo|monument|artwork|memorial|viewpoint|castle|ruins)$"][!"place"];
        rel(around:${radiusInMeters},${latitude},${longitude})[tourism~"^(attraction|museum|theme_park|zoo|monument|artwork|memorial|viewpoint|castle|ruins)$"][!"place"];
        node(around:${radiusInMeters},${latitude},${longitude})[amenity=university][!"place"];
        way(around:${radiusInMeters},${latitude},${longitude})[amenity=university][!"place"];
        node(around:${radiusInMeters},${latitude},${longitude})[amenity=bus_station][!"place"];
        way(around:${radiusInMeters},${latitude},${longitude})[amenity=bus_station][!"place"];
        node(around:${radiusInMeters},${latitude},${longitude})[shop=mall][!"place"];
        way(around:${radiusInMeters},${latitude},${longitude})[shop=mall][!"place"];
      );
      out center;
    `;

    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ overpassQuery }),
      cache: 'no-store' // Penting: pastikan ini tidak di-cache statis jika data sering berubah
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Error fetching Overpass data:", errorBody.details || `HTTP error! status: ${response.status}`);
      return [];
    }
    const data = await response.json();

    if (!data.elements) {
      return [];
    }

    const relevantLandmarks = data.elements
      .filter(el => el.tags && el.tags.name)
      .filter(el => !el.tags.place)
      .filter(el => el.tags.name.trim().includes(' ') && el.tags.name.trim().split(' ').length > 1) // Filter nama lebih dari satu kata
      .filter(el => !(el.tags.amenity === 'hospital' && (el.tags.healthcare === 'clinic' || el.tags.healthcare === 'community_healthcare'))); // Filter klinik/puskesmas jika amenity=hospital

    const landmarkNames = relevantLandmarks.map(el => el.tags.name);
    let slugMap = new Map();

    if (landmarkNames.length > 0) {
      const slugResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/resolve-landmark-slug`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: landmarkNames }),
        cache: 'no-store'
      });

      if (slugResponse.ok) {
        const slugData = await slugResponse.json();
        if (slugData.slugs) {
          slugData.slugs.forEach(item => {
            if (item.slug) {
              slugMap.set(item.name, item.slug);
            }
          });
        }
      } else {
        console.warn(`Could not fetch slugs from API, status: ${slugResponse.status}`);
      }
    }

    const processedLandmarks = relevantLandmarks.map(el => {
      const lat = el.lat || (el.center ? el.center.lat : null);
      const lon = el.lon || (el.center ? el.center.lon : null);

      if (lat === null || lon === null) {
        return null;
      }

      const slug = slugMap.get(el.tags.name);

      if (!slug) {
        return null; // Hanya sertakan landmark yang memiliki slug
      }

      return {
        name: el.tags.name,
        distance: calculateDistance(
          latitude,
          longitude,
          parseFloat(lat),
          parseFloat(lon)
        ),
        type: el.type,
        slug: slug,
      };
    });

    const filteredList = processedLandmarks
      .filter(landmark => landmark !== null)
      .filter(landmark => landmark.distance <= OVERPASS_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, RESULTS_LIMIT);

    return filteredList;

  } catch (error) {
    console.error("Error fetching landmarks in getLandmarkData (server-side):", error);
    return [];
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
  const resolvedParams = await params;
  console.log('Metadata params:', resolvedParams);
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
    console.error('Error in generateMetadata:', error);
    return {
      title: `Hotel Not Found | Hoteloza`,
      description: `The requested hotel could not be found due to an error.`,
    };
  }
}

export default async function HotelDetailPage({ params }) {
  const resolvedParams = await params;
  console.log('Received params in HotelDetailPage:', resolvedParams);
  const data = await getHotelData(resolvedParams);

  if (!data || !data.hotel) {
    notFound();
  }

  const hotel = data.hotel;

  // *** Panggil fungsi pengambilan data landmark di sisi server ***
  // Pastikan hotel.latitude dan hotel.longitude tersedia
  const landmarks = await getLandmarkData(hotel.latitude, hotel.longitude);

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
          bestRating: 10, // Explicitly set to match 1–10 scale
          worstRating: 1, // Explicitly set to match 1–10 scale
          reviewCount: parseInt(hotel.numberofreviews) || 0,
        },
      }),
      ...(hotel.starRating && {
        starRating: {
          '@type': 'Rating',
          ratingValue: parseFloat(hotel.starRating),
          bestRating: 5, // Star ratings are typically 1–5
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
        // Hanya tambahkan landmark ke BreadcrumbList jika ada dan relevan
        landmarks.map((landmark, index) => ({
          '@type': 'ListItem',
          position: 7 + index, // Sesuaikan posisi
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
        landmarks={landmarks} // *** Teruskan data landmark ke ClientPage ***
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