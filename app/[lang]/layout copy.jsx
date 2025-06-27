// app/[lang]/layout.jsx
import { getdictionary } from '@/dictionaries/get-dictionary';
import { headers } from 'next/headers';
import { i18nConfig, defaultLocale, defaultDictionaryCode } from '@/config/i18n';
import { Analytics } from "@vercel/analytics/next";

export default async function LanguageLayout({ children, params }) {
  // Tidak perlu lagi params.lang secara langsung untuk logika utama,
  // karena middleware sudah meneruskan locale yang benar via header.
  const headersList = await headers();
  const currentLocale = headersList.get('x-current-locale') || defaultLocale; // Ini yang penting
  const contentPathFromHeader = headersList.get('x-content-pathname') || '';
  const finalCanonicalUrl = headersList.get('x-final-canonical-url'); // Ambil canonical URL final dari header

  const currentLangConfig = i18nConfig.find(config => config.code === currentLocale);
  const dictionaryCodeToUse = currentLangConfig ? currentLangConfig.dictionaryCode : defaultDictionaryCode;

  const dictionary = await getdictionary(dictionaryCodeToUse); // Menggunakan dictionaryKey yang benar

  const baseUrl = 'https://hoteloza.com'; // Pastikan ini domain asli Anda

  const hreflangMap = new Map();
  i18nConfig.forEach((config) => {
    const langHref = `<span class="math-inline">\{baseUrl\}/</span>{config.code}${contentPathFromHeader ? `${contentPathFromHeader}` : ''}`;
    const hreflangCode = config.htmlLangCode;
    hreflangMap.set(hreflangCode, langHref);
  });

  const xDefaultHref = `<span class="math-inline">\{baseUrl\}/</span>{defaultLocale}${contentPathFromHeader ? `${contentPathFromHeader}` : ''}`;
  hreflangMap.set('x-default', xDefaultHref);

  const hreflangLinks = Array.from(hreflangMap.entries()).map(([hreflangCode, hrefUrl]) => (
    <link key={hreflangCode} rel="alternate" hrefLang={hreflangCode} href={hrefUrl} />
  ));

  const canonicalUrl = finalCanonicalUrl; // Gunakan yang sudah dikalkulasi middleware

  return (
    <>
      <Analytics />
      {hreflangLinks}
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index,follow"/> 
      {children}
    </>
  );
}