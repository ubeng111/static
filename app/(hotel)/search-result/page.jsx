import { Suspense } from "react";
import Header11 from "@/components/header/header-11";
import Footer from "@/components/footer/";
import CallToActions from "@/components/common/CallToActions";
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";
import CityContent from "./CityContent";

export default async function SearchResultPage({ searchParams }) { // Tambahkan 'async' di sini
  // --- START PERBAIKAN: await searchParams ---
  const awaitedSearchParams = await searchParams; // await searchParams
  const cityId = awaitedSearchParams.city_id;
  const page = parseInt(awaitedSearchParams.page) || 1;
  const cityName = awaitedSearchParams.city || "Selected City"; // Ambil city juga setelah await
  // --- END PERBAIKAN ---

  return (
    <>
      <div className="header-margin"></div>
      <Header11 />

      {/* Moved the search result title section here */}
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
                <h1 className="text-25 fw-600 text-white">
                  Search Result Properties In {cityName} {/* Gunakan cityName yang sudah di-await */}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <MainFilterSearchBox />
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div>Loading City Content...</div>}>
        <CityContent initialCityId={cityId} initialPage={page} />
      </Suspense>

      <CallToActions />
      <Footer />
    </>
  );
}