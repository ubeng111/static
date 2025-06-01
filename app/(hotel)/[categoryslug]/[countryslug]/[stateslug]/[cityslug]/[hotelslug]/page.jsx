import dynamic from 'next/dynamic';

// Dynamically import ClientPage to reduce bundle size
const ClientPage = dynamic(() => import('./ClientPage'));

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

export async function generateMetadata({ params }) {
  const { categoryslug, countryslug, stateslug, cityslug, hotelslug } = params;

  // Fetch hotel data for metadata
  try {
    const response = await fetch(
      `https://hoteloza.com/api/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`
    );
    const hotelData = response.ok ? await response.json() : {};

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
        images: [
          {
            url: hotelData?.hotel?.img || 'https://hoteloza.com/default-hotel-image.jpg',
            width: 800,
            height: 600,
            alt: `${formattedHotel} Image`,
          },
        ],
      },
      alternates: {
        canonical: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
      },
      other: {
        'schema:Hotel': JSON.stringify({
          '@context': 'https://schema.org',
          '@type': ['Hotel', 'LocalBusiness'],
          name: hotelData?.hotel?.title || formattedHotel,
          description: `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza.`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: hotelData?.hotel?.city || formattedCity,
            addressRegion: hotelData?.hotel?.state,
            addressCountry: hotelData?.hotel?.country,
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: hotelData?.hotel?.latitude,
            longitude: hotelData?.hotel?.longitude,
          },
          image: hotelData?.hotel?.img || 'https://hoteloza.com/default-hotel-image.jpg',
          numberOfRooms: hotelData?.hotel?.numberrooms,
          telephone: hotelData?.hotel?.telephone || '',
          email: hotelData?.hotel?.email || '',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: hotelData?.hotel?.ratings || 0,
            reviewCount: hotelData?.hotel?.numberOfReviews || 0,
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hoteloza.com' },
              {
                '@type': 'ListItem',
                position: 2,
                name: hotelData?.hotel?.category || 'Hotels',
                item: `https://hoteloza.com/${categoryslug}`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: hotelData?.hotel?.country,
                item: `https://hoteloza.com/${categoryslug}/${countryslug}`,
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: hotelData?.hotel?.state,
                item: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}`,
              },
              {
                '@type': 'ListItem',
                position: 5,
                name: hotelData?.hotel?.city,
                item: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}`,
              },
              {
                '@type': 'ListItem',
                position: 6,
                name: hotelData?.hotel?.title || formattedHotel,
                item: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
              },
            ],
          },
        }),
      },
    };
  } catch (error) {
    console.error('Error fetching hotel data for metadata:', error);
    return {};
  }
}

export default function Page({ params }) {
  return (
    <ClientPage
      categoryslug={params.categoryslug}
      countryslug={params.countryslug}
      stateslug={params.stateslug}
      cityslug={params.cityslug}
      hotelslug={params.hotelslug}
    />
  );
}