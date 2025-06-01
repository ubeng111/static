import dynamic from 'next/dynamic';

const ClientPage = dynamic(() => import('./ClientPage'));

// Helper function to format slugs into readable text
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { categoryslug, countryslug, stateslug } = params;
  const formattedState = formatSlug(stateslug) || 'State';
  const formattedCountry = formatSlug(countryslug) || 'Country';
  const formattedCategory = formatSlug(categoryslug) || 'Category';
  const currentYear = new Date().getFullYear(); // Dynamic year (2025)

  return {
    title: `Steal These ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear} - Hoteloza Exclusive`,
    description: `Grab the best ${formattedCategory.toLowerCase()} in ${formattedState}, ${formattedCountry} for ${currentYear} on Hoteloza. Act fast for exclusive offers and dream stays!`,
    openGraph: {
      title: `Best ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear} - Hoteloza`,
      description: `Discover the best ${formattedCategory.toLowerCase()} in ${formattedState}, ${formattedCountry} for ${currentYear} on Hoteloza. Book your perfect stay with top amenities and exclusive offers.`,
      url: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}`,
      type: 'website',
    },
  };
}

export default function Page({ params }) {
  const { categoryslug, countryslug, stateslug } = params;
  const formattedState = formatSlug(stateslug) || 'State';
  const formattedCountry = formatSlug(countryslug) || 'Country';
  const formattedCategory = formatSlug(categoryslug) || 'Category';
  const currentYear = new Date().getFullYear(); // Dynamic year (2025)

  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${categoryslug}/${countryslug}/${stateslug}`;

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: currentUrl,
        name: `Best ${formattedCategory} in ${formattedState}, ${formattedCountry} ${currentYear}`,
        description: `Discover the best ${formattedCategory.toLowerCase()} in ${formattedState}, ${formattedCountry} for ${currentYear} on Hoteloza. Book your perfect stay with top amenities and exclusive offers.`,
        publisher: {
          '@type': 'Organization',
          name: 'Hoteloza',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: formattedCategory,
            item: `${baseUrl}/${categoryslug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: formattedCountry,
            item: `${baseUrl}/${categoryslug}/${countryslug}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: formattedState,
            item: currentUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      <ClientPage categoryslug={categoryslug} countryslug={countryslug} stateslug={stateslug} />
    </>
  );
}