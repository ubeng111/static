"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import useSWR from "swr";
import HotelProperties88 from "@/components/hotel-list/hotel-list-v5/HotelProperties88";
import Faqcity from "@/components/faq/Faqcity";

// Dynamically import non-critical components
const ReactPaginate = dynamic(() => import("react-paginate"), { ssr: false });

// SWR fetcher function
const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gagal mengambil data: ${errorData.message || "Kesalahan tidak diketahui"}`);
  }
  return response.json();
};

export default function CityContent() {
  const searchParams = useSearchParams();
  const cityId = searchParams.get("city_id");
  const page = parseInt(searchParams.get("page")) || 1;

  // SWR hook for data fetching
  const { data, error, isLoading } = useSWR(
    cityId ? `/api/city?city_id=${encodeURIComponent(cityId)}&page=${page}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  const hotels = data?.hotels || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, totalHotels: 0 };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    if (newPage === pagination.page) return;
    // Update URL with new page
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("page", newPage);
    window.history.pushState({}, "", newUrl);
    window.scrollTo(0, 0);
  };

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

  if (error || !cityId) {
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
      <section className="section-bg pt-40 pb-40 relative z-5">
        <div className="section-bg__item col-12">
          <img
            src="/img/misc/bg-1.webp"
            srcSet="/img/misc/bg-1.webp 480w, /img/misc/bg-1.webp 768w, /img/misc/bg-1.webp 1200w"
            alt="Gambar latar mewah"
            loading="lazy"
            className="w-full h-full object-cover"
            width="1200"
            height="800"
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h1 className="text-30 fw-600 text-white">
                  Search Result Properties In {hotels[0]?.city || "Kota"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            <HotelProperties88 hotels={hotels} />
          </div>
        </div>
      </section>

      {pagination.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", transform: "translateY(-90px)", marginTop: "7%" }}>
          <ReactPaginate
            pageCount={pagination.totalPages}
            onPageChange={handlePageClick}
            containerClassName={"pagination flex space-x-2"}
            activeClassName={"active bg-blue-500 text-white"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link px-3 py-2 border rounded-sm"}
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
                  FAQ {hotels[0]?.city || "properti ini"}
                </h2>
              </div>
              <div className="col-lg-8 offset-lg-2">
                <div className="accordion -simple row y-gap-20 js-accordion">
                  <Faqcity city={hotels[0]?.city || "properti ini"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}