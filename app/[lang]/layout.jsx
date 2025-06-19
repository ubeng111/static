// app/layout.jsx
import ClientProviders from "@/components/ClientProviders";
import { getdictionary } from '@/dictionaries/get-dictionary';
import { headers } from 'next/headers';
import { i18nConfig, defaultLocale, defaultHtmlLang, defaultLanguageMap } from '@/config/i18n'; //

import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import "aos/dist/aos.css";
import "@/styles/index.scss";

export default async function RootLayout({ children, params }) {
  const headersList = headers();
  const acceptLanguage = await headersList.get('accept-language') || 'en-US';

  const urlLangSlug = params.lang; //

  let determinedHtmlLang = defaultHtmlLang; //
  let initialLangSlugForDictionary = defaultLocale; //

  if (urlLangSlug) { //
    const configByUrlSlug = i18nConfig.find(config => config.code === urlLangSlug); //
    if (configByUrlSlug) { //
      determinedHtmlLang = configByUrlSlug.htmlLangCode; //
      initialLangSlugForDictionary = configByUrlSlug.code; //
    } else {
      determinedHtmlLang = defaultHtmlLang; //
      initialLangSlugForDictionary = defaultLocale; //
    }
  } else {
    determinedHtmlLang = defaultHtmlLang; //
    initialLangSlugForDictionary = defaultLocale; //
  }

  console.log('--- Layout Render Start ---');
  console.log('Layout: URL Lang Slug from params:', urlLangSlug);
  console.log('Layout: Accept-Language Header (raw):', acceptLanguage);
  console.log('Layout: Determined HTML Lang (for <html> lang attribute):', determinedHtmlLang);
  console.log('Layout: Initial Lang Slug for Dictionary/ClientProviders:', initialLangSlugForDictionary);
  console.log('--- Layout Render End ---');

  const dictionary = await getdictionary(initialLangSlugForDictionary); //

  console.log('Layout: Loaded dictionary for:', initialLangSlugForDictionary);
  console.log('Layout: Footer section of dictionary (sample):', dictionary?.footer?.copyright);

  // === HREFLANG GENERATOR ===
  const slugPath = params?.slug?.join('/') || ''; //
  const baseUrl = 'https://hoteloza.com';

  // Gunakan Map untuk menyimpan hreflangs untuk dengan mudah menangani potensi duplikat dan memprioritaskan
  // yang lebih generik atau default jika diperlukan.
  const hreflangMap = new Map(); // Map<hreflangCode, url>

  // Iterasi melalui konfigurasi bahasa untuk menentukan hreflang yang paling tepat.
  i18nConfig.forEach((config) => { //
    const langHref = `${baseUrl}/${config.code}${slugPath ? `/${slugPath}` : ''}`; //
    const genericLangCode = config.htmlLangCode.split('-')[0].toLowerCase(); // Mendapatkan 'en' dari 'en-US', 'id' dari 'id-ID'

    // Jika konfigurasi ini adalah default untuk bahasa generiknya (misalnya, 'us' adalah default untuk 'en'),
    // kita akan memprioritaskan kode bahasa generik (misal 'en') untuk hreflang.
    if (config.defaultForLanguage) { //
      // Tambahkan atau timpa dengan kode generik, karena ini adalah default untuk bahasa tersebut.
      // Ini akan membuat hreflang="en" -> /us/, hreflang="id" -> /id/, dll.
      hreflangMap.set(genericLangCode, langHref);
    }

    // Selalu tambahkan kode spesifik (misal 'en-US', 'id-ID') HANYA JIKA
    // kode generiknya (misal 'en', 'id') tidak menunjuk ke URL yang SAMA.
    // Ini berarti jika 'en-US' dan 'en' sama-sama menunjuk ke /us/, kita hanya akan punya 'en'.
    // Tapi jika ada 'en-GB' yang menunjuk ke /gb/, itu tetap ditambahkan.
    if (!hreflangMap.has(config.htmlLangCode) || hreflangMap.get(config.htmlLangCode) !== langHref) {
         // Tambahkan kode spesifik jika belum ada atau jika URL-nya berbeda dari apa yang sudah ada.
         // Ini akan memastikan 'en-GB' -> /gb/ tetap ada.
         // Tapi jika 'id-ID' menunjuk ke URL yang sama dengan 'id' (dan 'id' sudah disetel),
         // maka 'id-ID' tidak akan ditambahkan lagi.
        hreflangMap.set(config.htmlLangCode, langHref);
    }
  });

  // 3. Tambahkan x-default
  const defaultLocaleConfig = i18nConfig.find(config => config.code === defaultLocale); //
  const xDefaultHref = `${baseUrl}/${defaultLocaleConfig.code}${slugPath ? `/${slugPath}` : ''}`; //

  hreflangMap.set("x-default", xDefaultHref); //

  // Konversi Map menjadi array elemen <link>
  const hreflangLinks = Array.from(hreflangMap.entries()).map(([hreflangCode, hrefUrl]) => (
    <link
      key={hreflangCode} // Gunakan hreflangCode sebagai kunci untuk keunikan
      rel="alternate"
      hrefLang={hreflangCode}
      href={hrefUrl}
    />
  ));

  return (
    <html lang={determinedHtmlLang}>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          name="google-site-verification"
          content="2CUKI9cYViNxYurFPrRO39L2Qg9DHlUUu6mJsskuVg"
        />
        {hreflangLinks}
      </head>
      <body>
        <ClientProviders
          dictionary={dictionary}
          initialLangSlug={initialLangSlugForDictionary}
        >
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}