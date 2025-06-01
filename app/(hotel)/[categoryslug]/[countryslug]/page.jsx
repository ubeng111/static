import dynamic from 'next/dynamic';

const ClientPage = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  const { categoryslug, countryslug } = params;
  const formattedCountry = countryslug
    ? countryslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Country';
  const formattedCategory = categoryslug
    ? categoryslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Category';
  const currentYear = new Date().getFullYear(); // Dynamic year (2025)

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

export default function Page({ params }) {
  const { categoryslug, countryslug } = params;
  const formattedCountry = countryslug
    ? countryslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Country';
  const formattedCategory = categoryslug
    ? categoryslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Category';
  const currentYear = new Date().getFullYear(); // Dynamic year (2025)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Best ${formattedCategory} in ${formattedCountry} ${currentYear}`,
    description: `Find the best ${formattedCategory.toLowerCase()} in ${formattedCountry} for ${currentYear} on Hoteloza with top hotels and exclusive deals.`,
    url: `https://hoteloza.com/${categoryslug}/${countryslug}`,
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
        {
          '@type': 'ListItem',
          position: 3,
          name: formattedCountry,
          item: `https://hoteloza.com/${categoryslug}/${countryslug}`,
        },
      ],
    },
  };

  return <ClientPage categoryslug={categoryslug} countryslug={countryslug} schema={schema} />;
}