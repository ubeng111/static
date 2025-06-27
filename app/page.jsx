// File: app/page.jsx
// Halaman ini akan menangani https://hoteloza.com/ dan menyajikan konten en-US

import { getdictionary } from '@/dictionaries/get-dictionary';
import Home1 from '@/components/home_1/Home1';
// Impor konfigurasi dimana 'en-US' adalah default
import { defaultLocale, i18nConfig, defaultDictionaryCode } from '@/config/i18n';

export async function generateMetadata() {
  // Karena ini root page, kita gunakan kamus bahasa default (en.json)
  const dictionary = await getdictionary(defaultDictionaryCode);

  const baseUrl = 'https://hoteloza.com';

  // URL Kanonikal untuk root page akan selalu menunjuk ke versi 'en-US'
  // Ini menghasilkan: https://hoteloza.com/en-US
  const canonicalUrl = `${baseUrl}/${defaultLocale}`;

  // Membuat daftar semua versi bahasa (hreflang)
  const languages = {};
  i18nConfig.forEach(config => {
    // e.g., 'en-US': 'https://hoteloza.com/en-US', 'id-ID': 'https://hoteloza.com/id-ID'
    languages[config.code] = `${baseUrl}/${config.code}`;
  });

  return {
    title: dictionary.metadata.homePageTitle,
    description: dictionary.metadata.homePageDescription,
    
    alternates: {
      // Menetapkan https://hoteloza.com/en-US sebagai URL utama (kanonikal)
      canonical: canonicalUrl,
      // Memberitahu Google semua versi bahasa yang ada
      languages: {
        ...languages,
        // x-default juga menunjuk ke versi en-US
        'x-default': canonicalUrl,
      },
    },

    openGraph: {
      title: dictionary.metadata.homePageTitle,
      description: dictionary.metadata.homePageDescription,
      // URL untuk social media sharing juga harus konsisten dengan kanonikal
      url: canonicalUrl, 
      siteName: "Hoteloza",
      images: [ /* ... */ ],
      type: "website",
    },
    twitter: { /* ... */ },
    keywords: [ /* ... */ ],
  };
}


export default async function HomePage() {
  // Selalu ambil dictionary dan bahasa default ('en' dan 'en-US') untuk root page
  const dictionary = await getdictionary(defaultDictionaryCode);

  return (
    <>
      <Home1 dictionary={dictionary} currentLang={defaultLocale} />
    </>
  );
}