// app/[lang]/page.jsx (Server Component for Home page)
import { getdictionary } from '@/dictionaries/get-dictionary';
import Home1 from '@/components/home_1/Home1';
import { defaultLocale, i18nConfig, defaultDictionaryCode } from '@/config/i18n';

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const lang = awaitedParams.lang || defaultLocale; 
  
  const currentLangConfig = i18nConfig.find(config => config.code === lang);
  const dictionaryCodeToUse = currentLangConfig ? currentLangConfig.dictionaryCode : defaultDictionaryCode;
  
  const dictionary = await getdictionary(dictionaryCodeToUse);

  const baseUrl = 'https://hoteloza.com';
  const contentPathForUrl = ''; // Untuk home page

  const specificLangUrl = `${baseUrl}/${lang}${contentPathForUrl ? `/${contentPathForUrl}` : ''}`;

  return {
    title: dictionary.metadata.homePageTitle,
    description: dictionary.metadata.homePageDescription,
    keywords: [
      "hotel deals",
      "travel affiliate",
      "cheap hotels",
      "best hotel booking site",
      "Hoteloza",
      "compare hotel prices",
      "book hotels online",
    ],
    openGraph: {
      title: dictionary.metadata.homePageTitle,
      description: dictionary.metadata.homePageDescription,
      url: specificLangUrl,
      siteName: "Hoteloza",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Hoteloza Hotel Booking Deals",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.metadata.homePageTitle,
      description: dictionary.metadata.homePageDescription,
      images: [`${baseUrl}/og-image.jpg`],
    },
  };
}

export default async function HomePage({ params }) {
  const lang = await params.lang || defaultLocale;

  const currentLangConfig = i18nConfig.find(config => config.code === lang);
  const dictionaryCodeToUse = currentLangConfig ? currentLangConfig.dictionaryCode : defaultDictionaryCode;
  
  const dictionary = await getdictionary(dictionaryCodeToUse);

  return (
    <>
      <Home1 dictionary={dictionary} currentLang={lang} />
    </>
  );
}