// app/layout.jsx
import ClientProviders from "@/components/ClientProviders";
import { getdictionary } from '@/dictionaries/get-dictionary';
import { headers } from 'next/headers';
import { i18nConfig, defaultLocale, defaultHtmlLang, defaultLanguageMap } from '@/config/i18n';

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

  const urlLangSlug = params.lang;

  let determinedHtmlLang = defaultHtmlLang;
  let initialLangSlugForDictionary = defaultLocale;

  if (urlLangSlug) {
    const configByUrlSlug = i18nConfig.find(config => config.code === urlLangSlug);
    if (configByUrlSlug) {
      determinedHtmlLang = configByUrlSlug.htmlLangCode;
      initialLangSlugForDictionary = configByUrlSlug.code;
    } else {
      determinedHtmlLang = defaultHtmlLang;
      initialLangSlugForDictionary = defaultLocale;
    }
  } else {
    determinedHtmlLang = defaultHtmlLang;
    initialLangSlugForDictionary = defaultLocale;
  }

  console.log('--- Layout Render Start ---');
  console.log('Layout: URL Lang Slug from params:', urlLangSlug);
  console.log('Layout: Accept-Language Header (raw):', acceptLanguage);
  console.log('Layout: Determined HTML Lang (for <html> lang attribute):', determinedHtmlLang);
  console.log('Layout: Initial Lang Slug for Dictionary/ClientProviders:', initialLangSlugForDictionary);
  console.log('--- Layout Render End ---');

  const dictionary = await getdictionary(initialLangSlugForDictionary);

  console.log('Layout: Loaded dictionary for:', initialLangSlugForDictionary);
  console.log('Layout: Footer section of dictionary (sample):', dictionary?.footer?.copyright);

  // === HREFLANG GENERATOR ===
  const slugPath = params?.slug?.join('/') || '';

  const hreflangLinks = []; // Inisialisasi sebagai array kosong

  // 1. Tambahkan Hreflang untuk Semua Varian Bahasa/Wilayah
  i18nConfig.forEach((config) => {
    const langHref = `https://hoteloza.com/${config.code}${slugPath ? `/${slugPath}` : ''}`;
    hreflangLinks.push(
      <link
        key={config.code}
        rel="alternate"
        hrefLang={config.htmlLangCode}
        href={langHref}
      />
    );
  });

  // 2. Tambahkan Hreflang Generik (misal: 'en' menunjuk ke '/us/')
  defaultLanguageMap.forEach((canonicalSlug, langCode) => {
    // Cek apakah sudah ada tag hreflang spesifik untuk bahasa ini (misal en-US)
    // Jika htmlLangCode dari config.code (ex: us) adalah en-US, maka hreflang="en-US" sudah ada.
    // Kita ingin menambahkan hreflang="en" yang menunjuk ke lokasi yang sama.
    // Pastikan ini adalah untuk bahasa generik (misal 'en')
    if (!langCode.includes('-')) {
        const targetConfig = i18nConfig.find(config => config.code === canonicalSlug);
        if (targetConfig) {
             // Pastikan tidak menambahkan duplikat hreflang generik jika sudah ada secara eksplisit
             const hasGenericHreflang = hreflangLinks.some(link => link.props.hrefLang === langCode);
             if (!hasGenericHreflang) {
                hreflangLinks.push(
                    <link
                        key={`generic-${langCode}`}
                        rel="alternate"
                        hrefLang={langCode} // Atribut hreflang generik (misal: en, ar)
                        href={`https://hoteloza.com/${targetConfig.code}${slugPath ? `/${slugPath}` : ''}`} // URL kanonisnya
                    />
                );
             }
        }
    }
  });


  // 3. Tambahkan x-default
  const defaultLocaleConfig = i18nConfig.find(config => config.code === defaultLocale);
  const xDefaultHref = `https://hoteloza.com/${defaultLocaleConfig.code}${slugPath ? `/${slugPath}` : ''}`;

  hreflangLinks.push(
    <link
      key="x-default"
      rel="alternate"
      hrefLang="x-default"
      href={xDefaultHref}
    />
  );

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