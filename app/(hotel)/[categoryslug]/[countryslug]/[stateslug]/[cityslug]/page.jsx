import dynamic from 'next/dynamic';
import Head from 'next/head';

const ClientPage = dynamic(() => import('./ClientPage'));

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

export async function generateMetadata({ params }) {
  const { categoryslug, countryslug, stateslug, cityslug } = params;
  const formattedCity = formatSlug(cityslug) || 'City';
  const formattedState = formatSlug(stateslug) || 'State';
  const formattedCountry = formatSlug(countryslug) || 'Country';
  const formattedCategory = formatSlug(categoryslug) || 'Category';
  const currentYear = new Date().getFullYear();

  return {
    title: `${currentYear}’s Hottest ${formattedCategory} in ${formattedCity}, ${formattedCountry} - Book Now!`,
    description: `Discover ${formattedCity}, ${formattedState}’s top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza. Secure your spot with exclusive deals—don’t wait!`,
    openGraph: {
      title: `Top ${formattedCategory} in ${formattedCity}, ${formattedState} ${currentYear} | Hoteloza`,
      description: `Book top ${formattedCategory.toLowerCase()} in ${formattedCity}, ${formattedState} for ${currentYear} on Hoteloza. Enjoy exclusive deals now!`,
      url: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}`,
      type: 'website',
    },
  };
}

export default async function Page({ params, searchParams }) {
  const { categoryslug, countryslug, stateslug, cityslug } = params;
  const page = parseInt(searchParams.page) || 1;
  const formattedCity = formatSlug(cityslug) || 'City';
  const formattedState = formatSlug(stateslug) || 'State';
  const formattedCountry = formatSlug(countryslug) || 'Country';
  const formattedCategory = formatSlug(categoryslug) || 'Category';
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com';

  let hotels = [];
  let relatedcity = [];
  let pagination = { page: 1, totalPages: 1, totalHotels: 0 };
  try {
    const response = await fetch(`https://hoteloza.com/api/${categoryslug}/${countryslug}/${stateslug}/${cityslug}?page=${page}`, {
      next: { revalidate: 3600 },
    });
    const data = response.ok ? await response.json() : {};
    console.log('City API Response:', data); // Debug
    hotels = Array.isArray(data?.hotels) ? data.hotels : [];
    relatedcity = Array.isArray(data?.relatedcity) ? data.relatedcity : [];
    pagination = {
      page: data?.pagination?.current || page,
      totalPages: data?.pagination?.pages || 1,
      totalHotels: data?.pagination?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching city data:', error);
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Top ${formattedCategory} in ${formattedCity}, ${formattedState} ${currentYear}`,
    description: `Book top ${formattedCategory.toLowerCase()} in ${formattedCity}, ${formattedState} for ${currentYear} on Hoteloza with exclusive deals and amenities.`,
    url: `${baseUrl}/${categoryslug}/${countryslug}/${stateslug}/${cityslug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${categoryslug}` },
      { '@type': 'ListItem', position: 3, name: formattedCountry, item: `${baseUrl}/${categoryslug}/${countryslug}` },
      { '@type': 'ListItem', position: 4, name: formattedState, item: `${baseUrl}/${categoryslug}/${countryslug}/${stateslug}` },
      { '@type': 'ListItem', position: 5, name: formattedCity, item: `${baseUrl}/${categoryslug}/${countryslug}/${stateslug}/${cityslug}` },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: hotels.map((hotel, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Hotel',
        name: hotel.title || formattedCategory,
        url: `${baseUrl}/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotel.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: hotel.city,
          addressRegion: hotel.state,
          addressCountry: hotel.country,
        },
        image: hotel.img || 'https://hoteloza.com/default-hotel-image.jpg',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: hotel.ratings || 0,
          reviewCount: hotel.numberOfReviews || 0,
        },
      },
    })),
  };

  return (
    <>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {hotels.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        )}
      </Head>
      <ClientPage
        categoryslug={categoryslug}
        countryslug={countryslug}
        stateslug={stateslug}
        cityslug={cityslug}
        hotels={hotels}
        relatedcity={relatedcity}
        pagination={pagination}
      />
    </>
  );
}