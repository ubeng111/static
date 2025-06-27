// app/[lang]/(others)/about/page.jsx
// Asumsi: Struktur folder Anda adalah app/[lang]/(others)/about/page.jsx
// untuk memungkinkan akses params.lang dari URL.

import { getdictionary } from '@/dictionaries/get-dictionary';
// Hapus dynamic import 'next/dynamic' dari sini
import { Suspense } from 'react'; // Import Suspense

import { defaultLocale, defaultDictionaryCode, i18nConfig } from '@/config/i18n';

// Import Client.jsx secara langsung. Karena Client.jsx memiliki 'use client;',
// ia akan menjadi Client Component dan dihidrasi di browser.
import Client from './Client'; // Import komponen Client

// **TAMBAHKAN INI UNTUK ISR 1 TAHUN**
export const revalidate = 31536000; // 1 tahun dalam detik (60 * 60 * 24 * 365)

// Hapus dynamic import ClientPageDynamic dari sini. Ini adalah penyebab errornya.


// Gunakan generateMetadata untuk metadata dinamis berdasarkan `lang`
export async function generateMetadata({ params }) {
  const lang = params?.lang || defaultDictionaryCode; // Ambil lang dari params atau gunakan default
  const dictionary = await getdictionary(lang);

  const baseUrl = 'https://hoteloza.com'; // Sesuaikan dengan base URL situs Anda

  // Canonical URL untuk halaman About
  const canonicalPath = `/${lang}/about`;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  // Membuat daftar semua versi bahasa (hreflang) untuk halaman ini
  const languages = {};
  i18nConfig.forEach(config => {
    languages[config.code] = `${baseUrl}/${config.code}/about`;
  });

  return {
    title: dictionary.metadata.aboutPageTitle || "About Us - Hoteloza", // Menggunakan dictionary untuk judul
    description: dictionary.metadata.aboutPageDescription || "Learn more about Hoteloza and our mission to provide the best travel and accommodation management application.", // Menggunakan dictionary
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languages,
        'x-default': `${baseUrl}/${defaultLocale}/about`, // x-default menunjuk ke versi default
      },
    },
    openGraph: {
      title: dictionary.metadata.aboutPageTitle || "About Us - Hoteloza",
      description: dictionary.metadata.aboutPageDescription || "Learn more about Hoteloza.",
      url: canonicalUrl,
      siteName: "Hoteloza",
      images: [
        {
          url: `${baseUrl}/opengraph-image-about.jpg`, // Ganti dengan gambar spesifik halaman About
          width: 1200,
          height: 630,
          alt: dictionary.metadata.aboutPageTitle || "About Hoteloza",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.metadata.aboutPageTitle || "About Us - Hoteloza",
      description: dictionary.metadata.aboutPageDescription || "Learn more about Hoteloza.",
      images: [`${baseUrl}/twitter-image-about.jpg`],
    },
    keywords: [
      "about Hoteloza",
      "Hoteloza mission",
      "travel company",
      "accommodation management",
      "hotel booking platform",
      "our story"
    ],
  };
}

export default async function AboutPage({ params }) {
  const lang = params?.lang || defaultDictionaryCode;

  const dictionary = await getdictionary(lang);

  return (
    // Bungkus Client (sekarang diimpor langsung) dengan Suspense
    <Suspense fallback={<div>Memuat halaman About...</div>}>
      <Client dictionary={dictionary} currentLang={lang} />
    </Suspense>
  );
}