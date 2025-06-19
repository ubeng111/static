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

  // Cek apakah urlLangSlug adalah kode bahasa yang valid dari i18nConfig
  const configByUrlSlug = i18nConfig.find(config => config.code === urlLangSlug);

  if (configByUrlSlug) { // Jika urlLangSlug valid
    determinedHtmlLang = configByUrlSlug.htmlLangCode;
    initialLangSlugForDictionary = configByUrlSlug.code;
  } else {
    // Jika urlLangSlug tidak ada atau tidak valid (misal 'img'), fallback ke default
    determinedHtmlLang = defaultHtmlLang;
    initialLangSlugForDictionary = defaultLocale;
  }

  console.log('--- Layout Render Start ---');
  console.log('Layout: Full params object:', params); // Log seluruh objek params
  console.log('Layout: Raw params.slug:', params?.slug); // Log array slug mentah
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
  const baseUrl = 'https://hoteloza.com';

  console.log('Hreflang Generator: Generated slugPath:', slugPath);

  const hreflangMap = new Map();

  // Tambahkan semua hreflang yang mungkin
  i18nConfig.forEach((config) => {
    const langHref = `${baseUrl}/${config.code}${slugPath ? `/${slugPath}` : ''}`;
    const genericLangCode = config.htmlLangCode.split('-')[0].toLowerCase();

    // Selalu tambahkan hreflang spesifik
    hreflangMap.set(config.htmlLangCode, langHref);

    // Jika ini adalah default untuk bahasanya, tambahkan juga hreflang generik
    if (config.defaultForLanguage) {
      if (!hreflangMap.has(genericLangCode) || hreflangMap.get(genericLangCode) !== langHref) {
        hreflangMap.set(genericLangCode, langHref);
      }
    }
  });

  // Tambahkan x-default
  const defaultLocaleConfig = i18nConfig.find(config => config.code === defaultLocale);
  const xDefaultHref = `${baseUrl}/${defaultLocaleConfig.code}${slugPath ? `/${slugPath}` : ''}`;
  hreflangMap.set("x-default", xDefaultHref);

  console.log('Hreflang Generator: Final hreflangMap:', Object.fromEntries(hreflangMap));

  const hreflangLinks = Array.from(hreflangMap.entries()).map(([hreflangCode, hrefUrl]) => (
    <link
      key={hreflangCode}
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