import dynamic from 'next/dynamic';
import Head from 'next/head';

const ClientPage = dynamic(() => import('./ClientPage'));

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

export async function generateMetadata({ params }) {
  const { categoryslug, countryslug, stateslug, cityslug, hotelslug } = params;
  const formattedHotel = formatSlug(hotelslug) || 'Hotel';
  const formattedCity = formatSlug(cityslug) || 'City';
  const currentYear = new Date().getFullYear();

  return {
    title: `${formattedHotel}, ${formattedCity} - ${currentYear} Luxury Awaits on Hoteloza!`,
    description: `Stay in style at ${formattedHotel}, ${formattedCity} with Hoteloza’s ${currentYear} exclusive offers. Book now for premium amenities and a stay you’ll never forget!`,
    openGraph: {
      title: `${formattedHotel}, ${formattedCity} - Book Your ${currentYear} Stay | Hoteloza`,
      description: `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza. Enjoy a memorable stay with exclusive offers.`,
      url: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
      type: 'website',
    },
    alternates: {
      canonical: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
    },
  };
}

export default async function Page({ params }) {
  const { categoryslug, countryslug, stateslug, cityslug, hotelslug } = params;
  const formattedHotel = formatSlug(hotelslug) || 'Hotel';
  const formattedCity = formatSlug(cityslug) || 'City';
  const formattedState = formatSlug(stateslug) || 'State';
  const formattedCountry = formatSlug(countryslug) || 'Country';
  const formattedCategory = formatSlug(categoryslug) || 'Category';
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com';

  // Fetch hotel data server-side
  let hotelData = {};
  try {
    const response = await fetch(
      `https://hoteloza.com/api/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    hotelData = response.ok ? await response.json() : {};
  } catch (error) {
    console.error('Error fetching hotel data:', error);
  }

  const hotel = hotelData?.hotel || {};
  const relatedHotels = hotelData?.relatedHotels || [];

  // Parse location field (e.g., "317 Outram Rd, Singapore")
  const location = hotel.location || `${formattedCity}, ${formattedCountry}`;
  const streetAddress = location.split(',').map((part) => part.trim())[0] || location;
  const addressLocality = formattedCity; // Fallback to cityslug
  const addressRegion = formattedState; // Fallback to stateslug
  const addressCountry = formattedCountry; // Fallback to countryslug

  // Hotel schema
  const hotelSchema = {
    '@context': 'https://schema.org',
    '@type': ['Hotel', 'LocalBusiness'],
    name: hotel.title || formattedHotel,
    description: `Book ${hotel.title || formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza.`,
    url: `${baseUrl}/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: streetAddress,
      addressLocality: addressLocality,
      addressRegion: addressRegion,
      addressCountry: addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: hotel.latitude || 0,
      longitude: hotel.longitude || 0,
    },
    image: hotel.img || 'https://hoteloza.com/default-hotel-image.jpg',
    numberOfRooms: hotel.numberrooms || 0,
    telephone: hotel.telephone || '',
    email: hotel.email || '',
    aggregateRating: hotel.ratings
      ? {
          '@type': 'AggregateRating',
          ratingValue: Math.min(Math.max(hotel.ratings, 1), 5), // Convert 8.3 to 1-5 scale if needed
          reviewCount: hotel.numberOfReviews || 1,
        }
      : undefined,
    priceRange: hotel.priceRange || '$$$',
    checkinTime: hotel.checkinTime || '15:00',
    checkoutTime: hotel.checkoutTime || '11:00',
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: formattedCategory,
        item: `${baseUrl}/${categoryslug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: formattedCountry,
        item: `${baseUrl}/${categoryslug}/${countryslug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: formattedState,
        item: `${baseUrl}/${categoryslug}/${countryslug}/${stateslug}`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: formattedCity,
        item: `${baseUrl}/${categoryslug}/${countryslug}/${stateslug}/${cityslug}`,
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: hotel.title || formattedHotel,
        item: `${baseUrl}/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
      },
    ],
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>
      <ClientPage
        categoryslug={categoryslug}
        countryslug={countryslug}
        stateslug={stateslug}
        cityslug={cityslug}
        hotelslug={hotelslug}
        hotel={hotel}
        relatedHotels={relatedHotels}
      />
    </>
  );
}