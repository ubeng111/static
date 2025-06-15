// app/layout.jsx
import ClientProviders from "@/components/ClientProviders";
import { getdictionary } from '@/dictionaries/get-dictionary';
import { headers } from 'next/headers';
// Import 'defaultHtmlLang' dari config/i18n
import { locales, defaultLocale, i18nConfig, defaultHtmlLang } from '@/config/i18n'; 

// Import CSS global
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/index.scss";

export default async function RootLayout({ children }) {
  const headersList = headers();
  const acceptLanguage = await headersList.get('accept-language') || 'en-US';
  const browserLangPref = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();

  // DEBUG: Log Accept-Language dari Layout
  console.log('--- Layout Render Start ---');
  console.log('Layout: Accept-Language Header (raw):', acceptLanguage);
  console.log('Layout: Detected Browser Lang Pref (from Accept-Language):', browserLangPref);

  const matchedLangConfig = i18nConfig.find(config =>
    config.localeCode.startsWith(browserLangPref) || config.language === browserLangPref || config.code === browserLangPref
  );

  // Gunakan 'htmlLangCode' dari matched config, atau 'defaultHtmlLang'
  const initialHtmlLang = matchedLangConfig ? matchedLangConfig.htmlLangCode : defaultHtmlLang;

  // Debugging di Server Component
  console.log('Layout: Matched Lang Config:', matchedLangConfig);
  console.log('Layout: Determined initialHtmlLang (for <html> lang attribute):', initialHtmlLang);
  console.log('--- Layout Render End ---');

  // Gunakan 'code' dari matched config, atau 'defaultLocale' untuk mengambil kamus
  // Asumsi: getdictionary mengharapkan slug seperti 'us', 'id', 'es'
  const initialLangSlugForDictionary = matchedLangConfig ? matchedLangConfig.code : defaultLocale; 
  const dictionary = await getdictionary(initialLangSlugForDictionary);


  console.log('Layout: Loaded dictionary for:', initialLangSlugForDictionary);
  console.log('Layout: Footer section of dictionary (sample):', dictionary?.footer?.copyright);

  return (
    <html lang={initialHtmlLang}> {/* Atribut lang sekarang menggunakan nilai BCP 47 yang valid */}
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          name="google-site-verification"
          content="2CUKI9cYViNxYurFPrRO39L2Qg9DHlUUu6mJsskuVg"
        />
      </head>
      <body>
        <ClientProviders dictionary={dictionary} initialLangSlug={initialLangSlugForDictionary}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}