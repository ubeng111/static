// app/[lang]/(hotel)/[categoryslug]/page.jsx

// Hapus dynamic import 'next/dynamic' dari sini, karena tidak lagi diperlukan di Server Component ini
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Suspense } from 'react'; // Pastikan Suspense diimpor
import { getdictionary } from '@/dictionaries/get-dictionary';

// Import ClientPage secara langsung karena ClientPage sekarang adalah Client Component dengan 'use client;'
import ClientPage from './ClientPage';


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
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`Failed to fetch category data for ${sanitizedCategory}. Status: ${response.status} - ${response.statusText}`);
      return null;
    }
    // Mengembalikan response.json() secara langsung dari API.
    // Ini akan menjadi `initialData` untuk ClientPage.
    return response.json();
  } catch (error) {
    console.error('Error fetching category data:', error);
    return null;
  }
}

// Hapus const ClientPage = dynamic(() => import('./ClientPage'), { ssr: false, }); dari sini.
// Itu adalah penyebab errornya.


export async function generateMetadata({ params }) {
  const { categoryslug, lang: locale } = params;

  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};

  const sanitizedCategory = sanitizeSlug(categoryslug);

  // Fetch data untuk metadata, ini juga akan di-cache
  const data = await getCategoryData(categoryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    console.warn(`generateMetadata: No hotels found for category slug: ${categoryslug}.`);
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
    alternates: {
      canonical: `https://hoteloza.com/${locale}/${sanitizedCategory}`,
      languages: {
        'en-US': `https://hoteloza.com/en/${sanitizedCategory}`,
        'id-ID': `https://hoteloza.com/id/${sanitizedCategory}`,
        'x-default': `https://hoteloza.com/en/${sanitizedCategory}`,
      },
    },
  };
}


export default async function Page({ params }) {
  const { categoryslug, lang: locale } = params;

  const dictionary = await getdictionary(locale);

  const currentLang = locale;

  const sanitizedCategory = sanitizeSlug(categoryslug);

  if (!sanitizedCategory) {
    notFound();
  }

  // Fetch data untuk konten halaman, ini akan menggunakan cache jika revalidate aktif
  const data = await getCategoryData(categoryslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  const schemas = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": formatSlug(sanitizedCategory),
    "description": `Find the best deals for ${formatSlug(sanitizedCategory)} on Hoteloza.`,
    "url": `https://hoteloza.com/${locale}/${sanitizedCategory}`
  };

  return (
    <>
      <Script
        id="category-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      {/* Bungkus ClientPage dengan Suspense untuk menampilkan fallback saat loading */}
      <Suspense fallback={<div>Memuat konten kategori...</div>}>
        {/* Pass initialData ke ClientPage */}
        <ClientPage categoryslug={sanitizedCategory} dictionary={dictionary} currentLang={currentLang} initialData={data} />
      </Suspense>
    </>
  );
}

export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  try {
    const categoriesResponse = await fetch(`${baseUrl}/api/all-categories`, { next: { revalidate: 3600 } });
    const categories = categoriesResponse.ok ? await categoriesResponse.json() : [];

    const languagesResponse = await fetch(`${baseUrl}/api/supported-languages`, { next: { revalidate: 3600 } });
    const languages = languagesResponse.ok ? await languagesResponse.json() : ['en', 'us', 'id'];

    const params = [];
    for (const lang of languages) {
      for (const category of categories) {
        params.push({ lang: lang, categoryslug: sanitizeSlug(category) });
      }
    }
    return params;
  } catch (error) {
    console.error("Error fetching dynamic params for generateStaticParams:", error);
    const fallbackCategories = ['hotel-discounts', 'luxury-hotels', 'budget-travel'];
    const fallbackLangs = ['en', 'us', 'id'];
    const params = [];
    for (const lang of fallbackLangs) {
      for (const category of fallbackCategories) {
        params.push({ lang: lang, categoryslug: category });
      }
    }
    return params;
  }
}