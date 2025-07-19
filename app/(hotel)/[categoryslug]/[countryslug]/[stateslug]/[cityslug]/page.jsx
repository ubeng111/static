// page.jsx (City)
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import contentTemplates from '@/utils/contentTemplates'; // Import template konten
import Script from 'next/script'; // Import Script component

// Helper function to sanitize slugs
const sanitizeSlug = (slug) => slug?.replace(/[^a-zA-Z0-9-]/g, '');

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch city data
async function getCityData(categoryslug, countryslug, stateslug, cityslug) {
  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);
  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    console.error('Invalid slugs:', { categoryslug, countryslug, stateslug, cityslug });
    return null;
  }

  // PENTING: PASTIKAN NEXT_PUBLIC_API_BASE_URL di VPS Anda sudah disetel ke https://hoteloza.com atau URL API Anda yang benar
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`;

  try {
    // Mengubah 'cache: no-store' menjadi ISR dengan revalidate 1 tahun (31.536.000 detik)
    const response = await fetch(apiUrl, { next: { revalidate: 31536000 } });
    if (!response.ok) {
      if (response.status === 404) {
          console.warn(`Failed to fetch city data: 404 Not Found for ${apiUrl}`);
      } else {
          console.error(`Failed to fetch city data for ${apiUrl}. Status: ${response.status} - ${response.statusText}`);
      }
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching city data:', error);
    return null;
  }
}

const ClientPage = dynamic(() => import('./ClientPage'));

// ------ PERBAIKAN: Mengambil slug kota secara dinamis dari database melalui API ------
export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Pastikan ini sudah benar di lingkungan VPS Anda!
  if (!baseUrl) {
    console.error("ERROR: NEXT_PUBLIC_API_BASE_URL is not defined for generateStaticParams. Cannot fetch city paths.");
    return []; // Mengembalikan array kosong jika tidak terdefinisi
  }

  try {
    // Memanggil API Route yang Anda buat untuk mendapatkan semua path kota
    const response = await fetch(`${baseUrl}/api/all-city-paths`, {
      // Gunakan 'no-store' agar selalu mengambil data terbaru saat build atau revalidate
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch all city paths. Status: ${response.status} - ${response.statusText}`);
      // Melemparkan error agar build gagal jika pengambilan data path penting.
      // Ini membantu mencegah 404 massal di produksi.
      throw new Error(`Failed to fetch all city paths during build: ${response.statusText}`);
    }

    const paths = await response.json();
    
    // Memastikan `paths` adalah array objek dengan properti yang sesuai
    // Contoh format yang diharapkan: [{ categoryslug: '...', countryslug: '...', stateslug: '...', cityslug: '...' }, ...]
    if (!Array.isArray(paths) || paths.some(p => 
      !p.categoryslug || !p.countryslug || !p.stateslug || !p.cityslug
    )) {
      console.error("Fetched city paths are not in the expected format for generateStaticParams:", paths);
      return []; // Mengembalikan array kosong jika format data salah
    }

    console.log(`SERVER DEBUG [page.jsx - generateStaticParams]: Successfully fetched ${paths.length} city paths.`);
    return paths;

  } catch (error) {
    console.error('SERVER FATAL ERROR [page.jsx - generateStaticParams]: Error fetching static paths for cities:', error);
    // Mengembalikan array kosong jika ada error fatal, akan menyebabkan 404 untuk halaman kota
    return [];
  }
}
// --------------------------------------------------------------------------

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const { categoryslug, countryslug, stateslug, cityslug } = awaitedParams;

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);

  const currentUrl = `https://hoteloza.com/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`;

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category, country, state, or city was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  const data = await getCityData(categoryslug, countryslug, stateslug, cityslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    return {
      title: 'Page Not Found | Hoteloza',
      description: 'The requested category, country, state, or city was not found on Hoteloza.',
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  const formattedCity = data.hotels[0]?.kota ? formatSlug(data.hotels[0].kota) : formatSlug(sanitizedCity) || 'City';
  const formattedState = data.hotels[0]?.['negara bagian'] ? formatSlug(data.hotels[0]['negara bagian']) : formatSlug(sanitizedState) || 'State';
  const formattedCountry = data.hotels[0]?.country ? formatSlug(data.hotels[0].country) : formatSlug(sanitizedCountry) || 'Country';
  const formattedCategory = data.hotels[0]?.category ? formatSlug(data.hotels[0].category) : formatSlug(sanitizedCategory) || 'Category';
  const currentYear = new Date().getFullYear();

  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    formattedCategory,
    'city',
    formattedCity,
    formattedCity,
    formattedState,
    formattedCountry
  );

  const firstParagraphContent = longDescriptionSegments[0]?.content || '';
  const metaDescription = firstParagraphContent.substring(0, 160) + (firstParagraphContent.length > 160 ? '...' : '');

  return {
    title: `Best ${formattedCategory} in ${formattedCity}, ${formattedState} ${currentYear} - Book Now! | Hoteloza`,
    description: metaDescription,
    openGraph: {
      title: `Top ${formattedCategory} in ${formattedCity}, ${formattedState} ${currentYear} | Hoteloza`,
      description: metaDescription,
      url: currentUrl,
      type: 'website',
    },
    alternates: {
      canonical: currentUrl,
    },
  };
}

export default async function Page({ params }) {
  const awaitedParams = await params;
  const { categoryslug, countryslug, stateslug, cityslug } = awaitedParams;

  const sanitizedCategory = sanitizeSlug(categoryslug);
  const sanitizedCountry = sanitizeSlug(countryslug);
  const sanitizedState = sanitizeSlug(stateslug);
  const sanitizedCity = sanitizeSlug(cityslug);

  if (!sanitizedCategory || !sanitizedCountry || !sanitizedState || !sanitizedCity) {
    notFound();
  }

  const data = await getCityData(categoryslug, countryslug, stateslug, cityslug);
  if (!data || !data.hotels || data.hotels.length === 0) {
    notFound();
  }

  const formattedCity = data.hotels[0]?.kota ? formatSlug(data.hotels[0].kota) : formatSlug(sanitizedCity) || 'City';
  const formattedState = data.hotels[0]?.['negara bagian'] ? formatSlug(data.hotels[0]['negara bagian']) : formatSlug(sanitizedState) || 'State';
  const formattedCountry = data.hotels[0]?.country ? formatSlug(data.hotels[0].country) : formatSlug(sanitizedCountry) || 'Country';
  const formattedCategory = data.hotels[0]?.category ? formatSlug(data.hotels[0].category) : formatSlug(sanitizedCategory) || 'Category';
  const currentYear = new Date().getFullYear();

  const baseUrl = 'https://hoteloza.com';
  const currentUrl = `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}`;

  const longDescriptionSegments = contentTemplates.getGeoCategoryDescription(
    formattedCategory,
    'city',
    formattedCity,
    formattedCity,
    formattedState,
    formattedCountry
  );

  const schemaDescription = longDescriptionSegments.map(segment => segment.content).join(' ');

  const hotelItems = data.hotels.map((hotel, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Hotel',
      name: hotel.name || hotel.title || 'Unnamed Hotel',
      url: hotel.hotelslug ? `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}/${sanitizedCity}/${hotel.hotelslug}` : `${currentUrl}/${hotel.id || index + 1}`,
      image: hotel.img || hotel.slideimg || '',
      address: {
        '@type': 'PostalAddress',
        streetAddress: hotel.lokasi || 'Unknown Address',
        addressLocality: hotel.kota ? formatSlug(hotel.kota) : formattedCity || 'Unknown City',
        addressRegion: hotel['negara bagian'] ? formatSlug(hotel['negara bagian']) : formattedState || 'Unknown Region',
        addressCountry: hotel.country ? formatSlug(hotel.country) : formattedCountry || 'Unknown Country',
      },
      description: hotel.description || hotel.overview || `A ${formattedCategory.toLowerCase()} in ${formattedCity}, ${formattedState}.`,
    },
  }));

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: currentUrl,
        name: `Top ${formattedCategory} in ${formattedCity}, ${formattedState} ${currentYear}`,
        description: schemaDescription,
        publisher: {
          '@type': 'Organization',
          name: 'Hoteloza',
          logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: formattedCategory, item: `${baseUrl}/${sanitizedCategory}` },
          { '@type': 'ListItem', position: 3, name: formattedCountry, item: `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}` },
          { '@type': 'ListItem', position: 4, name: formattedState, item: `${baseUrl}/${sanitizedCategory}/${sanitizedCountry}/${sanitizedState}` },
          { '@type': 'ListItem', position: 5, name: formattedCity, item: currentUrl },
        ],
      },
      {
        '@type': 'ItemList',
        name: `Top ${formattedCategory} in ${formattedCity}, ${formattedState}`,
        description: schemaDescription.substring(0, 160) + '...',
        itemListElement: hotelItems,
      },
    ],
  };

  return (
    <>
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      <ClientPage
        categoryslug={sanitizedCategory}
        countryslug={sanitizedCountry}
        stateslug={sanitizedState}
        cityslug={sanitizedCity}
        formattedCategory={formattedCategory}
        formattedCity={formattedCity}
        formattedState={formattedState}
        formattedCountry={formattedCountry}
        longDescriptionSegments={longDescriptionSegments}
      />
    </>
  );
}