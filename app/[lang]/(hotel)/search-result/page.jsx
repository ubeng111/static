// app/search/page.jsx
import { Suspense } from "react";
import CityContent from "./CityContent";
import { getdictionary } from '@/dictionaries/get-dictionary';
import { notFound } from 'next/navigation';
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";

// **TAMBAHKAN INI UNTUK ISR 1 TAHUN (dan gantikan 'force-dynamic')**
export const revalidate = 31536000; // 1 tahun dalam detik (60 * 60 * 24 * 365)

// Hapus baris ini:
// export const dynamic = 'force-dynamic';
// Karena `revalidate` akan secara implisit mengatur rute ini menjadi dinamis
// tetapi dengan caching untuk fetched data.

export default async function SearchPage({ searchParams, params }) {
  const cityId = searchParams.city_id;
  const page = parseInt(searchParams.page) || 1;
  const locale = params.lang || 'en';

  // Data dari getdictionary akan di-cache sesuai `revalidate` yang diekspor di atas.
  const dictionary = await getdictionary(locale);
  if (!dictionary) {
    notFound();
  }

  // Get the raw dictionary string for accommodation search result and the city name
  // This expects the dictionary to have "searchResultAccommodationIn": "Search result for accommodation in {cityName}"
  const searchResultAccommodationInTemplate = dictionary?.search?.searchResultAccommodationIn || "Search Result Accomodation In {cityName}";
  const selectedCityName = searchParams.city || dictionary?.search?.selectedCity || "Selected City";

  // Replace {cityName} in the template with the actual city name
  const searchResultAccommodationInText = searchResultAccommodationInTemplate.replace('{cityName}', selectedCityName);

  // Other text from dictionary
  const luxuryBackgroundImageAlt = dictionary?.header?.luxuryBackgroundImageAlt || "Gambar latar mewah";
  const loadingCityContentText = dictionary?.common?.loadingCityContent || "Loading City Content...";

  return (
    <>
      <div className="header-margin"></div>

      <section className="section-bg pt-40 pb-40 relative z-5">
        <div className="section-bg__item col-12">
          <img
            src="/img/misc/bg-1.webp"
            srcSet="/img/misc/bg-1.webp 480w, /img/misc/bg-1.webp 768w, /img/misc/bg-1.webp 1200w"
            alt={luxuryBackgroundImageAlt}
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
                  {searchResultAccommodationInText}
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
              {/* Pass `dictionary` and `currentLang` to MainFilterSearchBox */}
              <MainFilterSearchBox dictionary={dictionary} currentLang={locale} />
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div>{loadingCityContentText}</div>}>
        <CityContent
          initialCityId={cityId}
          initialPage={page}
          dictionary={dictionary}
          currentLang={locale}
        />
      </Suspense>
    </>
  );
}