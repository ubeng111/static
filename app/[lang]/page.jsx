// app/[lang]/page.jsx
import { getdictionary } from '@/dictionaries/get-dictionary';
import Home1 from '@/components/home_1/Home1';
import { Suspense } from 'react';

// Import atau definisikan URL API base Anda
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const revalidate = 31536000;

export async function generateMetadata({ params }) {
  const lang = params.lang || 'us';
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

export default async function HomePage({ params }) {
  const lang = params.lang || 'us';
  const dictionary = await getdictionary(lang);

  return (
    <>
      <Suspense fallback={<div>Memuat konten beranda...</div>}>
        <Home1 dictionary={dictionary} currentLang={lang} />
      </Suspense>
    </>
  );
}

export async function generateStaticParams() {
  let languages = ['en', 'us', 'id']; // Fallback default jika fetch gagal

  try {
    // Asumsikan ada endpoint API yang mengembalikan daftar bahasa yang didukung
    const response = await fetch(`${API_BASE_URL}/api/supported-languages`, {
      // Pastikan cache control untuk fetch di generateStaticParams
      // Anda mungkin ingin menonaktifkan cache atau mengatur revalidasi spesifik di sini
      next: { revalidate: 3600 } // Contoh: revalidate setiap jam jika daftar bahasa bisa berubah
    });

    if (!response.ok) {
      console.warn(`Failed to fetch supported languages, using default. Status: ${response.status}`);
      // Lanjutkan dengan bahasa default jika fetch gagal
      return languages.map((lang) => ({ lang: lang }));
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      languages = data; // Gunakan data dari API jika valid
    } else {
      console.warn('API returned empty or invalid language list, using default.');
    }
  } catch (error) {
    console.error("Error fetching supported languages for generateStaticParams:", error);
    // Jika ada error jaringan, tetap gunakan bahasa default
  }

  return languages.map((lang) => ({
    lang: lang,
  }));
}