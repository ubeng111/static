// app/[lang]/page.jsx (Server Component for Home page)
import { getdictionary } from '@/dictionaries/get-dictionary';
import HomeContent from '@/components/home_1/HomeContent';

// Jika Anda ingin mengontrol revalidasi di level halaman ini,
// Anda bisa mengekspor konfigurasi revalidate.
// Ini akan memengaruhi data fetching dalam komponen ini.
export const revalidate = 31536000; // 1 tahun dalam detik

export async function generateMetadata({ params }) {
  const lang = params.lang || 'us'; // params sudah aman diakses langsung di metadata
  const dictionary = await getdictionary(lang);

  return {
    title: dictionary.metadata.homePageTitle,
    description: dictionary.metadata.homePageDescription,
    keywords: [
      "hotel deals",
      "travel affiliate",
      "cheap hotels",
      "best hotel booking site",
      "Hoteloza",
      "compare hotel prices",
      "book hotels online",
    ],
    openGraph: {
      title: dictionary.metadata.homePageTitle,
      description: dictionary.metadata.homePageDescription,
      url: "https://hoteloza.com",
      siteName: "Hoteloza",
      images: [
        {
          url: "https://hoteloza.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Hoteloza Hotel Booking Deals",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.metadata.homePageTitle,
      description: dictionary.metadata.homePageDescription,
      images: ["https://hoteloza.com/og-image.jpg"],
    },
  };
}

// Komponen halaman beranda utama (Ini adalah Server Component)
export default async function HomePage({ params }) {
  const lang = params.lang || 'us';
  const dictionary = await getdictionary(lang); // Asumsikan getdictionary mengambil data dengan fetch() yang memiliki opsi revalidate

  return (
    <>
      <HomeContent dictionary={dictionary} currentLang={lang} />
    </>
  );
}

// Untuk `[lang]`, Anda perlu memberi tahu Next.js bahasa apa saja yang harus dibuat secara statis.
// Ini mirip dengan getStaticPaths di Pages Router.
export async function generateStaticParams() {
  const languages = ['en', 'us', 'id']; // Daftar bahasa yang didukung Hoteloza
  return languages.map((lang) => ({
    lang: lang,
  }));
}