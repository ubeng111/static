import ClientProviders from "@/components/ClientProviders";
import { getdictionary } from '@/dictionaries/get-dictionary';
import { headers } from 'next/headers';
import { i18nConfig, defaultLocale, defaultHtmlLang } from '@/config/i18n';
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
  const urlLangSlug = params?.lang || defaultLocale;
  let determinedHtmlLang = defaultHtmlLang;
  let initialLangSlugForDictionary = defaultLocale;

  // Tentukan konfigurasi berdasarkan slug URL
  const configByUrlSlug = i18nConfig.find(config => config.code === urlLangSlug);
  if (configByUrlSlug) {
    determinedHtmlLang = configByUrlSlug.htmlLangCode;
    initialLangSlugForDictionary = configByUrlSlug.code;
  } else {
    console.warn(`[Layout Warn] Invalid urlLangSlug "${urlLangSlug}". Falling back to default locale: ${defaultLocale}`);
  }

  // Muat dictionary lokal
  const dictionary = await getdictionary(initialLangSlugForDictionary);

  // === HREFLANG LOGIC ===
  const baseUrl = 'https://hoteloza.com';

  // Ambil path final dari header
  const normalizedPath = headersList.get('x-normalized-path') || `/${urlLangSlug}`;
  const pathSegments = normalizedPath.split('/').filter(Boolean);
  const finalSlugPath = pathSegments.length > 1 ? pathSegments.slice(1).join('/') : '';

  // Bangun map untuk hreflang
  const hreflangMap = new Map();

  i18nConfig.forEach((config) => {
    const langHref = `${baseUrl}/${config.code}${finalSlugPath ? `/${finalSlugPath}` : ''}`;
    
    // Tambahkan htmlLangCode seperti 'ar-SA'
    hreflangMap.set(config.htmlLangCode, langHref);

    // Jika ini default untuk bahasa (contoh: ar-SA untuk ar), tambahkan versi generik seperti 'ar'
    if (config.defaultForLanguage) {
      const genericLangCode = config.htmlLangCode.split('-')[0].toLowerCase();
      if (!hreflangMap.has(genericLangCode)) {
        hreflangMap.set(genericLangCode, langHref);
      }
    }
  });

  // Tambahkan x-default
  const xDefaultHref = `${baseUrl}/${defaultLocale}${finalSlugPath ? `/${finalSlugPath}` : ''}`;
  hreflangMap.set("x-default", xDefaultHref);

  // Render tag <link rel="alternate">
  const hreflangLinks = Array.from(hreflangMap.entries()).map(([hreflangCode, hrefUrl]) => (
    <link key={hreflangCode} rel="alternate" hrefLang={hreflangCode} href={hrefUrl} />
  ));

  return (
    <html lang={determinedHtmlLang}>
      <head>
        {hreflangLinks}
      </head>
      <body>
        <ClientProviders dictionary={dictionary} initialLang={initialLangSlugForDictionary}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
