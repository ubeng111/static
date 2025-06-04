import { notFound } from 'next/navigation';
import BookNow from '@/components/hotel-single/BookNow';
import ClientPage from './ClientPage';
import Script from 'next/script';

// Format slug untuk tampilan
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Fetch hotel dari API
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
    console.error('Missing required parameters after sanitization:', sanitizedParams);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedParams.categoryslug}/${sanitizedParams.countryslug}/${sanitizedParams.stateslug}/${sanitizedParams.cityslug}/${sanitizedParams.hotelslug}`;
  console.log('Constructed API URL:', apiUrl);

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Cache dan regenerate tiap 1 jam
    });

    if (!response.ok) {
      console.error(`Failed to fetch hotel data. Status: ${response.status}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching hotel data:', error);
    return null;
  }
}

// ✅ Generate dynamic static params dari API
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/all-hotels`, {
      next: { revalidate: 86400 },
    });

    const hotels = await res.json();

    return hotels.map((hotel) => ({
      categoryslug: hotel.categoryslug,
      countryslug: hotel.countryslug,
      stateslug: hotel.stateslug,
      cityslug: hotel.cityslug,
      hotelslug: hotel.hotelslug,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

// ✅ Generate metadata dinamis
export async function generateMetadata({ params }) {
  const { categoryslug, countryslug, stateslug, cityslug, hotelslug } = params;
  const resolvedParams = { categoryslug, countryslug, stateslug, cityslug, hotelslug };

  try {
    const data = await getHotelData(resolvedParams);

    const formattedHotel = formatSlug(hotelslug) || 'Hotel';
    const formattedCity = formatSlug(cityslug) || 'City';
    const currentYear = new Date().getFullYear();

    if (!data || !data.hotel) {
      return {
        title: `${formattedHotel}, ${formattedCity} - Hotel Not Found | Hoteloza`,
        description: `The hotel ${formattedHotel} in ${formattedCity} was not found on Hoteloza.`,
      };
    }

    const hotel = data.hotel;

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

// ✅ Komponen utama halaman
export default async function HotelDetailPage({ params }) {
  const { categoryslug, countryslug, stateslug, cityslug, hotelslug } = params;
  const resolvedParams = { categoryslug, countryslug, stateslug, cityslug, hotelslug };

  const data = await getHotelData(resolvedParams);
  if (!data || !data.hotel) notFound();

  const hotel = data.hotel;
  const formattedHotel = formatSlug(hotelslug) || hotel.title;
  const formattedCity = formatSlug(cityslug) || hotel.city;
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
      url: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
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
          name: formatSlug(categoryslug),
          item: `https://hoteloza.com/${categoryslug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: formatSlug(countryslug),
          item: `https://hoteloza.com/${categoryslug}/${countryslug}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: formatSlug(stateslug),
          item: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: formatSlug(cityslug),
          item: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}`,
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: hotel.title,
          item: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
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
      <BookNow hotel={data.hotel} hotelId={data.hotel?.id} />
      <ClientPage
        hotel={data.hotel}
        relatedHotels={data.relatedHotels}
        useHotels2={true}
        hotelslug={hotelslug}
        categoryslug={categoryslug}
        countryslug={countryslug}
        stateslug={stateslug}
        cityslug={cityslug}
      />
    </>
  );
}
