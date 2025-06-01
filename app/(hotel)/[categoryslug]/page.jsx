import dynamic from 'next/dynamic';
import Head from 'next/head';

const ClientPage = dynamic(() => import('./ClientPage'));

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

export async function generateMetadata({ params }) {
  const { categoryslug } = params;
  const formattedCategory = formatSlug(categoryslug) || 'Category';
  const currentYear = new Date().getFullYear();

  return {
    title: `Unbelievable ${formattedCategory} Deals for ${currentYear} - Save Big on Hoteloza!`,
    description: `Snag jaw-dropping ${formattedCategory.toLowerCase()} deals for ${currentYear} on Hoteloza! Book now for exclusive discounts and luxury amenities you’ll love.`,
    openGraph: {
      title: `Top ${formattedCategory} Deals in ${currentYear} | Hoteloza`,
      description: `Explore top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza. Book now for exclusive deals and premium amenities!`,
      url: `https://hoteloza.com/${categoryslug}`,
      type: 'website',
    },
  };
}

export default async function Page({ params, searchParams }) {
  const { categoryslug } = params;
  const page = parseInt(searchParams.page) || 1;
  const formattedCategory = formatSlug(categoryslug) || 'Category';
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://hoteloza.com';

  // Fetch data
  let hotels = [];
  let relatedcategory = [];
  let pagination = { page: 1, totalPages: 1, totalHotels: 0 };
  try {
    const response = await fetch(`https://hoteloza.com/api/${categoryslug}?page=${page}`, {
      next: { revalidate: 3600 },
    });
    const data = response.ok ? await response.json() : {};
    console.log('Category API Response:', data); // Debug
    hotels = Array.isArray(data?.hotels) ? data.hotels : [];
    relatedcategory = Array.isArray(data?.relatedcategory) ? data.relatedcategory : [];
    pagination = {
      page: data?.pagination?.current || page,
      totalPages: data?.pagination?.pages || 1,
      totalHotels: data?.pagination?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
  }

  // Schemas
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Top ${formattedCategory} Deals in ${currentYear}`,
    description: `Explore top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza with exclusive deals and premium amenities.`,
    url: `${baseUrl}/${categoryslug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${categoryslug}` },
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
        url: `${baseUrl}/${categoryslug}/${hotel.countrySlug}/${hotel.stateSlug}/${hotel.citySlug}/${hotel.slug}`,
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
        hotels={hotels}
        relatedcategory={relatedcategory}
        pagination={pagination}
      />
    </>
  );
}