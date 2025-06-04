// app/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/[hotelslug]/page.jsx
import { notFound } from 'next/navigation';
import BookNow from '@/components/hotel-single/BookNow';
import ClientPage from './ClientPage';
import Script from 'next/script';

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

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
    console.error('Missing required parameters:', sanitizedParams);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedParams.categoryslug}/${sanitizedParams.countryslug}/${sanitizedParams.stateslug}/${sanitizedParams.cityslug}/${sanitizedParams.hotelslug}`;

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // ISR: Revalidate every hour
      cache: 'force-cache', // Cache response
    });
    if (!response.ok) {
      console.error(`Failed to fetch hotel data: ${response.status} - ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    // Ensure hotel object exists
    if (!data?.hotel) {
      console.error('No hotel data found in response');
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error fetching hotel data:', error.message);
    // Fallback data to prevent null hotel
    return {
      hotel: {
        title: formatSlug(sanitizedParams.hotelslug) || 'Hotel',
        city: formatSlug(sanitizedParams.cityslug) || 'City',
        location: formatSlug(sanitizedParams.cityslug) || 'City',
        img: '/fallback-image.jpg', // Use a local fallback image
        overview: 'This is a fallback description for the hotel.',
      },
      relatedHotels: [],
    };
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
  const { categoryslug, countryslug, stateslug, cityslug, hotelslug } = resolvedParams;
  const data = await getHotelData(resolvedParams);

  const hotel = data?.hotel || {
    title: formatSlug(hotelslug) || 'Hotel',
    city: formatSlug(cityslug) || 'City',
    img: '/fallback-image.jpg',
  };
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
      images: [hotel.img || '/fallback-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedHotel}, ${formattedCity} - Book Your ${currentYear} Stay | Hoteloza`,
      description: `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza. Enjoy a memorable stay with exclusive offers.`,
      images: [hotel.img || '/fallback-image.jpg'],
    },
    other: {
      'link-preload': hotel.img
        ? JSON.stringify({
            rel: 'preload',
            href: hotel.img,
            as: 'image',
            fetchPriority: 'high',
          })
        : undefined,
    },
  };
}

export default async function HotelDetailPage({ params }) {
  const resolvedParams = await params;
  const data = await getHotelData(resolvedParams);

  if (!data || !data.hotel) {
    notFound();
  }

  const hotel = data.hotel;
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': ['Hotel', 'LocalBusiness'],
      name: hotel.title,
      description: hotel.description || `Book ${formatSlug(resolvedParams.hotelslug) || hotel.title}, a luxury hotel in ${formatSlug(resolvedParams.cityslug) || hotel.city} for ${new Date().getFullYear()} on Hoteloza.`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: hotel.city,
        addressRegion: hotel.state || '',
        addressCountry: hotel.country || '',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: parseFloat(hotel.latitude) || 0,
        longitude: parseFloat(hotel.longitude) || 0,
      },
      image: hotel.img || '/fallback-image.jpg',
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
        relatedHotels={data.relatedHotels || []}
        hotelslug={resolvedParams.hotelslug}
        categoryslug={resolvedParams.categoryslug}
        countryslug={resolvedParams.countryslug}
        stateslug={resolvedParams.stateslug}
        cityslug={resolvedParams.cityslug}
      />
    </>
  );
}

export const revalidate = 3600;