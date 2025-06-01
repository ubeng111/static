import dynamic from 'next/dynamic';
import Head from 'next/head';

const ClientPage = dynamic(() => import('./ClientPage'));

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

export async function generateMetadata({ params }) {
  const { categoryslug, countryslug, stateslug } = params;
  const formattedState = formatSlug(stateslug) || 'State';
  const formattedCountry = formatSlug(countryslug) || 'Country';
  const formattedCategory = formatSlug(categoryslug) || 'Category';
  const currentYear = new Date().getFullYear();

  return {
    title: `Steal These ${formattedCategory} Deals in ${formattedState}, ${formattedCountry} ${currentYear} - Hoteloza Exclusive`,
    description: `Grab the best ${formattedCategory.toLowerCase()} in ${formattedState}, ${formattedCountry} for ${currentYear} on Hoteloza. Act fast for exclusive offers and dream stays!`,
    openGraph: {
      title: `Best ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear} - Hoteloza`,
      description: `Explore the best ${formattedCategory.toLowerCase()} in ${formattedState}, ${formattedCountry} for ${currentYear} on Hoteloza. Book your perfect stay with top amenities and exclusive offers.`,
      url: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}`,
      type: 'website',
    },
  };
}

export default async function Page({ params, searchParams }) {
  const { categoryslug, countryslug, stateslug } = params;
  const page = parseInt(searchParams.page) || 1;
  const formattedState = formatSlug(stateslug) || 'State';
  const formattedCountry = formatSlug(countryslug) || 'Country';
  const formattedCategory = formatSlug(categoryslug) || 'Category';
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com';

  let hotels = [];
  let relatedstate = [];
  let pagination = { page: 1, totalPages: 1, totalHotels: 0 };
  try {
    const response = await fetch(`https://hoteloza.com/api/${categoryslug}/${countryslug}/${stateslug}?page=${page}`, {
      next: { revalidate: 3600 },
    });
    const data = response.ok ? await response.json() : {};
    console.log('State API Response:', data); // Debug
    hotels = Array.isArray(data?.hotels) ? data.hotels : [];
    relatedstate = Array.isArray(data?.relatedstate) ? data.relatedstate : [];
    pagination = {
      page: data?.pagination?.current || page,
      totalPages: data?.pagination?.pages || 1,
      totalHotels: data?.pagination?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching state data:', error);
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Best ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear}`,
    description: `Discover the best ${formattedCategory.toLowerCase()} in ${formattedState}, ${formattedCountry} for ${currentYear} on Hoteloza. Book your perfect stay with top amenities and exclusive offers.`,
    url: `${baseUrl}/${categoryslug}/${countryslug}/${stateslug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${categoryslug}` },
      { '@type': 'ListItem', position: 3, name: formattedCountry, item: `${baseUrl}/${categoryslug}/${countryslug}` },
      { '@type': 'ListItem', position: 4, name: formattedState, item: `${baseUrl}/${categoryslug}/${countryslug}/${stateslug}` },
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
        url: `${baseUrl}/${categoryslug}/${countryslug}/${stateslug}/${hotel.citySlug}/${hotel.slug}`,
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
        hotels={hotels}
        relatedstate={relatedstate}
        pagination={pagination}
      />
    </>
  );
}