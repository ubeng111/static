// middleware.js
import { NextResponse } from 'next/server';
import { i18nConfig, defaultLocale } from './config/i18n';

// validLangSlugs akan berisi kode negara seperti 'us', 'es', 'cn', 'hk', dll.
const validLangSlugs = i18nConfig.map(config => config.code);

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  // Lewati semua internal path Next.js (_next), file statis (misalnya /favicon.ico),
  // dan API routes
  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const rawSegments = pathname.split('/').filter(Boolean); // e.g., ['us', 'us', 'villa', 'indonesia']

  let targetLocale = defaultLocale; // Locale yang seharusnya ada di awal URL
  let pureContentSegments = []; // Segmen jalur yang murni konten, setelah normalisasi

  let foundInitialLocale = false;

  // Iterasi melalui segmen untuk mengekstrak targetLocale yang benar
  // dan membangun pureContentSegments tanpa locale yang berulang di awal.
  for (let i = 0; i < rawSegments.length; i++) {
    const segment = rawSegments[i];

    if (!foundInitialLocale) {
      // Jika kita belum menemukan locale awal
      if (validLangSlugs.includes(segment)) {
        targetLocale = segment; // Ini adalah locale utama yang kita inginkan
        foundInitialLocale = true;
      } else {
        // Jika segmen pertama BUKAN locale yang valid, berarti itu adalah bagian dari konten.
        // URL akan dimulai dengan defaultLocale, diikuti oleh konten ini.
        pureContentSegments.push(segment);
      }
    } else {
      // Kita SUDAH menemukan locale awal.
      // Semua segmen berikutnya, BAHKAN JIKA MEREKA KODE NEGARA YANG VALID,
      // akan diperlakukan sebagai bagian dari jalur konten.
      pureContentSegments.push(segment);
    }
  }

  // Tangani kasus di mana tidak ada locale valid ditemukan di path (misal: '/' atau '/villa')
  if (!foundInitialLocale && rawSegments.length === 0) {
      targetLocale = defaultLocale;
  } else if (!foundInitialLocale && rawSegments.length > 0) {
      // Jika path seperti '/villa/indonesia' (tanpa locale di awal),
      // maka defaultLocale akan digunakan dan 'villa/indonesia' menjadi contentPath.
      targetLocale = defaultLocale; // Pastikan menggunakan defaultLocale
      // pureContentSegments sudah terisi dengan rawSegments jika ini kasusnya
  }


  // Bangun jalur URL yang dinormalisasi: /{targetLocale}/{pureContentPath}
  // Ini akan memastikan struktur URL yang konsisten dan mengatasi duplikasi yang tidak sah di awal.
  const normalizedPathname = `/${targetLocale}${pureContentSegments.length > 0 ? `/${pureContentSegments.join('/')}` : ''}`;

  // Lakukan redirect jika URL saat ini tidak sama dengan URL yang dinormalisasi.
  if (pathname !== normalizedPathname) {
    const newUrl = new URL(`${normalizedPathname}${search}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Jika URL sudah dinormalisasi, lanjutkan request.
  return NextResponse.next();
}

export const config = {
  // Matcher untuk semua path kecuali API, _next, dan file statis
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};