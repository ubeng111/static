// app/[lang]/page.jsx (Server Component for Home page)
import { getdictionary } from '@/public/dictionaries/get-dictionary';
import HomeContent from '@/components/home_1/HomeContent'; // HomeContent tidak lagi merender Header11

export async function generateMetadata({ params }) {
  // Terapkan pola await untuk params sesuai rekomendasi Next.js
  // Meskipun params.lang mungkin langsung tersedia, meng-await memastikan konsistensi
  // di berbagai lingkungan runtime atau future updates Next.js.
  const awaitedParams = await params; // Ini adalah penyesuaian utama
  const lang = awaitedParams.lang || 'us'; // Akses properti setelah await
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
  const lang = await params.lang || 'us';
  const dictionary = await getdictionary(lang);

  return (
    <>
      {/* Panggil Header11 langsung di sini. Karena ia "use client",
          ia akan dihidrasi sebagai bagian dari ClientProviders.
          Catatan: Berdasarkan diskusi sebelumnya, Header11 seharusnya dirender di ClientProviders
          untuk cakupan global, bukan di setiap page.jsx.
          Jika Header11 ada di ClientProviders, Anda tidak perlu memanggilnya di sini.
      */}
      {/* HomeContent sekarang hanya merender bagian body halaman */}
      <HomeContent dictionary={dictionary} currentLang={lang} />
    </>
  );
}