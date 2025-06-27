// app/[lang]/(hotel)/[categoryslug]/page.jsx

import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary';

// **TAMBAHKAN INI UNTUK ISR 1 TAHUN**
export const revalidate = 31536000; // 1 tahun dalam detik (60 * 60 * 24 * 365)

const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

async function getCategoryData(categoryslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug);
  if (!sanitizedCategory) {
    console.error('Invalid category slug:', categoryslug);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}`;

  try {
    // **Pastikan fetch() di sini adalah yang Native Web Fetch API**
    // Next.js akan secara otomatis mengaplikasikan revalidate yang diekspor di atas
    // ke panggilan fetch ini.
    const response = await fetch(apiUrl); 
    if (!response.ok) {
      console.error(`Failed to fetch category data for ${sanitizedCategory}. Status: ${response.status}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching category data:', error);
    return null;
  }
}

const ClientPage = dynamic(() => import('./ClientPage'));

export async function generateMetadata({ params }) {
  // params sudah objek langsung di App Router, tidak perlu await params
  const { categoryslug, lang: locale } = params; 

  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  // ... (sisa kode generateMetadata Anda)
  
  // Ambil data untuk metadata. Data ini juga akan di-cache sesuai `revalidate` di atas.
  const data = await getCategoryData(categoryslug); 
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: metadataDict.categoryNotFoundTitle || 'Category Not Found | Hoteloza',
      description: metadataDict.categoryNotFoundDescription || 'The requested category was not found on Hoteloza.',
    };
  }

  const formattedCategory = formatSlug(sanitizedCategory);
  const currentYear = new Date().getFullYear();

  return {
    title: (metadataDict.categoryPageTitleTemplate || `Best {formattedCategory} Discounts {currentYear} - Save Big on Hoteloza!`)
      .replace('{formattedCategory}', formattedCategory)
      .replace('{currentYear}', currentYear),
    description: (metadataDict.categoryPageDescriptionTemplate || `Find the best {formattedCategory} in {currentYear} with Hoteloza. Enjoy exclusive discounts, great prices, and premium amenities. Book now for an unforgettable stay!.`)
      .replace('{formattedCategory}', formattedCategory.toLowerCase())
      .replace('{currentYear}', currentYear),
    openGraph: {
      title: (metadataDict.categoryOgTitleTemplate || `Top {formattedCategory} Deals in {currentYear} | Hoteloza`)
        .replace('{formattedCategory}', formattedCategory)
        .replace('{currentYear}', currentYear),
      description: (metadataDict.categoryOgDescriptionTemplate || `Explore top {formattedCategory} for {currentYear} on Hoteloza. Book now for exclusive deals and premium amenities!`)
        .replace('{formattedCategory}', formattedCategory.toLowerCase())
        .replace('{currentYear}', currentYear),
      url: `https://hoteloza.com/${locale}/${sanitizedCategory}`,
      type: 'website',
    },
  };
}


// Komponen halaman utama
export default async function Page({ params }) {
  // params sudah objek langsung di App Router, tidak perlu await params
  const { categoryslug, lang: locale } = params; 

  const dictionary = await getdictionary(locale);

  const currentLang = locale;

  const sanitizedCategory = sanitizeSlug(categoryslug);

  if (!sanitizedCategory) {
    notFound();
  }

  // Data ini juga akan di-cache sesuai `revalidate` yang diekspor
  const data = await getCategoryData(categoryslug); 
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  // ... (sisa kode komponen Page Anda)

  return (
    <>
      <Script
        id="category-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <ClientPage categoryslug={sanitizedCategory} dictionary={dictionary} currentLang={currentLang} />
    </>
  );
}

// **Penting untuk Dynamic Routes di App Router:**
// Gunakan generateStaticParams untuk membuat path statis di build time (opsional).
// Jika generateStaticParams kosong atau tidak ada, Next.js akan default ke SSR (Server-Side Rendering)
// atau ISR dengan on-demand rendering (jika ada fetch() dengan revalidate).
// Namun, untuk ISR yang sebenarnya, Anda perlu mengontrol path.
export async function generateStaticParams() {
  // Anda harus mengembalikan semua `categoryslug` yang mungkin di sini.
  // Jika Anda memiliki ribuan kategori dan tidak ingin membangun semuanya saat build,
  // Anda bisa mengembalikan daftar kosong atau sebagian kecil,
  // dan biarkan Next.js melakukan on-demand rendering untuk sisanya.

  // Contoh: Mengambil semua kategori dari API Anda (ideal)
  // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  // const allCategoriesApiUrl = `${baseUrl}/api/all-categories`; // Endpoint API yang mengembalikan semua slug kategori
  // const response = await fetch(allCategoriesApiUrl);
  // const categories = await response.json();

  // return categories.map((catSlug) => ({
  //   categoryslug: sanitizeSlug(catSlug),
  // }));

  // Untuk demo atau jika Anda hanya punya beberapa, bisa hardcode
  const supportedCategories = ['hotel-discounts', 'luxury-hotels', 'budget-travel']; // Contoh
  const supportedLangs = ['en', 'us', 'id']; // Bahasa yang Anda dukung

  const params = [];
  for (const lang of supportedLangs) {
    for (const category of supportedCategories) {
      params.push({ lang: lang, categoryslug: category });
    }
  }
  return params;

  // Catatan: Jika generateStaticParams mengembalikan daftar kosong, Next.js akan menggunakan SSR secara default
  // untuk rute dinamis ini. Namun, karena Anda mengekspor `revalidate` di atas, Next.js akan
  // mencoba meng-cache dan me-revalidate konten berdasarkan pengaturan `revalidate`.
  // Perilaku fallback mirip Pages Router tidak sejelas itu di App Router.
}