import Head from 'next/head';
import dynamic from 'next/dynamic';

const ClientPage = dynamic(() => import('./ClientPage'));

// Mendefinisikan rute statis untuk SSG
export async function generateStaticParams() {
  // Ganti dengan daftar kategori dari API atau database
  const categories = ['luxury-hotels', 'budget-hotels', 'beach-resorts'];
  return categories.map((category) => ({
    categoryslug: category,
  }));
}

// Metadata untuk SEO
export async function generateMetadata({ params }) {
  const { categoryslug } = params;
  const formattedCategory = categoryslug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const currentYear = new Date().getFullYear();

  return {
    title: `Top ${formattedCategory} Deals in ${currentYear} | Hoteloza`,
    description: `Explore top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza with exclusive deals and premium amenities.`,
    openGraph: {
      title: `Top ${formattedCategory} Deals in ${currentYear} | Hoteloza`,
      description: `Explore top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza with exclusive deals and premium amenities.`,
      url: `https://hoteloza.com/${categoryslug}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }) {
  const { categoryslug } = params;
  const formattedCategory = categoryslug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const currentYear = new Date().getFullYear();

  // Schema JSON-LD untuk Rich Results
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: `Top ${formattedCategory} Hotels`,
    description: `Explore top ${formattedCategory.toLowerCase()} hotels for ${currentYear} on Hoteloza with exclusive deals and premium amenities.`,
    url: `https://hoteloza.com/${categoryslug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: formattedCategory,
      addressCountry: 'ID',
    },
    starRating: {
      '@type': 'Rating',
      ratingValue: '4',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '100',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://hoteloza.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: formattedCategory,
          item: `https://hoteloza.com/${categoryslug}`,
        },
      ],
    },
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      <ClientPage categoryslug={categoryslug} />
    </>
  );
}