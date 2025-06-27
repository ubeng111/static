// app/[lang]/(hotel)/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/[hotelslug]/page.jsx

import { notFound } from 'next/navigation';
import BookNow from '@/components/hotel-single/BookNow';
import ClientPage from './ClientPage';
import Script from 'next/script';
import { getdictionary } from '@/dictionaries/get-dictionary';

// **TAMBAHKAN INI UNTUK ISR 1 TAHUN**
export const revalidate = 31536000; // 1 tahun dalam detik (60 * 60 * 24 * 365)

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Function to fetch hotel data for both metadata and page content
async function getHotelData({ categoryslug, countryslug, stateslug, cityslug, hotelslug }) {
  const sanitizedParams = {
    categoryslug: categoryslug?.replace(/[^a-zA-Z0-9-]/g, '') || '',
    countryslug: countryslug?.replace(/[^a-zA-Z0-9-]/g, '') || '',
    stateslug: stateslug?.replace(/[^a-zA-Z0-9-]/g, '') || '',
    cityslug: cityslug?.replace(/[^a-zA-Z0-9-]/g, '') || '',
    hotelslug: hotelslug?.replace(/[^a-zA-Z0-9-]/g, '') || '',
  };

  // console.log('Sanitized parameters in getHotelData:', sanitizedParams); // Dihapus

  if (
    !sanitizedParams.categoryslug ||
    !sanitizedParams.countryslug ||
    !sanitizedParams.stateslug ||
    !sanitizedParams.cityslug ||
    !sanitizedParams.hotelslug
  ) {
    // console.error('Missing required parameters after sanitization:', sanitizedParams); // Dihapus
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/${sanitizedParams.categoryslug}/${sanitizedParams.countryslug}/${sanitizedParams.stateslug}/${sanitizedParams.cityslug}/${sanitizedParams.hotelslug}`;
  // console.log('Constructed API URL in getHotelData:', apiUrl); // Dihapus

  try {
    // **Pastikan fetch() di sini adalah yang Native Web Fetch API**
    // Next.js akan secara otomatis mengaplikasikan `revalidate` yang diekspor di atas
    // ke panggilan fetch ini.
    const response = await fetch(apiUrl);
    if (!response.ok) {
      // console.error( // Dihapus
      //   `Failed to fetch hotel data from API. Status: ${response.status} - ${response.statusText}`
      // );
      const errorBody = await response.text();
      // console.error('API Error Response Body:', errorBody); // Dihapus
      return null;
    }
    const data = await response.json();
    // console.log('Raw data received from API in getHotelData:', data); // Dihapus
    if (!data.hotel) {
      // console.error('API response is missing "hotel" property:', data); // Dihapus
      return null;
    }
    return data;
  } catch (error) {
    // console.error('Error in getHotelData during fetch or JSON parsing:', error); // Dihapus
    return null;
  }
}

export async function generateMetadata({ params }) {
  // --- PERBAIKI PENGGUNAAN PARAMS DI generateMetadata ---
  // `params` sudah objek langsung di App Router, tidak perlu await params
  const resolvedParams = params; // Tidak perlu await params lagi
  // --- AKHIR PERBAIKAN ---
  // console.log('Metadata params (after await):', resolvedParams); // Dihapus
  const { hotelslug, lang: locale } = resolvedParams;

  const dictionary = await getdictionary(locale);
  const metadataDict = dictionary?.metadata || {};
  const commonDict = dictionary?.common || {};

  try {
    // Data ini juga akan di-cache sesuai `revalidate` yang diekspor di atas.
    const data = await getHotelData(resolvedParams);
    if (!data || !data.hotel) {
      // console.log('Metadata: Hotel data is null or missing hotel property for:', hotelslug); // Dihapus
      const formattedHotel = formatSlug(hotelslug) || commonDict.unnamedHotel || 'Hotel';
      const formattedCity = formatSlug(resolvedParams.cityslug) || commonDict.unknownCity || 'City';
      return {
        title: metadataDict.hotelNotFoundTitle || `${formattedHotel}, ${formattedCity} - Hotel Not Found | Hoteloza`,
        description: metadataDict.hotelNotFoundDescription || `The hotel ${formattedHotel} in ${formattedCity} was not found on Hoteloza.`,
      };
    }

    const hotel = data.hotel;
    const formattedHotel = formatSlug(hotelslug) || hotel.title;
    const formattedCity = formatSlug(resolvedParams.cityslug) || hotel.city;
    const formattedState = formatSlug(resolvedParams.stateslug) || hotel.state;
    const formattedCountry = formatSlug(resolvedParams.countryslug) || hotel.country;
    const currentYear = new Date().getFullYear();

    return {
      title: (metadataDict.hotelPageTitleTemplate || `{hotelTitle} - Book Now on Hoteloza!`)
        .replace('{hotelTitle}', formattedHotel)
        .replace('{cityName}', formattedCity),
      description: (metadataDict.hotelPageDescriptionTemplate || `Book your stay at {hotelTitle} in {city}, {state}, {country}. Find the best deals, facilities, and reviews for an unforgettable experience with Hoteloza.`)
        .replace('{hotelTitle}', formattedHotel)
        .replace('{city}', formattedCity)
        .replace('{state}', formattedState)
        .replace('{country}', formattedCountry),
      alternates: {
        canonical: `https://hoteloza.com/${locale}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${hotelslug}`,
      },
      openGraph: {
        title: (metadataDict.hotelOgTitleTemplate || `{hotelTitle} | Hoteloza`)
          .replace('{hotelTitle}', formattedHotel),
        description: (metadataDict.hotelOgDescriptionTemplate || `Find the best deals at {hotelTitle} with Hoteloza.`)
          .replace('{hotelTitle}', formattedHotel),
        url: `https://hoteloza.com/${locale}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${hotelslug}`,
        images: [hotel.img || hotel.slideimg || ''],
      },
      twitter: {
        card: 'summary_large_image',
        title: (metadataDict.hotelOgTitleTemplate || `{hotelTitle} | Hoteloza`)
          .replace('{hotelTitle}', formattedHotel),
        description: (metadataDict.hotelOgDescriptionTemplate || `Find the best deals at {hotelTitle} with Hoteloza.`)
          .replace('{hotelTitle}', formattedHotel),
        images: [hotel.img || hotel.slideimg || ''],
      },
    };
  } catch (error) {
    // console.error('Error in generateMetadata (catch block):', error); // Dihapus
    return {
      title: metadataDict.hotelNotFoundTitle || `Hotel Not Found | Hoteloza`,
      description: commonDict.errorLoadingData || `The requested hotel could not be found due to an error.`,
    };
  }
}

export default async function HotelDetailPage({ params }) {
  // --- PERBAIKI PENGGUNAAN PARAMS DI KOMPONEN Page ---
  // `params` sudah objek langsung di App Router, tidak perlu await params
  const resolvedParams = params; // Tidak perlu await params lagi
  // --- AKHIR PERBAIKAN ---

  // console.log('Raw params received in HotelDetailPage (after await):', resolvedParams); // Dihapus
  // Data ini juga akan di-cache sesuai `revalidate` yang diekspor di atas.
  const data = await getHotelData(resolvedParams);

  // console.log('Data received from getHotelData in HotelDetailPage component:', data); // Dihapus
  const { lang: locale } = resolvedParams;
  const dictionary = await getdictionary(locale);

  const currentLang = locale;

  const commonDict = dictionary?.common || {};
  const navigationDict = dictionary?.navigation || {};

  if (!data || !data.hotel) {
    // console.error('Hotel data is missing or null in HotelDetailPage. Calling notFound(). Data:', data); // Dihapus
    notFound();
  }

  const hotel = data.hotel;
  const relatedHotels = data.relatedHotels;

  // console.log('Hotel object being passed to ClientPage:', hotel); // Dihapus

  const formattedHotel = formatSlug(resolvedParams.hotelslug) || hotel.title;
  const formattedCity = formatSlug(resolvedParams.cityslug) || hotel.city;
  const formattedState = formatSlug(resolvedParams.stateslug) || hotel.state;
  const formattedCountry = formatSlug(resolvedParams.countryslug) || hotel.country;
  const formattedCategory = formatSlug(resolvedParams.categoryslug) || hotel.category;
  const currentYear = new Date().getFullYear();

  // console.log('Value of resolvedParams.cityslug before passing to ClientPage:', resolvedParams.cityslug); // Dihapus

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': ['Hotel', 'LocalBusiness'],
      name: hotel.title || commonDict.unnamedHotel || 'Unnamed Hotel',
      description: hotel.description || `Book ${formattedHotel}, a luxury hotel in ${formattedCity} for ${currentYear} on Hoteloza.`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: hotel.city || commonDict.unknownCity || 'Unknown City',
        addressRegion: hotel.state || commonDict.unknownState || 'Unknown Region',
        addressCountry: hotel.country || commonDict.unknownCountry || 'Unknown Country',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: parseFloat(hotel.latitude) || 0,
        longitude: parseFloat(hotel.longitude) || 0,
      },
      image: hotel.img || hotel.slideimg || '',
      numberOfRooms: parseInt(hotel.numberofrooms) || 0,
      telephone: hotel.telephone || '',
      email: hotel.email || '',
      priceRange: hotel.priceRange || '$$$',
      checkinTime: hotel.checkinTime || '15:00',
      checkoutTime: hotel.checkoutTime || '11:00',
      url: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}`,
      // --- PERBAIKAN PENTING DI SINI: Conditional AggregateRating ---
      ...(parseInt(hotel.numberofreviews) > 0 && { // Hanya tambahkan aggregateRating jika reviewCount > 0
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: parseFloat(hotel.ratings).toFixed(1),
          bestRating: 10,
          worstRating: 1,
          reviewCount: parseInt(hotel.numberofreviews), // Pastikan ini sudah berupa angka yang valid dari DB
        },
      }),
      // --- AKHIR PERBAIKAN ---
      ...(hotel.starRating && {
        starRating: {
          '@type': 'Rating',
          ratingValue: parseFloat(hotel.starRating),
          bestRating: 5,
        },
      }),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: navigationDict.home || 'Home', item: `https://hoteloza.com/${currentLang}` },
        {
          '@type': 'ListItem',
          position: 2,
          name: formatSlug(resolvedParams.categoryslug) || formattedCategory,
          item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: formatSlug(resolvedParams.countryslug) || formattedCountry,
          item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: formatSlug(resolvedParams.stateslug) || formattedState,
          item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: formatSlug(resolvedParams.cityslug) || formattedCity,
          item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}`,
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: hotel.title || formattedHotel,
          item: `https://hoteloza.com/${currentLang}/${resolvedParams.categoryslug}/${resolvedParams.countryslug}/${resolvedParams.stateslug}/${resolvedParams.cityslug}/${resolvedParams.hotelslug}`,
        },
      ],
    },
  ];

  return (
    <>
      <Script
        id="hotel-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <BookNow hotel={data.hotel} hotelId={data.hotel?.id} dictionary={dictionary} />
      <ClientPage
        hotel={hotel}
        relatedHotels={relatedHotels}
        useHotels2={true}
        hotelslug={resolvedParams.hotelslug}
        categoryslug={resolvedParams.categoryslug}
        countryslug={resolvedParams.countryslug}
        stateslug={resolvedParams.stateslug}
        cityslug={resolvedParams.cityslug}
        dictionary={dictionary}
        currentLang={currentLang}
      />
    </>
  );
}

// **Penting untuk Dynamic Routes di App Router:**
// Anda harus mengembalikan semua kombinasi slug yang mungkin
// untuk dibangun secara statis saat waktu build.
// Jika Anda memiliki terlalu banyak kombinasi (misalnya jutaan hotel),
// Anda bisa mengembalikan daftar kosong atau sebagian kecil,
// dan Next.js akan merender halaman secara on-demand.
export async function generateStaticParams() {
  // Contoh: Ambil daftar kategori, negara, provinsi, kota, dan hotel dari API.
  // Ini harus diganti dengan panggilan API aktual yang mengembalikan semua slug
  // yang valid dari backend Anda.

  const allCategories = ['hotel-discounts', 'luxury-hotels']; // Contoh slug kategori
  const allCountries = ['indonesia', 'malaysia']; // Contoh slug negara
  const allStates = ['bali', 'jakarta']; // Contoh slug provinsi/negara bagian
  const allCities = ['denpasar', 'ubud']; // Contoh slug kota
  const allHotels = ['hotel-grand-bali', 'hotel-bintang-ubud']; // Contoh slug hotel

  const supportedLangs = ['en', 'us', 'id']; // Bahasa yang Anda dukung

  const params = [];
  for (const lang of supportedLangs) {
    for (const category of allCategories) {
      for (const country of allCountries) {
        for (const state of allStates) {
          for (const city of allCities) {
            for (const hotel of allHotels) {
              params.push({
                lang: lang,
                categoryslug: category,
                countryslug: country,
                stateslug: state,
                cityslug: city,
                hotelslug: hotel,
              });
            }
          }
        }
      }
    }
  }
  return params;

  // Catatan: Jika Anda memiliki jutaan kombinasi, mengembalikan daftar kosong dari
  // generateStaticParams (`return [];`) akan membuat Next.js tidak membangun halaman ini saat build time.
  // Halaman akan dirender secara on-demand saat permintaan pertama.
  // Pastikan `revalidate` diekspor di level `page.jsx` agar on-demand render tersebut
  // tetap memanfaatkan caching dan revalidasi Next.js.
  // Contoh:
  // return [];
}