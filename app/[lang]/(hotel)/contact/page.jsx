// app/[lang]/(others)/contact/page.jsx
// Asumsi: Struktur folder Anda adalah app/[lang]/(others)/contact/page.jsx
// untuk memungkinkan akses params.lang dari URL.

import { getdictionary } from '@/dictionaries/get-dictionary';
import { Suspense } from 'react'; // Import Suspense
import { defaultLocale, defaultDictionaryCode, i18nConfig } from '@/config/i18n';

// Import Client.jsx secara langsung. Karena Client.jsx memiliki 'use client;',
// ia akan menjadi Client Component dan dihidrasi di browser.
import Client from './Client';


// **TAMBAHKAN INI UNTUK ISR 1 TAHUN**
export const revalidate = 31536000; // 1 tahun dalam detik (60 * 60 * 24 * 365)


// Gunakan generateMetadata untuk metadata dinamis berdasarkan `lang`
export async function generateMetadata({ params }) {
  const lang = params?.lang || defaultDictionaryCode;
  const dictionary = await getdictionary(lang);

  const baseUrl = 'https://hoteloza.com';

  const canonicalPath = `/${lang}/contact`;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  const languages = {};
  i18nConfig.forEach(config => {
    languages[config.code] = `${baseUrl}/${config.code}/contact`;
  });

  return {
    title: dictionary.metadata.contactPageTitle || "Contact Us - Hoteloza",
    description: dictionary.metadata.contactPageDescription || "Get in touch with Hoteloza for inquiries, support, and feedback.",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languages,
        'x-default': `${baseUrl}/${defaultLocale}/contact`,
      },
    },
    openGraph: {
      title: dictionary.metadata.contactPageTitle || "Contact Us - Hoteloza",
      description: dictionary.metadata.contactPageDescription || "Get in touch with Hoteloza.",
      url: canonicalUrl,
      siteName: "Hoteloza",
      images: [
        {
          url: `${baseUrl}/opengraph-image-contact.jpg`,
          width: 1200,
          height: 630,
          alt: dictionary.metadata.contactPageTitle || "Contact Hoteloza",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.metadata.contactPageTitle || "Contact Us - Hoteloza",
      description: dictionary.metadata.contactPageDescription || "Get in touch with Hoteloza.",
      images: [`${baseUrl}/twitter-image-contact.jpg`],
    },
    keywords: [
      "contact Hoteloza",
      "Hoteloza support",
      "customer service",
      "contact us",
      "feedback",
      "inquiries",
      "help"
    ],
  };
}

export default async function ContactPage({ params }) {
  const lang = params?.lang || defaultDictionaryCode;

  const dictionary = await getdictionary(lang);

  console.log("SERVER: Dictionary loaded for contact page:", dictionary);
  console.log("SERVER: contactPageDict section:", dictionary?.contactPage);
  console.log("SERVER: navigationDict section:", dictionary?.navigation);
  console.log("SERVER: footerDict section:", dictionary?.footer);

  return (
    // Bungkus Client (sekarang diimpor langsung) dengan Suspense
    <Suspense fallback={<div>Memuat halaman kontak...</div>}>
      <Client dictionary={dictionary} currentLang={lang} />
    </Suspense>
  );
}