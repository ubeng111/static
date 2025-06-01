import dynamic from 'next/dynamic';
import Head from 'next/head';

const ClientPage = dynamic(() => import('./ClientPage'));

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

export async function generateMetadata({ params }) {
  const { categoryslug, countryslug } = params;
  const formattedCountry = formatSlug(countryslug) || 'Country';
  const formattedCategory = formatSlug(categoryslug) || 'Category';
  const currentYear = new Date().getFullYear();

  return {
    title: `Cheap ${formattedCategory} in ${formattedCountry} ${currentYear} - Don’t Miss Out! | Hoteloza`,
    description: `Score the hottest ${formattedCategory.toLowerCase()} in ${formattedCountry} for ${currentYear} on Hoteloza. Limited deals await—book today for unbeatable prices!`,
    openGraph: {
      title: `Best ${formattedCategory} in ${formattedCountry} ${currentYear} | Hoteloza`,
      description: `Find the best ${formattedCategory.toLowerCase()} in ${formattedCountry} for ${currentYear} on Hoteloza. Book now for top hotels and exclusive deals!`,
      url: `https://hoteloza.com/${categoryslug}/${countryslug}`,
      type: 'website',
    },
  };
}

export default async function Page({ params, searchParams }) {
  const { categoryslug, countryslug } = params;
  const page = parseInt(searchParams.page) || 1;
  const formattedCountry = formatSlug(countryslug) || 'Country';
  const formattedCategory = formatSlug(categoryslug) || 'Category';
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com';

  let hotels = [];
  let relatedcountry = [];
  let pagination = { page: 1, totalPages: 1, totalHotels: 0 };
  try {
    const response = await fetch(`https://hoteloza.com/api/${categoryslug}/${countryslug}?page=${page}`, {
      next: { revalidate: 3600 },
    });
    const data = response.ok ? await response.json() : {};
    console.log('Country API Response:', data); // Debug
    hotels = Array.isArray(data?.hotels) ? data.hotels : [];
    relatedcountry = Array.isArray(data?.relatedcountry) ? data.relatedcountry : [];
    pagination = {
      page: data?.pagination?.current || page,
      totalPages: data?.pagination?.pages || 1,
      totalHotels: data?.pagination?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching country data:', error);
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Best ${formattedCategory} in ${formattedCountry} ${currentYear}`,
    description: `Find the best ${formattedCategory.toLowerCase()} in ${formattedCountry} for ${currentYear} on Hoteloza with top hotels and exclusive deals.`,
    url: `${baseUrl}/${categoryslug}/${countryslug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${categoryslug}` },
      { '@type': 'ListItem', position: 3, name: formattedCountry, item: `${baseUrl}/${categoryslug}/${countryslug}` },
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
        url: `${baseUrl}/${categoryslug}/${countryslug}/${hotel.stateSlug}/${hotel.citySlug}/${hotel.slug}`,
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
        hotels={hotels}
        relatedcountry={relatedcountry}
        pagination={pagination}
      />
    </>
  );
}