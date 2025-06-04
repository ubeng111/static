import { notFound } from 'next/navigation';
import BookNow from '@/components/hotel-single/BookNow';
import ClientPage from './ClientPage';

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch hotel data
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
    description: `Stay in style at ${formattedHotel}, ${formattedCity} with Hoteloza’s ${currentYear} exclusive offers. Book now for premium amenities and a stay you’ll never forget!`,
    alternates: {
      canonical: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
    },
    openGraph: {
      title: `${formattedHotel}, ${formattedCity} - Book Your ${currentYear} Stay | Hoteloza`,
      description: `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza. Enjoy a memorable stay with exclusive offers.`,
      url: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
      images: [hotel.img || (hotel.slideImg && hotel.slideImg[0]) || ''],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedHotel}, ${formattedCity} - Book Your ${currentYear} Stay | Hoteloza`,
      description: `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza. Enjoy a memorable stay with exclusive offers.`,
      images: [hotel.img || (hotel.slideImg && hotel.slideImg[0]) || ''],
    },
  };
}

export default async function HotelDetailPage({ params }) {
  const resolvedParams = await params;
  const data = await getHotelData(resolvedParams);

  if (!data || !data.hotel) {
    notFound();
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: data.hotel.title,
    description:
      data.hotel.overview ||
      `Book ${data.hotel.title}, a luxury hotel in ${data.hotel.city} for 2025 on Hoteloza.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.hotel.location || 'Unknown Address',
      addressLocality: data.hotel.city || formatSlug(resolvedParams.cityslug),
      addressRegion: data.hotel.state || formatSlug(resolvedParams.stateslug),
      addressCountry: data.hotel.country || formatSlug(resolvedParams.countryslug),
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.hotel.latitude,
      longitude: data.hotel.longitude,
    },
    image: data.hotel.img || (data.hotel.slideImg && data.hotel.slideImg[0]) || '',
    numberOfRooms: data.hotel.numberrooms || null,
    priceRange: data.hotel.price
      ? `$${data.hotel.price} - $${data.hotel.price + 100}`
      : '$$$',
    starRating: {
      '@type': 'Rating',
      ratingValue: data.hotel.ratings ? parseFloat(data.hotel.ratings).toFixed(1) : null,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: data.hotel.ratings ? parseFloat(data.hotel.ratings).toFixed(1) : null,
      reviewCount: data.hotel.numberOfReviews ? parseInt(data.hotel.numberOfReviews) : 0,
    },
    telephone: data.hotel.telephone || 'Not Available',
    email: data.hotel.email || 'Not Available',
    url: `https://hoteloza.com/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}`,
    offers: data.hotel.price
      ? {
          '@type': 'Offer',
          price: data.hotel.price,
          priceCurrency: 'USD',
          availability: 'http://schema.org/InStock',
          url: `https://hoteloza.com/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}/book`,
        }
      : null,
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
          name: data.hotel.title,
          item: `https://hoteloza.com/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}`,
        },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <BookNow hotel={data.hotel} hotelId={data.hotel?.id} />
      <ClientPage
        hotel={data.hotel}
        relatedHotels={data.relatedHotels}
        hotelslug={resolvedParams.hotelslug}
        categoryslug={resolvedParams.categoryslug}
        countryslug={resolvedParams.countryslug}
        stateslug={resolvedParams.stateslug}
        cityslug={resolvedParams.cityslug}
      />
    </>
  );
}