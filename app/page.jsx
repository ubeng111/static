// File: app/page.jsx
// Halaman ini akan menangani https://hoteloza.com/ dan menyajikan konten en-US

import { getdictionary } from '@/dictionaries/get-dictionary';
import Home1 from '@/components/home_1/Home1';
import { Suspense } from 'react'; // Import Suspense
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
      images: [
        {
          url: `${baseUrl}/opengraph-image.jpg`, // Ganti dengan path gambar OpenGraph yang relevan
          width: 1200,
          height: 630,
          alt: dictionary.metadata.homePageTitle,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.metadata.homePageTitle,
      description: dictionary.metadata.homePageDescription,
      images: [`${baseUrl}/twitter-image.jpg`], // Ganti dengan path gambar Twitter yang relevan
    },
    keywords: [
      "hotel deals",
      "travel affiliate",
      "cheap hotels",
      "best hotel booking site",
      "Hoteloza",
      "compare hotel prices",
      "book hotels online",
      "hotel discounts",
      "online hotel booking",
      "vacation rentals",
      "luxury hotels",
      "budget hotels",
      "family hotels",
      "boutique hotels",
      "last minute deals"
    ],
  };
}


export default async function HomePage() {
  // Selalu ambil dictionary dan bahasa default ('en' dan 'en-US') untuk root page
  const dictionary = await getdictionary(defaultDictionaryCode);

  return (
    <>
      {/* Jika Home1 adalah Client Component atau berpotensi menampilkan loading state, bungkus dengan Suspense */}
      <Suspense fallback={<div>Memuat konten beranda...</div>}>
        <Home1 dictionary={dictionary} currentLang={defaultLocale} />
      </Suspense>
    </>
  );
}