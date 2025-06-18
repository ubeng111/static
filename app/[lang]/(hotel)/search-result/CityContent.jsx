// CityContent.jsx
"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useEffect, useState, useCallback } from "react"; // Tambahkan useCallback

// --- MODIFIKASI: Impor Komponen Secara Dinamis (next/dynamic) ---
import dynamic from 'next/dynamic';

const DynamicPaginationComponent = dynamic(() => import('@/components/hotel-list/hotel-list-v5/PaginationComponent'), {
  ssr: false,
  loading: () => <p>Loading pagination...</p>,
});
const DynamicHotelProperties88 = dynamic(() => import("@/components/hotel-list/hotel-list-v5/HotelProperties88"), {
  ssr: false,
  loading: () => <p>Loading hotel properties...</p>,
});
const DynamicFaqcity = dynamic(() => import("@/components/faq/Faqcity"), {
  ssr: false,
  loading: () => <p>Loading FAQs...</p>,
});
const DynamicFooter = dynamic(() => import("@/components/footer"), {
  ssr: false,
  loading: () => <p>Loading footer...</p>,
});
const DynamicCallToActions = dynamic(() => import("@/components/common/CallToActions"), {
  ssr: false,
  loading: () => <p>Loading call to actions...</p>,
});
const DynamicHeader11 = dynamic(() => import("@/components/header/header-11"), {
  ssr: false,
  loading: () => <p>Loading header...</p>,
});

// --- AKHIR MODIFIKASI next/dynamic ---


// SWR fetcher function
const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gagal mengambil data: ${errorData.message || "Kesalahan tidak diketahui"}`);
  }
  return response.json();
};

// Menerima initialCityId, initialPage, dictionary, dan currentLang sebagai props
export default function CityContent({ initialCityId, initialPage, dictionary, currentLang }) {
  // Gunakan state lokal untuk cityId dan page yang akan diupdate oleh useSearchParams
  const [currentCityId, setCurrentCityId] = useState(initialCityId);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // useSearchParams hanya akan dieksekusi di sisi klien
  const searchParams = useSearchParams();

  // useEffect untuk sinkronisasi searchParams ke state lokal setelah hidrasi
  useEffect(() => {
    const newCityId = searchParams.get("city_id");
    const newPage = parseInt(searchParams.get("page")) || 1;

    // Hanya update state jika berbeda dari nilai awal atau yang ada
    if (newCityId !== currentCityId) {
      setCurrentCityId(newCityId);
    }
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  }, [searchParams, currentCityId, currentPage]);


  // SWR hook for data fetching, menggunakan state lokal
  const { data, error, isLoading } = useSWR(
    currentCityId ? `/api/city?city_id=${encodeURIComponent(currentCityId)}&page=${currentPage}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
      // Opsional: initialData untuk SWR jika Anda memiliki data awal dari server
      // initialData: { hotels: [], pagination: { page: initialPage, totalPages: 1, totalHotels: 0 } }
    }
  );

  const hotels = data?.hotels || [];
  const pagination = data?.pagination || { page: currentPage, totalPages: 1, totalHotels: 0 }; // Gunakan currentPage di pagination

  const handlePageClick = useCallback((event) => { // Gunakan useCallback
    const newPage = event.selected + 1;
    if (newPage === pagination.page) return; // Prevent unnecessary updates

    const newUrl = new URL(window.location);
    newUrl.searchParams.set("page", newPage);
    window.history.pushState({}, "", newUrl.toString()); // Gunakan newUrl.toString()
    setCurrentPage(newPage); // Update state lokal juga
    window.scrollTo(0, 0);
  }, [pagination.page]); // Dependensi pagination.page

  // Safe access to city name
  const cityName = hotels.length > 0 ? hotels[0].city : "Kota";

  if (isLoading) {
    return (
      <div className="preloader flex flex-col items-center justify-center min-h-screen">
        <div className="preloader__wrap">
          <div className="preloader__icon animate-spin"></div>
        </div>
        <div className="preloader__title text-2xl font-semibold">Hoteloza...</div>
      </div>
    );
  }

  // Jika cityId tidak ada (baik dari initial prop maupun dari useSearchParams), tampilkan pesan error
  if (error || !currentCityId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">
          {error ? "Gagal memuat daftar hotel. Silakan coba lagi." : "ID kota diperlukan"}
        </div>
      </div>
    );
  }

  return (
    <>
      <DynamicHeader11 dictionary={dictionary} currentLang={currentLang} />

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            <DynamicHotelProperties88 hotels={hotels} dictionary={dictionary} currentLang={currentLang} />
          </div>
        </div>
      </section>

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', transform: 'translateY(-60px)', marginTop: '5%' }}>
        <DynamicPaginationComponent
          pageCount={pagination.totalPages}
          onPageChange={handlePageClick}
          containerClassName="pagination"
          activeClassName="active"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousLabel={null}
          nextLabel={null}
          forcePage={pagination.page - 1}
        />
      </div>
      )}

      <section id="faq" className="pt-40 layout-pb-md">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row y-gap-20">
              <div className="col-12 text-center">
                <h2 className="text-22 fw-500">
                  FAQ {cityName}
                </h2>
              </div>
              <div className="col-lg-8 offset-lg-2">
                <div className="accordion -simple row y-gap-20 js-accordion">
                  <DynamicFaqcity city={cityName} dictionary={dictionary} currentLang={currentLang} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <DynamicCallToActions dictionary={dictionary} currentLang={currentLang} />

      <DynamicFooter dictionary={dictionary} currentLang={currentLang} />
    </>
  );
}