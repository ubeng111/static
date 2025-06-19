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
      config.code === browserLangPref // Ini juga bisa jadi masalah jika ada 'en' generik dan 'en-us'
                                     // Perlu prioritas jika ada keduanya. Untuk saat ini, asumsikan aman.
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
  const slugPath = params?.slug?.join('/') || ''; // adjust for dynamic segments
  const hreflangLinks = i18nConfig.map((config) => {
    // Tentukan slug URL yang sebenarnya untuk hreflang
    // Gunakan config.defaultRoute jika ada, jika tidak, gunakan config.code
    const targetSlug = config.defaultRoute || config.code;
    const langHref = `https://hoteloza.com/${targetSlug}/${slugPath}`; // Gunakan targetSlug di sini

    return (
      <link
        key={config.htmlLangCode} // Gunakan htmlLangCode sebagai key unik
        rel="alternate"
        hrefLang={config.htmlLangCode} // Ini adalah nilai untuk atribut hreflang
        href={langHref} // Ini adalah URL yang mengarah ke halaman yang benar
      />
    );
  });

  // Optional: Add x-default
  // Pastikan x-default mengarah ke defaultLocale yang benar dan tidak dialihkan
  // Jika defaultLocale Anda (misalnya 'us') adalah target akhir untuk x-default,
  // maka tidak perlu perubahan di sini.
  // Jika defaultLocale adalah 'en' (generik) dan dialihkan ke 'us',
  // maka x-default harus menunjuk ke 'us'
  const xDefaultConfig = i18nConfig.find(config => config.code === defaultLocale);
  const xDefaultTargetSlug = xDefaultConfig?.defaultRoute || defaultLocale;

  hreflangLinks.push(
    <link
      key="x-default"
      rel="alternate"
      hrefLang="x-default"
      href={`https://hoteloza.com/${xDefaultTargetSlug}/${slugPath}`}
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