import { notFound } from 'next/navigation';
import BookNow from '@/components/hotel-single/BookNow';
import ClientPage from './ClientPage';

// Helper function to format slugs for display purposes
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

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
  console.log('Constructed API URL:', apiUrl); // Debug log

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
  console.log('Metadata params:', params); // Debug log
  const resolvedParams = await params; // Await the params Promise
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
        images: [hotel.img || hotel.slideImg?.[0] || ''],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${formattedHotel}, ${formattedCity} - Book Your ${currentYear} Stay | Hoteloza`,
        description: `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza. Enjoy a memorable stay with exclusive offers.`,
        images: [hotel.img || hotel.slideImg?.[0] || ''],
      },
      'schema:Hotel': JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
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
              latitude: hotel.latitude,
              longitude: hotel.longitude,
            },
            image: hotel.img || hotel.slideImg?.[0],
            numberOfRooms: hotel.numberofrooms || undefined,
            telephone: hotel.telephone || undefined,
            email: hotel.email || undefined,
            aggregateRating: hotel.ratings && hotel.numberofreviews > 0
              ? {
                  '@type': 'AggregateRating',
                  ratingValue: parseFloat(hotel.ratings).toFixed(1),
                  reviewCount: parseInt(hotel.numberofreviews),
                  bestRating: 10,
                  worstRating: 1,
                }
              : undefined,
          },
          {
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
        ],
      }),
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
  const resolvedParams = await params; // Await the params Promise
  console.log('Received params in HotelDetailPage:', resolvedParams); // Debug log
  const data = await getHotelData(resolvedParams);

  if (!data || !data.hotel) {
    notFound();
  }

  console.log('Hotel data:', data.hotel); // Debug log
  console.log('Related hotels:', data.relatedHotels); // Debug log

  return (
    <>
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