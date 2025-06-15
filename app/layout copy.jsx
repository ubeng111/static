// app/layout.jsx
import ClientProviders from "@/components/ClientProviders";
import { getdictionary } from '@/dictionaries/get-dictionary';
import { headers } from 'next/headers';
import { locales, defaultLocale, i18nConfig } from '@/config/i18n'; // Import dari i18n.js

// Import CSS global
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/index.scss";

export default async function RootLayout({ children }) {
  const headersList = headers();
  const acceptLanguage = await headersList.get('accept-language') || 'en-US';
  const browserLangPref = acceptLanguage.split(',')[0].split('-')[0].toLowerCase(); // e.g., 'en', 'es', 'af'

  // Cari countryCode yang cocok di i18nConfig
  const matchedLangConfig = i18nConfig.find(config =>
    config.countryCode === browserLangPref || config.code.startsWith(browserLangPref + '-')
  );

  // Gunakan countryCode yang cocok, atau defaultLocale jika tidak ada yang cocok
  const initialLangSlug = matchedLangConfig ? matchedLangConfig.countryCode : defaultLocale;

  // Debugging di Server Component
  console.log('Layout: Accept-Language Header:', acceptLanguage);
  console.log('Layout: Detected Browser Lang Pref:', browserLangPref);
  console.log('Layout: Determined initialLangSlug:', initialLangSlug);


  const dictionary = await getdictionary(initialLangSlug);

  // Debugging dictionary load
  console.log('Layout: Loaded dictionary for:', initialLangSlug);
  console.log('Layout: Footer section of dictionary:', dictionary?.footer); // Periksa objek footer

  return (
    <html lang={initialLangSlug}>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          name="google-site-verification"
          content="2CUKI9cYViNxYurFPrRO39L2Qg9DHlUUu6mJsskuVg"
        />
      </head>
      <body>
        <ClientProviders dictionary={dictionary} initialLangSlug={initialLangSlug}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}