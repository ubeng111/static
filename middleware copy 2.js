// middleware.js
import { NextResponse } from 'next/server';
import { i18nConfig, defaultLocale } from './config/i18n';

const validLangSlugs = i18nConfig.map(config => config.code);

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  // Lewati internal path Next.js, file statis, dan API routes
  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/api')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-current-pathname', pathname);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const rawSegments = pathname.split('/').filter(Boolean);

  let currentLocaleInPath = defaultLocale; // Ini adalah locale yang terdeteksi dari PATH
  let contentSegments = [];

  const hasValidLangInPath = rawSegments.length > 0 && validLangSlugs.includes(rawSegments[0]);

  if (hasValidLangInPath) {
    currentLocaleInPath = rawSegments[0];
    contentSegments = rawSegments.slice(1);
    console.log('Middleware: Locale found in path:', currentLocaleInPath);
  } else {
    // --- START: Logika Pengalihan 301 untuk URL Lama Tanpa Prefiks Bahasa ---
    // Jika tidak ada slug bahasa di URL DAN ini BUKAN rute root '/' (yang ditangani oleh app/page.jsx)
    if (pathname !== '/') {
      // Ini adalah URL tanpa prefiks bahasa (e.g., /villa/indonesia)
      // Kita asumsikan kontennya dalam defaultLocale dan arahkan secara permanen (301).
      // Ini membantu mengkonsolidasi SEO dari URL lama.
      const targetPathWithDefaultLang = `/${defaultLocale}${pathname}`;
      const newUrl = new URL(`${targetPathWithDefaultLang}${search}`, request.url);

      console.log(`Middleware: Redirecting old non-i18n URL '${pathname}' to '${newUrl.toString()}' (301 Permanent)`);
      // Lakukan pengalihan 301 permanen
      return NextResponse.redirect(newUrl.toString(), 301);
    }
    // --- END: Logika Pengalihan 301 ---

    // Jika ini adalah root path '/' (pathname === '/'), biarkan middleware berjalan normal
    // agar app/page.jsx yang akan melakukan redirect ke /defaultLocale.
    currentLocaleInPath = defaultLocale;
    contentSegments = rawSegments;
    console.log('Middleware: No locale in path. Using default locale for URL processing:', currentLocaleInPath);
  }

  // Deteksi bahasa preferensi dari Accept-Language header (UNTUK SARAN, BUKAN REDIRECT)
  let preferredLocaleFromBrowser = defaultLocale;
  const acceptLanguageHeader = request.headers.get('accept-language');

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
      let matchedConfig = i18nConfig.find(config => config.localeCode === langCode);
      if (matchedConfig) {
        preferredLocaleFromBrowser = matchedConfig.code;
        console.log('Middleware: Match by localeCode:', langCode, '->', preferredLocaleFromBrowser);
        break;
      }
      const genericLang = langCode.split('-')[0];
      matchedConfig = i18nConfig.find(config => config.language === genericLang);
      if (matchedConfig) {
        preferredLocaleFromBrowser = matchedConfig.code;
        console.log('Middleware: Match by generic language:', genericLang, '->', preferredLocaleFromBrowser);
        break;
      }
    }
  }
  console.log('Middleware: Preferred locale from browser (Accept-Language):', preferredLocaleFromBrowser);

  // Bangun path konten yang akan digunakan oleh layout untuk hreflang dan canonical
  // Ini adalah path tanpa slug bahasa di depannya
  const contentPathForLayout = contentSegments.length > 0 ? `/${contentSegments.join('/')}` : '';

  // Buat header respons untuk meneruskan informasi ke komponen
  const responseHeaders = new Headers(request.headers);

  // x-current-locale: Bahasa yang terdeteksi dari URL yang diminta (akan sama dengan params.lang atau defaultLocale)
  responseHeaders.set('x-current-locale', currentLocaleInPath);
  // x-content-pathname: Path konten tanpa slug bahasa (digunakan oleh layout untuk hreflang/canonical)
  responseHeaders.set('x-content-pathname', contentPathForLayout);
  // x-normalized-pathname: Ini akan mencerminkan path yang diminta dengan locale yang terdeteksi di awal.
  responseHeaders.set('x-normalized-pathname', `/${currentLocaleInPath}${contentPathForLayout}`);
  // x-preferred-locale-browser: Bahasa yang paling disukai menurut browser pengguna (untuk saran, bukan redirect)
  responseHeaders.set('x-preferred-locale-browser', preferredLocaleFromBrowser);

  console.log('Middleware: Continuing without redirect.');
  console.log('--- Middleware Request End (Continue) ---');
  return NextResponse.next({
    request: {
      headers: responseHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Pastikan matcher menangkap semua jalur kecuali yang tidak perlu diproses
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};