// page.jsx
import { Suspense } from "react";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import CallToActions from "@/components/common/CallToActions";
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";
import CityContent from "./CityContent";

// Next.js akan secara otomatis meneruskan searchParams ke Server Component ini
export default function SearchResultPage({ searchParams }) { // Menerima searchParams sebagai prop
  // Anda bisa memproses searchParams di sini jika perlu,
  // atau langsung meneruskannya ke Client Component
  const cityId = searchParams.city_id;
  const page = parseInt(searchParams.page) || 1;

  return (
    <>
      <div className="header-margin"></div>
      <Header11 />
      <section className="layout-pt-md">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <MainFilterSearchBox />
            </div>
          </div>
        </div>
      </section>
      {/* Meneruskan cityId dan page sebagai props ke CityContent */}
      <Suspense fallback={<div>Loading City Content...</div>}>
        <CityContent initialCityId={cityId} initialPage={page} />
      </Suspense>
      <CallToActions />
      <DefaultFooter />
    </>
  );
}