// middleware.js
// TIDAK ADA PERUBAHAN SIGNIFIKAN YANG DIPERLUKAN DI SINI, FOKUS PADA PEMAHAMAN PERILAKU 308
import { NextResponse } from 'next/server';
import { i18nConfig, defaultLocale } from './config/i18n';

const validLangSlugs = i18nConfig.map(config => config.code);

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  // Lewati semua internal path Next.js (_next), file statis (misalnya /favicon.ico),
  // dan API routes
  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const rawSegments = pathname.split('/').filter(Boolean);

  let targetLocale = defaultLocale;
  let pureContentSegments = [];
  let foundInitialLocaleInPath = false;

  // DEBUG: Log awal permintaan
  console.log('--- Middleware Request Start ---');
  console.log('Middleware: Original Pathname:', pathname);
  console.log('Middleware: Raw Segments:', rawSegments);

  // 1. Coba deteksi locale dari URL path terlebih dahulu
  if (rawSegments.length > 0 && validLangSlugs.includes(rawSegments[0])) {
    targetLocale = rawSegments[0];
    pureContentSegments = rawSegments.slice(1);
    foundInitialLocaleInPath = true;
    console.log('Middleware: Locale found in path:', targetLocale);
  } else {
    // Jika tidak ada locale di URL path, rawSegments adalah pureContentSegments
    pureContentSegments = rawSegments;

    // 2. Jika tidak ada locale di URL path, coba deteksi dari Accept-Language header
    const acceptLanguageHeader = request.headers.get('accept-language');
    let initialTargetLocale = defaultLocale;

    console.log('Middleware: Accept-Language Header:', acceptLanguageHeader);

    if (acceptLanguageHeader) {
      const preferredLanguages = acceptLanguageHeader
        .split(',')
        .map(lang => {
          const parts = lang.trim().split(';');
          const code = parts[0].toLowerCase();
          const q = parts.length > 1 ? parseFloat(parts[1].split('=')[1]) : 1.0;
          return { code, q };
        })
        .sort((a, b) => b.q - a.q);

      console.log('Middleware: Parsed Preferred Languages:', preferredLanguages);

      for (const browserPref of preferredLanguages) {
        const langCode = browserPref.code;

        // Prioritas 1: Coba temukan kecocokan langsung dengan `localeCode` di i18nConfig
        let matchedConfig = i18nConfig.find(config => config.localeCode === langCode);
        if (matchedConfig) {
          initialTargetLocale = matchedConfig.code;
          console.log('Middleware: Match by localeCode:', langCode, '->', initialTargetLocale);
          break;
        }

        // Prioritas 2: Jika tidak ada kecocokan `localeCode` yang tepat, coba temukan berdasarkan `language` generik
        const genericLang = langCode.split('-')[0];
        // Pastikan kita mencari yang 'code' yang sesuai untuk bahasa generik
        matchedConfig = i18nConfig.find(config => config.language === genericLang && config.localeCode === genericLang);
        if (matchedConfig) { // Jika ditemukan konfigurasi untuk bahasa generik (misal code: 'en', localeCode: 'en')
          initialTargetLocale = matchedConfig.code;
          console.log('Middleware: Match by generic language:', genericLang, '->', initialTargetLocale);
          break;
        }
        // Fallback untuk bahasa generik jika tidak ada entri eksplisit untuk bahasa generik
        matchedConfig = i18nConfig.find(config => config.language === genericLang);
        if (matchedConfig) {
          initialTargetLocale = matchedConfig.code; // Ambil slug dari entri pertama yang cocok
          console.log('Middleware: Fallback match by generic language (first config):', genericLang, '->', initialTargetLocale);
          break;
        }
      }
    }
    targetLocale = initialTargetLocale;
    console.log('Middleware: Final determined targetLocale (after Accept-Language check):', targetLocale);
  }

  // Bangun jalur URL yang dinormalisasi: /{targetLocale}/{pureContentPath}
  const normalizedPathname = `/${targetLocale}${pureContentSegments.length > 0 ? `/${pureContentSegments.join('/')}` : ''}`;

  console.log('Middleware: Normalized Pathname:', normalizedPathname);
  console.log('Middleware: Should Redirect:', pathname !== normalizedPathname);

  if (pathname !== normalizedPathname) {
    const newUrl = new URL(`${normalizedPathname}${search}`, request.url);
    console.log('Middleware: Redirecting to:', newUrl.toString());
    console.log('--- Middleware Request End (Redirect) ---');
    return NextResponse.redirect(newUrl); // Ini adalah sumber 308
  }

  console.log('Middleware: Continuing without redirect.');
  console.log('--- Middleware Request End (Continue) ---');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};