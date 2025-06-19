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

  // === HREFLANG LOGIC YANG DIPERBARUI ===
  const baseUrl = 'https://hoteloza.com';

  // Ambil path final dari header
  const normalizedPath = headersList.get('x-normalized-path') || `/${urlLangSlug}`;
  const pathSegments = normalizedPath.split('/').filter(Boolean);
  const finalSlugPath = pathSegments.length > 1 ? pathSegments.slice(1).join('/') : '';

  // Bangun map untuk hreflang
  const hreflangMap = new Map();

  // Iterasi melalui semua konfigurasi bahasa yang tersedia
  i18nConfig.forEach((config) => {
    // Bangun URL lengkap untuk setiap alternatif bahasa
    const langHref = `${baseUrl}/${config.code}${finalSlugPath ? `/${finalSlugPath}` : ''}`;
    
    // Tambahkan hreflang menggunakan htmlLangCode yang paling spesifik (contoh: 'en-US', 'ar-SA', 'bg-BG').
    // Ini secara langsung mengatasi masalah duplikasi dengan tag hreflang generik (seperti 'en', 'ar', 'bg')
    // karena kita hanya menyertakan tag spesifik.
    hreflangMap.set(config.htmlLangCode, langHref);

    // CATATAN: Logika sebelumnya yang menambahkan versi generik (seperti 'en' dari 'en-US')
    // jika `defaultForLanguage` adalah true telah DIHAPUS.
    // Ini adalah sumber masalah 'dobel lang' dan tidak diperlukan jika tujuan utama adalah
    // untuk menyediakan hreflang yang jelas dan spesifik per URL.
    // Properti 'defaultForLanguage' di i18nConfig tetap ada dan bisa digunakan
    // untuk tujuan lain (misalnya, logika middleware untuk pengalihan generik).
  });

  // Tambahkan x-default yang menunjuk ke URL default (biasanya bahasa Inggris US)
  const xDefaultHref = `${baseUrl}/${defaultLocale}${finalSlugPath ? `/${finalSlugPath}` : ''}`;
  hreflangMap.set("x-default", xDefaultHref);

  // Render tag <link rel="alternate"> dari hreflangMap
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