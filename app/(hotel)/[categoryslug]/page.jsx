import Head from 'next/head';
import dynamic from 'next/dynamic';

const ClientPage = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  // ... kode metadata sama seperti sebelumnya ...
}

export default async function Page({ params }) {
  const { categoryslug } = params;
  const formattedCategory = categoryslug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const currentYear = new Date().getFullYear();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Top ${formattedCategory} Deals in ${currentYear}`,
    description: `Explore top ${formattedCategory.toLowerCase()} for ${currentYear} on Hoteloza with exclusive deals and premium amenities.`,
    url: `https://hoteloza.com/${categoryslug}`,
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <ClientPage categoryslug={categoryslug} schema={schema} />
    </>
  );
}