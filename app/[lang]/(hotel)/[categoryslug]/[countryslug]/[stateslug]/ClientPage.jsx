// ClientPage.jsx (State)
'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import PaginationComponent from '@/components/hotel-list/hotel-list-v5/PaginationComponent';
import Relatedstate88 from '@/components/hotel-single/Relatedstate88';
import HotelProperties88 from '@/components/hotel-list/hotel-list-v5/HotelProperties88';
import Footer from "@/components/footer";
import CallToActions from "@/components/common/CallToActions";
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";
import Header11 from "@/components/header/header-11";

const Faqstate = dynamic(() => import('@/components/faq/Faqstate'), { ssr: false });
const TopBreadCrumbState = dynamic(() => import('@/components/hotel-list/hotel-list-v5/TopBreadCrumbState'), { ssr: false });

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

// Penting: Anda perlu menambahkan 'initialData' sebagai prop di sini,
// seperti yang kita lakukan di ClientPage.jsx (Country)
export default function ClientPage({ categoryslug, countryslug, stateslug, dictionary, currentLang, initialData }) { //
  // console.log('ClientPage (State): Received props - category:', categoryslug, 'country:', countryslug, 'state:', stateslug, 'lang:', currentLang); // BARIS INI DIHAPUS

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  const commonDict = dictionary?.common || {};
  const statePageDict = dictionary?.statePage || {};
  const headerDict = dictionary?.header || {};

  const fetcher = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(commonDict.failedToLoadHotelList || 'Failed to fetch data');
    return response.json();
  }, [commonDict.failedToLoadHotelList]);

  // Penting: Gunakan initialData sebagai fallbackData untuk SWR
  const { data, error, isLoading } = useSWR(`/api/${categoryslug}/${countryslug}/${stateslug}?page=${page}`, fetcher, { //
    revalidateOnFocus: false,
    keepPreviousData: true,
    fallbackData: initialData, // Ini adalah perbaikan penting
  });

  const hotels = useMemo(() => data?.hotels || [], [data]);
  const relatedstate = useMemo(() => data?.relatedstate || [], [data]);
  const pagination = useMemo(() => data?.pagination || { page: 1, totalPages: 1, totalHotels: 0 }, [data]);
  const formattedCategory = useMemo(
    () => (categoryslug ? formatSlug(categoryslug) : statePageDict.categoryDefault || 'Category'),
    [categoryslug, statePageDict.categoryDefault]
  );
  const formattedCountry = useMemo(
    () => (countryslug ? formatSlug(countryslug) : statePageDict.countryDefault || 'Country'),
    [countryslug, statePageDict.countryDefault]
  );
  const formattedState = useMemo(
    () => (stateslug ? formatSlug(stateslug) : statePageDict.stateDefault || 'State'),
    [stateslug, statePageDict.stateDefault]
  );

  const handlePageClick = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      if (newPage === pagination.page) return;
      router.push(`/${currentLang}/${categoryslug}/${countryslug}/${stateslug}?page=${newPage}`);
      window.scrollTo(0, 0);
    },
    [categoryslug, countryslug, stateslug, pagination.page, router, currentLang]
  );

  if (isLoading) {
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

  if (!hotels.length) {
    return <div>{statePageDict.noHotelsFoundForState || 'No hotels found for this state.'}</div>;
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
                  {statePageDict.discoverStaysInState?.replace('{formattedState}', formattedState) || `Best Affordable ${formattedCategory} in ${formattedState}, ${formattedCountry}`}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TopBreadCrumbState categoryslug={categoryslug} countryslug={countryslug} stateslug={stateslug} dictionary={dictionary} currentLang={currentLang} />

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
        {relatedstate.length > 0 ? (
          <Relatedstate88 relatedstate={relatedstate} categoryslug={categoryslug} countryslug={countryslug} stateslug={stateslug} dictionary={dictionary} currentLang={currentLang} />
        ) : (
          <p>{commonDict.noRelatedStatesFound || 'No related states found.'}</p>
        )}
      </div>

      <section id="faq" className="pt-40 layout-pb-md">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row y-gap-20">
              <div className="col-12 text-center">
                <h2 className="text-22 fw-500">
                  {statePageDict.faqsAboutStateHotels?.replace('{displayState}', formattedState) || `FAQs about ${formattedState} hotels`}
                </h2>
              </div>
              <div className="col-lg-8 offset-lg-2">
                <div className="accordion -simple row y-gap-20 js-accordion">
                  <Faqstate state={formattedState} dictionary={dictionary} currentLang={currentLang} />
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