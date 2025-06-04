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

    const ratingValue = hotel.ratings ? parseFloat(hotel.ratings) : undefined;
    const normalizedRating = ratingValue
      ? ratingValue > 5
        ? (ratingValue / 2).toFixed(1)
        : ratingValue.toFixed(1)
      : undefined;

    const hotelSchema = {
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
        latitude: hotel.latitude && !isNaN(hotel.latitude) ? hotel.latitude : undefined,
        longitude: hotel.longitude && !isNaN(hotel.longitude) ? hotel.longitude : undefined,
      },
      image: hotel.img || hotel.slideimg || '',
      numberOfRooms: hotel.numberofrooms,
      telephone: hotel.telephone,
      email: hotel.email,
      aggregateRating: normalizedRating
        ? {
            '@type': 'AggregateRating',
            ratingValue: normalizedRating,
            reviewCount: hotel.numberofreviews ? parseInt(hotel.numberofreviews) : 0,
            bestRating: ratingValue > 5 ? 10 : 5,
            worstRating: 0,
          }
        : undefined,
    };

    const breadcrumbSchema = {
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
    };

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
      other: {
        'script:ld+json:hotel': JSON.stringify(hotelSchema),
        'script:ld+json:breadcrumb': JSON.stringify(breadcrumbSchema),
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