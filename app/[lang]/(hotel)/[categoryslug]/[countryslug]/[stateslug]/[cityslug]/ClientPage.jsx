// app/[lang]/(hotel)/[categoryslug]/[countryslug]/[stateslug]/[cityslug]/ClientPage.jsx
'use client'; // WAJIB: Ini adalah Client Component

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// Hapus dynamic import Faqcity dan TopBreadCrumbCity dari sini
// Karena ClientPage sendiri sudah Client Component, dynamic import dengan ssr: false di dalamnya tidak perlu.
// Anda bisa langsung mengimpor Faqcity dan TopBreadCrumbCity jika mereka juga Client Component.

import PaginationComponent from '@/components/hotel-list/hotel-list-v5/PaginationComponent';
import Relatedcity88 from '@/components/hotel-single/Relatedcity88';
import HotelProperties88 from '@/components/hotel-list/hotel-list-v5/HotelProperties88';
import Footer from "@/components/footer";
import CallToActions from "@/components/common/CallToActions";
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";
import Header11 from "@/components/header/header-11";
import useSWR from 'swr'; // Import useSWR

// Jika Faqcity dan TopBreadCrumbCity adalah Client Component:
import Faqcity from '@/components/faq/Faqcity';
import TopBreadCrumbCity from '@/components/hotel-list/hotel-list-v5/TopBreadCrumbCity';

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

export default function ClientPage({ categoryslug, countryslug, stateslug, cityslug, dictionary, currentLang, initialData }) { // Tambahkan initialData
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  const commonDict = dictionary?.common || {};
  const cityPageDict = dictionary?.cityPage || {};
  const headerDict = dictionary?.header || {};

  const fetcher = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(commonDict.failedToLoadHotelList || 'Failed to fetch data');
    return response.json();
  }, [commonDict.failedToLoadHotelList]);

  // Menggunakan SWR dengan initialData untuk hidrasi pertama kali
  const { data, error, isLoading } = useSWR(
    `/api/${categoryslug}/${countryslug}/${stateslug}/${cityslug}?page=${page}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      fallbackData: initialData // Gunakan data dari Server Component sebagai fallbackData
    }
  );

  const hotels = useMemo(() => data?.hotels || [], [data]);
  const relatedcity = useMemo(() => data?.relatedcity || [], [data]);
  const pagination = useMemo(() => data?.pagination || { page: 1, totalPages: 1, totalHotels: 0 }, [data]);
  const formattedCategory = useMemo(
    () => (categoryslug ? formatSlug(categoryslug) : cityPageDict.categoryDefault || 'Category'),
    [categoryslug, cityPageDict.categoryDefault]
  );
  const formattedCity = useMemo(
    () => (cityslug ? formatSlug(cityslug) : cityPageDict.cityDefault || 'City'),
    [cityslug, cityPageDict.cityDefault]
  );

  const handlePageClick = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      if (newPage === pagination.page) return;
      router.push(`/${currentLang}/${categoryslug}/${countryslug}/${stateslug}/${cityslug}?page=${newPage}`, { shallow: true });
      window.scrollTo(0, 0);
    },
    [categoryslug, countryslug, stateslug, cityslug, pagination.page, router, currentLang]
  );

  if (isLoading && !data) { // Tampilkan preloader hanya jika loading dan tidak ada data awal
    return (
      <div className="preloader">
        <div className="preloader__wrap">
          <div className="preloader__icon"></div>
        </div>
        <div className="preloader__title">{commonDict.preloaderTitle || 'Hoteloza..'}</div>
      </div>
    );
  }

  if (error) {
    return <div>{commonDict.errorLoadingData || 'Error loading data. Please try again later.'}</div>;
  }

  if (!hotels.length && !isLoading) { // Tampilkan pesan ini jika tidak ada hotel dan tidak lagi loading
    return <div>{cityPageDict.noHotelsFoundForCity || 'No hotels found for this location.'}</div>;
  }

  return (
    <>
      <Header11 dictionary={dictionary} currentLang={currentLang} />

      <div className="header-margin"></div>
      <section className="section-bg pt-40 pb-40 relative z-5">
        <div className="section-bg__item col-12">
         <img
            src="/img/misc/bg-1.webp"
            srcSet="/img/misc/bg-1.webp 480w, /img/misc/bg-1.webp 768w, /img/misc/bg-1.webp 1200w"
            alt={headerDict.luxuryBackgroundImageAlt || "Luxury background image"}
            loading="lazy"
            className="w-full h-full object-cover"
            width={1200}
            height={800}
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h1 className="text-30 fw-600 text-white">
                  {cityPageDict.discoverStaysInCity?.replace('{formattedCategory}', formattedCategory)?.replace('{formattedCity}', formattedCity) || `Best Affordable ${formattedCategory} in ${formattedCity}`}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TopBreadCrumbCity categoryslug={categoryslug} countryslug={countryslug} stateslug={stateslug} cityslug={cityslug} dictionary={dictionary} currentLang={currentLang} />

      <section className="layout-pt-md">
        <div className="container">
          <div className="row">
            <div className="col-12">
         <MainFilterSearchBox dictionary={dictionary} currentLang={currentLang} />

            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            <HotelProperties88 hotels={hotels} dictionary={dictionary} currentLang={currentLang} />
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'center', transform: 'translateY(-60px)', marginTop: '5%' }}>
        <PaginationComponent
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

      <div className="pt-40 sm:pt-20 item_gap-x30">
        {relatedcity.length > 0 ? (
          <Relatedcity88
            relatedcity={relatedcity}
            categoryslug={categoryslug}
            countryslug={countryslug}
            stateslug={stateslug}
            cityslug={cityslug}
            dictionary={dictionary}
            currentLang={currentLang}
          />
        ) : (
          <p>{commonDict.noRelatedCitiesFound || 'No related cities found.'}</p>
        )}
      </div>

      <section id="faq" className="pt-40 layout-pb-md">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row y-gap-20">
              <div className="col-12 text-center">
                <h2 className="text-22 fw-500">
                  {cityPageDict.faqsAboutCityHotels?.replace('{displayCity}', formattedCity) || `FAQs about ${formattedCity} hotels`}
                </h2>
              </div>
              <div className="col-lg-8 offset-lg-2">
                <div className="accordion -simple row y-gap-20 js-accordion">
                  <Faqcity city={formattedCity} dictionary={dictionary} currentLang={currentLang} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CallToActions dictionary={dictionary} currentLang={currentLang} />

      <Footer dictionary={dictionary} currentLang={currentLang} />
    </>
  );
}