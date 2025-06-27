// app/[lang]/layout.jsx - KODE PERBAIKAN

import { headers } from 'next/headers';
import { i18nConfig, defaultLocale, defaultDictionaryCode, defaultHtmlLang, genericLanguages } from '@/config/i18n';
import { Analytics } from "@vercel/analytics/next";

// 1. Pindahkan semua logika metadata ke dalam fungsi `generateMetadata`
export async function generateMetadata({ params }) {
  const currentLocale = params.lang || defaultLocale;
  const contentPathFromHeader = headers().get('x-content-pathname') || '';
  const baseUrl = 'https://hoteloza.com';
  const canonicalUrlToUse = `${baseUrl}/${currentLocale}${contentPathFromHeader.startsWith('/') ? contentPathFromHeader : (contentPathFromHeader ? `/${contentPathFromHeader}` : '')}`;

  const hreflangMap = new Map();

  // Tambahkan hreflang untuk locale spesifik wilayah
  i18nConfig.forEach((config) => {
    const pathSuffix = contentPathFromHeader.startsWith('/') ? contentPathFromHeader : (contentPathFromHeader ? `/${contentPathFromHeader}` : '');
    const langHref = `${baseUrl}/${config.code}${pathSuffix}`;
    hreflangMap.set(config.htmlLangCode, langHref);
  });

  // Tambahkan hreflang untuk bahasa generik
  genericLanguages.forEach((genericLang) => {
    const pathSuffix = contentPathFromHeader.startsWith('/') ? contentPathFromHeader : (contentPathFromHeader ? `/${contentPathFromHeader}` : '');
    const langHref = `${baseUrl}/${genericLang.defaultRegional}${pathSuffix}`;
    if (!hreflangMap.has(genericLang.langCode)) {
      hreflangMap.set(genericLang.langCode, langHref);
    }
  });

  // Siapkan objek 'alternates' untuk metadata
  const alternates = {
    canonical: canonicalUrlToUse,
    languages: {},
  };

  hreflangMap.forEach((href, lang) => {
    alternates.languages[lang] = href;
  });

  // Tambahkan x-default secara spesifik
  const pathSuffixXDefault = contentPathFromHeader.startsWith('/') ? contentPathFromHeader : (contentPathFromHeader ? `/${contentPathFromHeader}` : '');
  alternates.languages['x-default'] = `${baseUrl}/${defaultLocale}${pathSuffixXDefault}`;

  return {
    metadataBase: new URL(baseUrl),
    alternates,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function LanguageLayout({ children }) {
  return (
    <>
      <Analytics />
      {children}
    </>
  );
}