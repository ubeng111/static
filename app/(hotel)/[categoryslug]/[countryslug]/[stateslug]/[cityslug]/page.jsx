import dynamic from 'next/dynamic';

const ClientPage = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  const { categoryslug, countryslug, stateslug, cityslug } = params;
  const formattedCity = cityslug
    ? cityslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'City';
  const formattedState = stateslug
    ? stateslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'State';
  const formattedCountry = countryslug
    ? countryslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Country';
  const formattedCategory = categoryslug
    ? categoryslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Category';
  const currentYear = new Date().getFullYear(); // Dynamic year (2025)

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

export default function Page({ params }) {
  const { categoryslug, countryslug, stateslug, cityslug } = params;
  const formattedCity = cityslug
    ? cityslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'City';
  const formattedState = stateslug
    ? stateslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'State';
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
    name: `Top ${formattedCategory} in ${formattedCity}, ${formattedState} ${currentYear}`,
    description: `Book top ${formattedCategory.toLowerCase()} in ${formattedCity}, ${formattedState} for ${currentYear} on Hoteloza with exclusive deals and amenities.`,
    url: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}`,
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
        {
          '@type': 'ListItem',
          position: 4,
          name: formattedState,
          item: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: formattedCity,
          item: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}`,
        },
      ],
    },
  };

  return (
    <ClientPage
      categoryslug={categoryslug}
      countryslug={countryslug}
      stateslug={stateslug}
      cityslug={cityslug}
      schema={schema}
    />
  );
}