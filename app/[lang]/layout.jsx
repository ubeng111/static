// app/layout.jsx
import ClientProviders from "@/components/ClientProviders";
import { getdictionary } from '@/dictionaries/get-dictionary';
import { headers } from 'next/headers';
import { locales, defaultLocale, i18nConfig, defaultHtmlLang } from '@/config/i18n';

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
    const browserLangPref = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
    const matchedBrowserLangConfig = i18nConfig.find(config =>
      config.localeCode.startsWith(browserLangPref) ||
      config.language === browserLangPref ||
      config.code === browserLangPref
    );
    if (matchedBrowserLangConfig) {
      determinedHtmlLang = matchedBrowserLangConfig.htmlLangCode;
      initialLangSlugForDictionary = matchedBrowserLangConfig.code;
    } else {
      determinedHtmlLang = defaultHtmlLang;
      initialLangSlugForDictionary = defaultLocale;
    }
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
  const slugPath = params?.slug?.join('/') || ''; // sesuaikan untuk segmen dinamis
  const hreflangLinks = i18nConfig.map((config) => {
    const langHref = `https://hoteloza.com/${config.code}/${slugPath}`;
    return (
      <link
        key={config.htmlLangCode}
        rel="alternate"
        hrefLang={config.htmlLangCode}
        href={langHref}
      />
    );
  });

  // Tambahkan tautan bahasa yang tidak bergantung pada wilayah
  const uniqueLanguages = [...new Set(i18nConfig.map(config => config.language))];
  uniqueLanguages.forEach(lang => {
    // Temukan slug default untuk bahasa ini, prioritaskan 'us' untuk 'en'
    let langCodeForSlug = i18nConfig.find(config => config.language === lang && config.code === lang)?.code;
    if (!langCodeForSlug && lang === 'en') {
      langCodeForSlug = 'us'; // Fallback untuk bahasa Inggris ke 'us' jika tidak ada slug 'en' langsung
    }
    if (!langCodeForSlug) {
        // Fallback ke slug pertama yang tersedia untuk bahasa itu jika tidak ada kecocokan langsung atau 'us' untuk 'en'
        langCodeForSlug = i18nConfig.find(config => config.language === lang)?.code;
    }

    if (langCodeForSlug) {
      const langHref = `https://hoteloza.com/${langCodeForSlug}/${slugPath}`;
      hreflangLinks.push(
        <link
          key={lang} // Gunakan kode bahasa sebagai key
          rel="alternate"
          hrefLang={lang} // Ini adalah hreflang khusus bahasa
          href={langHref}
        />
      );
    }
  });


  // Opsional: Tambahkan x-default
  hreflangLinks.push(
    <link
      key="x-default"
      rel="alternate"
      hrefLang="x-default"
      href={`https://hoteloza.com/${defaultLocale}/${slugPath}`}
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