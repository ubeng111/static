import Script from 'next/script';
import { notFound } from 'next/navigation';
import BookNow from '@/components/hotel-single/BookNow';
import ClientPage from './ClientPage';

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
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedParams.categoryslug}/${sanitizedParams.countryslug}/${sanitizedParams.stateslug}/${sanitizedParams.cityslug}/${sanitizedParams.hotelslug}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { categoryslug, countryslug, stateslug, cityslug, hotelslug } = resolvedParams;
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
    description: `Stay in style at ${formattedHotel}, ${formattedCity} with Hoteloza’s ${currentYear} exclusive offers.`,
    alternates: {
      canonical: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
    },
    openGraph: {
      title: `${formattedHotel}, ${formattedCity} - Book Your ${currentYear} Stay | Hoteloza`,
      description: `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza.`,
      url: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
      images: [hotel.img || hotel.slideimg || 'https://hoteloza.com/placeholder.jpg'],
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
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': ['Hotel', 'LocalBusiness'],
    name: hotel.title || formatSlug(resolvedParams.hotelslug),
    description: hotel.description || `Book ${hotel.title || formatSlug(resolvedParams.hotelslug)} in ${hotel.city || formatSlug(resolvedParams.cityslug)}.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: hotel.city || formatSlug(resolvedParams.cityslug),
      addressRegion: hotel.state || formatSlug(resolvedParams.stateslug),
      addressCountry: hotel.country || formatSlug(resolvedParams.countryslug),
    },
    geo: hotel.latitude && hotel.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: hotel.latitude,
      longitude: hotel.longitude,
    } : undefined,
    image: hotel.img || hotel.slideimg || 'https://hoteloza.com/placeholder.jpg',
    numberOfRooms: hotel.numberofrooms || undefined,
    telephone: hotel.telephone || undefined,
    email: hotel.email || undefined,
    priceRange: hotel.priceRange || '$$$',
    starRating: hotel.ratings ? {
      '@type': 'Rating',
      ratingValue: parseFloat(hotel.ratings).toFixed(1),
    } : undefined,
    aggregateRating: hotel.ratings && hotel.numberofreviews ? {
      '@type': 'AggregateRating',
      ratingValue: parseFloat(hotel.ratings).toFixed(1),
      reviewCount: parseInt(hotel.numberofreviews),
    } : undefined,
    breadcrumb: {
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
          name: hotel.title || formatSlug(resolvedParams.hotelslug),
          item: `https://hoteloza.com/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}`,
        },
      ],
    },
  };

  return (
    <>
      <Script id="hotel-schema" type="application/ld+json">
        {JSON.stringify(schemaData, null, 2)}
      </Script>
      <BookNow hotel={data.hotel} hotelId={data.hotel?.id} />
      <ClientPage
        hotel={data.hotel}
        relatedHotels={data.relatedHotels}
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