// middleware.js
import { NextResponse } from 'next/server';
import { i18nConfig, defaultLocale, defaultLanguageMap, locales } from './config/i18n';

// Memetakan htmlLangCode (e.g., en-US) ke slug kanonisnya (e.g., us)
const htmlLangCodeToSlugMap = new Map();
i18nConfig.forEach(config => {
  htmlLangCodeToSlugMap.set(config.htmlLangCode.toLowerCase(), config.code);
});

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const rawSegments = pathname.split('/').filter(Boolean);
  const currentPathSlug = rawSegments.length > 0 ? rawSegments[0] : null;
  const pureContentSegments = rawSegments.slice(1);

  let targetCanonicalSlug = defaultLocale; // Slug kanonis yang diharapkan di akhir
  let redirectNeeded = false;

  console.log('--- Middleware Request Start ---');
  console.log('Middleware: Original Pathname:', pathname);
  console.log('Middleware: Current Path Slug:', currentPathSlug);

  // 1. Tentukan slug kanonis berdasarkan slug di path, atau deteksi browser, atau default.

  if (currentPathSlug) {
    // Slug ada di path
    if (locales.includes(currentPathSlug)) {
      // Slug di path adalah salah satu slug URL kanonis yang valid (misal: 'us', 'sa', 'eg')
      targetCanonicalSlug = currentPathSlug;
      console.log(`Middleware: Slug '${currentPathSlug}' found in path and is canonical.`);
    } else {
      // Slug di path BUKAN salah satu slug URL kanonis yang valid
      // Ini bisa berarti slug generik yang harus dialihkan (misal: '/en/' jika hanya '/us/' yang kanonis)
      // ATAU slug yang tidak dikenal sama sekali.
      // Kita perlu mencari tahu apakah ini adalah sebuah 'htmlLangCode' generik (misal 'en')
      // yang kita definisikan untuk dialihkan ke defaultnya (misal 'us').
      const possibleGenericSlug = currentPathSlug.toLowerCase();
      if (defaultLanguageMap.has(possibleGenericSlug)) {
        // Ini adalah bahasa generik (misal 'en') yang harus dialihkan ke default-nya (misal 'us')
        targetCanonicalSlug = defaultLanguageMap.get(possibleGenericSlug);
        redirectNeeded = true;
        console.log(`Middleware: Generic slug '${currentPathSlug}' in path. Redirecting to canonical: '${targetCanonicalSlug}'`);
      } else {
        // Slug tidak dikenal atau tidak valid, redirect ke defaultLocale
        targetCanonicalSlug = defaultLocale;
        redirectNeeded = true;
        console.log(`Middleware: Invalid/unknown slug '${currentPathSlug}' in path. Redirecting to default: '${targetCanonicalSlug}'`);
      }
    }
  } else {
    // Tidak ada slug di path (permintaan ke '/')
    const acceptLanguageHeader = request.headers.get('accept-language');
    let preferredCanonicalSlugFromBrowser = null;

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
        const langCode = browserPref.code; // ex: en-US, en

        // Coba cocokkan dengan htmlLangCode (e.g., en-US) ke slug kanonis
        let matchedSlug = htmlLangCodeToSlugMap.get(langCode);
        if (matchedSlug) {
          preferredCanonicalSlugFromBrowser = matchedSlug;
          console.log(`Middleware: Match by htmlLangCode: '${langCode}' -> '${preferredCanonicalSlugFromBrowser}'`);
          break;
        }

        // Coba cocokkan dengan bahasa generik (e.g., en) ke default slug kanonisnya
        const genericLangCode = langCode.split('-')[0].toLowerCase();
        if (defaultLanguageMap.has(genericLangCode)) {
            preferredCanonicalSlugFromBrowser = defaultLanguageMap.get(genericLangCode);
            console.log(`Middleware: Match by generic language: '${genericLangCode}' -> '${preferredCanonicalSlugFromBrowser}'`);
            break;
        }
      }
    }

    if (preferredCanonicalSlugFromBrowser && preferredCanonicalSlugFromBrowser !== defaultLocale) {
        targetCanonicalSlug = preferredCanonicalSlugFromBrowser;
        redirectNeeded = true;
        console.log(`Middleware: From root, browser preferred '${preferredCanonicalSlugFromBrowser}'. Redirecting.`);
    } else {
        // Jika tidak ada preferensi browser atau preferensinya adalah defaultLocale, tidak perlu redirect dari root.
        targetCanonicalSlug = defaultLocale;
        console.log(`Middleware: From root, using default locale '${targetCanonicalSlug}'. No redirect.`);
    }
  }

  // Bangun jalur URL yang dinormalisasi: /{targetCanonicalSlug}/{pureContentPath}
  const normalizedPathname = `/${targetCanonicalSlug}${pureContentSegments.length > 0 ? `/${pureContentSegments.join('/')}` : ''}`;

  console.log('Middleware: Calculated Normalized Pathname:', normalizedPathname);
  console.log('Middleware: Current Full Pathname (from request):', pathname);
  console.log('Middleware: Redirect Needed Flag:', redirectNeeded);
  console.log('Middleware: Pathname different from NormalizedPathname:', pathname !== normalizedPathname);


  // FINAL REDIRECT CHECK: Hanya lakukan pengalihan jika targetCanonicalSlug berbeda dari slug di path saat ini,
  // ATAU jika tidak ada slug di path (kasus root '/') DAN ada preferensi bahasa browser yang berbeda dari default.
  // ATAU jika slug di path saat ini adalah slug generik yang perlu dialihkan ke kanonisnya.
  const currentUrlWithSlug = `/${currentPathSlug || ''}${pureContentSegments.length > 0 ? `/${pureContentSegments.join('/')}` : ''}`;

  if (normalizedPathname !== pathname) { // Selama ada perbedaan URL, kita akan mencoba redirect
        // Namun, kita harus memastikan redirectNeeded flag sudah diatur dengan benar di logika di atas.
        // Jika pathname saat ini sudah merupakan URL kanonis yang seharusnya, kita tidak perlu redirect.
        // Cek apakah 'currentPathSlug' (misal 'us') adalah target 'normalizedPathname' (misal '/us/')
        // Jika targetCanonicalSlug adalah currentPathSlug (berarti sudah kanonis), dan pathname sudah match normalizedPathname,
        // maka tidak perlu redirect.
        if (currentPathSlug === targetCanonicalSlug && pathname === normalizedPathname) {
            console.log('Middleware: Path already canonical and matches normalized. No redirect.');
            return NextResponse.next();
        }

        const newUrl = new URL(`${normalizedPathname}${search}`, request.url);
        console.log('Middleware: PERFORMING REDIRECT to:', newUrl.toString());
        console.log('--- Middleware Request End (Redirect) ---');
        return NextResponse.redirect(newUrl);
  }

  console.log('Middleware: Continuing without redirect (path is already canonical or no redirect required).');
  console.log('--- Middleware Request End (Continue) ---');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};