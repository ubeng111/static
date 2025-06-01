import dynamic from 'next/dynamic';

const ClientPage = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  const { categoryslug } = params;
  const formattedCategory = categoryslug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const currentYear = new Date().getFullYear(); // Dynamic year (2025)

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

export default async function Page({ params }) {
  const { categoryslug } = params;
  const formattedCategory = categoryslug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const currentYear = new Date().getFullYear(); // Dynamic year (2025)

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

  return <ClientPage categoryslug={categoryslug} schema={schema} />;
}