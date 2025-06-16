// app/layout.jsx
import ClientProviders from "@/components/ClientProviders";
import { getdictionary } from '@/dictionaries/get-dictionary';
import { headers } from 'next/headers';
// Import 'defaultHtmlLang' dari config/i18n
import { locales, defaultLocale, i18nConfig, defaultHtmlLang } from '@/config/i18n'; 

// Import CSS global Anda
// PERBAIKAN DI SINI: Menggunakan jalur yang benar untuk CSS Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"; 
// Pastikan file JS Bootstrap diimpor di ClientProviders.jsx jika itu yang Anda inginkan
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import "aos/dist/aos.css";
import "@/styles/index.scss"; // Asumsi ini adalah file CSS kustom Anda

// RootLayout menerima 'children' dan 'params'.
// 'params.lang' akan berisi slug bahasa dari URL (misalnya 'us', 'id', 'es').
export default async function RootLayout({ children, params }) {
  const headersList = headers();
  const acceptLanguage = await headersList.get('accept-language') || 'en-US';
  
  // Dapatkan slug bahasa dari URL parameters (ini adalah cara paling andal di App Router Server Components)
  const urlLangSlug = params.lang; 

  let determinedHtmlLang = defaultHtmlLang; // Atur nilai default BCP 47 sebagai fallback utama
  let initialLangSlugForDictionary = defaultLocale; // Atur default untuk kamus dan slug

  // --- LOGIKA PENENTUAN BAHASA DIMULAI ---

  // 1. Prioritaskan bahasa dari URL slug
  if (urlLangSlug) {
      const configByUrlSlug = i18nConfig.find(config => config.code === urlLangSlug);
      if (configByUrlSlug) {
          determinedHtmlLang = configByUrlSlug.htmlLangCode;
          initialLangSlugForDictionary = configByUrlSlug.code; // Gunakan slug URL untuk kamus
      } else {
          // Jika slug URL tidak cocok dengan konfigurasi, fallback ke default
          determinedHtmlLang = defaultHtmlLang;
          initialLangSlugForDictionary = defaultLocale;
      }
  } else {
      // 2. Jika tidak ada slug di URL (misal: halaman root '/'), fallback ke Accept-Language
      const browserLangPref = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
      const matchedBrowserLangConfig = i18nConfig.find(config =>
          config.localeCode.startsWith(browserLangPref) || config.language === browserLangPref || config.code === browserLangPref
      );
      if (matchedBrowserLangConfig) {
          determinedHtmlLang = matchedBrowserLangConfig.htmlLangCode;
          initialLangSlugForDictionary = matchedBrowserLangConfig.code; // Gunakan code dari yang cocok
      } else {
          // Jika tidak ada URL slug dan Accept-Language tidak cocok, tetap gunakan default
          determinedHtmlLang = defaultHtmlLang;
          initialLangSlugForDictionary = defaultLocale;
      }
  }
  // --- LOGIKA PENENTUAN BAHASA SELESAI ---


  // DEBUGGING: Log untuk membantu Anda melihat apa yang terjadi di server
  console.log('--- Layout Render Start ---');
  console.log('Layout: URL Lang Slug from params:', urlLangSlug);
  console.log('Layout: Accept-Language Header (raw):', acceptLanguage);
  console.log('Layout: Determined HTML Lang (for <html> lang attribute):', determinedHtmlLang);
  console.log('Layout: Initial Lang Slug for Dictionary/ClientProviders:', initialLangSlugForDictionary);
  console.log('--- Layout Render End ---');

  // Muat kamus berdasarkan slug yang ditentukan
  const dictionary = await getdictionary(initialLangSlugForDictionary);

  console.log('Layout: Loaded dictionary for:', initialLangSlugForDictionary);
  console.log('Layout: Footer section of dictionary (sample):', dictionary?.footer?.copyright);

  return (
    <html lang={determinedHtmlLang}> {/* Atribut lang sekarang menggunakan nilai BCP 47 yang valid dan akurat */}
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          name="google-site-verification"
          content="2CUKI9cYViNxYurFPrRO39L2Qg9DHlUUu6mJsskuVg"
        />
      </head>
      <body>
        {/* ClientProviders menerima kamus dan slug bahasa yang benar */}
        <ClientProviders dictionary={dictionary} initialLangSlug={initialLangSlugForDictionary}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}