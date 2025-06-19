// app/layout.jsx
import ClientProviders from "@/components/ClientProviders";
import { getdictionary } from '@/dictionaries/get-dictionary';
import { headers } from 'next/headers';
// Import defaultLocale dan defaultHtmlLang langsung dari i18n
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

  // Logika penentuan bahasa HTML dan dictionary tetap sama,
  // memastikan bahwa fallback ke defaultLocale jika slug tidak valid.
  if (urlLangSlug) {
    const configByUrlSlug = i18nConfig.find(config => config.code === urlLangSlug);
    if (configByUrlSlug) {
      determinedHtmlLang = configByUrlSlug.htmlLangCode;
      initialLangSlugForDictionary = configByUrlSlug.code;
    } else {
      // Jika URL slug tidak valid, fallback ke defaultLocale
      determinedHtmlLang = defaultHtmlLang;
      initialLangSlugForDictionary = defaultLocale;
    }
  } else {
    // Ini seharusnya dihandle oleh middleware, jadi jika sampai sini tanpa slug,
    // berarti ini adalah permintaan root yang belum dialihkan.
    // Kita akan gunakan defaultLocale untuk dictionary.
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

  const hreflangLinks = i18nConfig.map((config) => {
    // 'code' di i18nConfig kini adalah slug URL kanonis
    const langHref = `https://hoteloza.com/${config.code}/${slugPath}`;
    return (
      <link
        key={config.code} // Gunakan code sebagai key unik
        rel="alternate"
        hrefLang={config.htmlLangCode} // Ini adalah atribut hreflang (e.g., en-US, ar-SA)
        href={langHref} // Ini adalah URL yang mengarah ke halaman yang benar (e.g., /us/, /sa/)
      />
    );
  });

  // Tambahkan tag hreflang generik (misal: hreflang="en" -> /us/)
  // Ini penting agar Google tahu bahwa /us/ adalah representasi untuk bahasa Inggris secara umum juga.
  // Hanya tambahkan jika ada entri defaultForLanguage.
  defaultLanguageMap.forEach((canonicalSlug, langCode) => {
    // Cek apakah sudah ada tag hreflang spesifik untuk bahasa ini (misal en-US)
    // Jika htmlLangCode dari config.code (ex: us) adalah en-US, maka hreflang="en-US" sudah ada.
    // Kita ingin menambahkan hreflang="en" yang menunjuk ke lokasi yang sama.
    const hasSpecificHreflang = hreflangLinks.some(link => link.props.hrefLang === langCode);

    // Pastikan tidak menambahkan duplikat hreflang (e.g., hreflang="en" jika sudah ada hreflang="en")
    // Dan pastikan ini adalah untuk bahasa generik (misal 'en', 'ar')
    if (!hasSpecificHreflang && langCode.includes('-') === false) { // Pastikan langCode ini adalah bahasa generik (misal 'en')
      const targetConfig = i18nConfig.find(config => config.code === canonicalSlug);
      if (targetConfig) {
         hreflangLinks.push(
            <link
                key={`generic-${langCode}`}
                rel="alternate"
                hrefLang={langCode} // Atribut hreflang generik (misal: en, ar)
                href={`https://hoteloza.com/${targetConfig.code}/${slugPath}`} // URL kanonisnya
            />
         );
      }
    }
  });


  // Tambahkan x-default
  // x-default harus menunjuk ke URL defaultLocale yang kanonis (misal /us/)
  const defaultLocaleConfig = i18nConfig.find(config => config.code === defaultLocale);
  const xDefaultHref = `https://hoteloza.com/${defaultLocaleConfig.code}/${slugPath}`;

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