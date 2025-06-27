// middleware.js
import { NextResponse } from 'next/server';
import { i18nConfig, defaultLocale } from './config/i18n';

// Peta untuk memetakan slug bahasa ke konfigurasi i18n lengkap
const langMap = new Map();
i18nConfig.forEach(config => {
  langMap.set(config.code, config); // e.g., 'en-us' -> {code: 'en-us', ...}
  // Tidak perlu menandai shortCode di sini lagi, deteksi 404 akan lebih eksplisit
  // berdasarkan apakah slug awal URL adalah bagian dari validLangSlugs atau tidak.
});

// Daftar slug bahasa yang VALID dari konfigurasi i18nConfig
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

  let currentLocaleInPath = null; // Awalnya null, akan diset jika locale valid ditemukan
  let contentPathForLayout = '';
  let canonicalPathPrefix = '';

  // --- Logika Deteksi dan Pengembalian 404 ---
  if (rawSegments.length === 0) {
    // Jika URL adalah root (misal: http://localhost:3000/)
    // Ini adalah kasus khusus: arahkan ke defaultLocale untuk homepage
    // Atau bisa juga 404 jika Anda memaksa semua traffic ke /en-us/
    currentLocaleInPath = defaultLocale;
    canonicalPathPrefix = `/${defaultLocale}`;
    console.log('Middleware: Root URL. Using default locale:', defaultLocale);
  } else {
    const potentialLocaleSlug = rawSegments[0];

    // Cek apakah segmen pertama URL adalah slug bahasa yang VALID
    if (validLangSlugs.includes(potentialLocaleSlug)) {
      currentLocaleInPath = potentialLocaleSlug;
      contentPathForLayout = rawSegments.slice(1).length > 0 ? `/${rawSegments.slice(1).join('/')}` : '';
      canonicalPathPrefix = `/${currentLocaleInPath}`;
      console.log('Middleware: Valid locale code detected:', currentLocaleInPath);

    } else {
      // Jika segmen pertama BUKAN slug bahasa yang valid, kembalikan 404.
      // Ini akan menangani /villa, /apapun, /laoao, /vacad, dll.
      console.log(`Middleware: Invalid initial slug '${potentialLocaleSlug}'. Returning 404.`);
      return new NextResponse(null, { status: 404 });
    }
  }

  // --- Deteksi dan Penanganan Accept-Language (Untuk saran, tidak mengubah routing secara langsung) ---
  let preferredLocaleFromBrowser = defaultLocale;
  const acceptLanguageHeader = request.headers.get('accept-language');
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

    for (const browserPref of preferredLanguages) {
      const matchedConfig = i18nConfig.find(config => config.code === browserPref.code); // Hanya cocokkan dengan code penuh
      if (matchedConfig) {
        preferredLocaleFromBrowser = matchedConfig.code;
        break;
      }
      const genericLang = browserPref.code.split('-')[0];
      const genericLangConfig = i18nConfig.find(config => config.language === genericLang);
      if (genericLangConfig) {
        preferredLocaleFromBrowser = genericLangConfig.code;
        break;
      }
    }
  }

  // --- Persiapan Header untuk Layout ---
  const responseHeaders = new Headers(request.headers);

  // x-current-locale sekarang adalah locale yang benar yang harus digunakan oleh layout
  responseHeaders.set('x-current-locale', currentLocaleInPath); 
  responseHeaders.set('x-content-pathname', contentPathForLayout);
  // x-final-canonical-url akan selalu dibangun dari locale yang terdeteksi (yang valid)
  responseHeaders.set('x-final-canonical-url', `${request.nextUrl.origin}${canonicalPathPrefix}${contentPathForLayout}`);
  responseHeaders.set('x-preferred-locale-browser', preferredLocaleFromBrowser);

  console.log('Middleware: Continuing without redirect.');
  console.log('Middleware: Final X-Headers: ', {
      'x-current-locale': currentLocaleInPath,
      'x-content-pathname': contentPathForLayout,
      'x-canonical-path-prefix': canonicalPathPrefix, // Hanya untuk debugging log
      'x-final-canonical-url': `${request.nextUrl.origin}${canonicalPathPrefix}${contentPathForLayout}`,
      'x-preferred-locale-browser': preferredLocaleFromBrowser
  });
  console.log('--- Middleware Request End (Continue) ---');
  
  // Lanjutkan request ke komponen Next.js
  return NextResponse.next({
    request: {
      headers: responseHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Kecualikan api/static files/next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};