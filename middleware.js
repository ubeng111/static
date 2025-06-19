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

  // Lewati untuk aset statis, API, dll.
  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const rawSegments = pathname.split('/').filter(Boolean);
  const currentPathSlug = rawSegments.length > 0 ? rawSegments[0] : null;
  const pureContentSegments = rawSegments.slice(1);

  let targetCanonicalSlug = defaultLocale;
  let redirectNeeded = false;

  console.log('--- Middleware Request Start ---');
  console.log('Middleware: Original Pathname:', pathname);
  console.log('Middleware: Current Path Slug:', currentPathSlug);

  // 1. Tentukan slug kanonis berdasarkan slug di path, atau deteksi browser, atau default
  if (currentPathSlug) {
    if (locales.includes(currentPathSlug)) {
      targetCanonicalSlug = currentPathSlug;
      console.log(`Middleware: Slug '${currentPathSlug}' found in path and is canonical.`);
    } else {
      const possibleGenericSlug = currentPathSlug.toLowerCase();
      if (defaultLanguageMap.has(possibleGenericSlug)) {
        targetCanonicalSlug = defaultLanguageMap.get(possibleGenericSlug);
        redirectNeeded = true;
        console.log(`Middleware: Generic slug '${currentPathSlug}' in path. Redirecting to canonical: '${targetCanonicalSlug}'`);
      } else {
        targetCanonicalSlug = defaultLocale;
        redirectNeeded = true;
        console.log(`Middleware: Invalid/unknown slug '${currentPathSlug}' in path. Redirecting to default: '${targetCanonicalSlug}'`);
      }
    }
  } else {
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
        const langCode = browserPref.code;
        let matchedSlug = htmlLangCodeToSlugMap.get(langCode);
        if (matchedSlug) {
          preferredCanonicalSlugFromBrowser = matchedSlug;
          console.log(`Middleware: Match by htmlLangCode: '${langCode}' -> '${preferredCanonicalSlugFromBrowser}'`);
          break;
        }
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
      targetCanonicalSlug = defaultLocale;
      console.log(`Middleware: From root, using default locale '${targetCanonicalSlug}'. No redirect.`);
    }
  }

  // Bangun jalur URL yang dinormalisasi
  const normalizedPathname = `/${targetCanonicalSlug}${pureContentSegments.length > 0 ? `/${pureContentSegments.join('/')}` : ''}`;
  console.log('Middleware: Calculated Normalized Pathname:', normalizedPathname);

  // Tambahkan header kustom untuk menyimpan normalizedPathname
  const response = redirectNeeded ? NextResponse.redirect(new URL(`${normalizedPathname}${search}`, request.url)) : NextResponse.next();
  response.headers.set('x-normalized-path', normalizedPathname);

  console.log('Middleware: Set x-normalized-path header:', normalizedPathname);
  console.log('Middleware: Redirect Needed:', redirectNeeded);
  console.log('--- Middleware Request End ---');

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};