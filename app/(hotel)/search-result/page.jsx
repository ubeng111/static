import { Suspense } from "react";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import CallToActions from "@/components/common/CallToActions";
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";
import CityContent from "./CityContent";

export default function SearchResultPage() {
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
      <Suspense fallback={<div>Loading...</div>}>
        <CityContent />
      </Suspense>
      <CallToActions />
      <DefaultFooter />
    </>
  );
}