// app/[lang]/(hotel)/[categoryslug]/[countryslug]/ClientPage.jsx
'use client'; // WAJIB: Ini adalah Client Component

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// Hapus dynamic import dari Faqcountry dan TopBreadCrumbCountry dari sini.
// Karena ClientPage ini sudah 'use client;', Anda bisa mengimpornya langsung.
import useSWR from 'swr';
import PaginationComponent from '@/components/hotel-list/hotel-list-v5/PaginationComponent';
import Relatedcountry88 from '@/components/hotel-single/Relatedcountry88';
import HotelProperties88 from '@/components/hotel-list/hotel-list-v5/HotelProperties88';
import Footer from "@/components/footer";
import CallToActions from "@/components/common/CallToActions";
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";
import Header11 from "@/components/header/header-11";

// Asumsi Faqcountry dan TopBreadCrumbCountry juga Client Components
// dan tidak perlu dynamic import dengan ssr:false di sini
import Faqcountry from '@/components/faq/Faqcountry';
import TopBreadCrumbCountry from '@/components/hotel-list/hotel-list-v5/TopBreadCrumbCountry';

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

export default function ClientPage({ categoryslug, countryslug, dictionary, currentLang, initialData }) { // Tambahkan initialData
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  const commonDict = dictionary?.common || {};
  const countryPageDict = dictionary?.countryPage || {};
  const headerDict = dictionary?.header || {};

  const fetcher = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(commonDict.failedToLoadHotelList || `Failed to fetch data: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  }, [commonDict.failedToLoadHotelList]);

  const apiUrlForSWR = `/api/${categoryslug}/${countryslug}?page=${page}`;

  const { data, error, isLoading } = useSWR(apiUrlForSWR, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    fallbackData: initialData, // Ini adalah baris penting yang ditambahkan
  });

  const hotels = useMemo(() => data?.hotels || [], [data]);
  const relatedcountry = useMemo(() => {
    return data?.relatedcountry || [];
  }, [data]);
  const pagination = useMemo(() => data?.pagination || { page: 1, totalPages: 1, totalHotels: 0 }, [data]);
  const formattedCategory = useMemo(
    () => (categoryslug ? formatSlug(categoryslug) : countryPageDict.categoryDefault || 'Category'),
    [categoryslug, countryPageDict.categoryDefault]
  );
  const formattedCountry = useMemo(
    () => (countryslug ? formatSlug(countryslug) : countryPageDict.countryDefault || 'Country'),
    [countryslug, countryPageDict.countryDefault]
  );

  const displayCountry = useMemo(
    () => (hotels[0]?.country ? formatSlug(hotels[0].country) : formattedCountry),
    [hotels, formattedCountry]
  );

  const handlePageClick = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      if (newPage === pagination.page) return;
      router.push(`/${currentLang}/${categoryslug}/${countryslug}?page=${newPage}`);
      window.scrollTo(0, 0);
    },
    [categoryslug, countryslug, pagination.page, router, currentLang]
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
    return <div>{countryPageDict.noHotelsFoundForCountry || 'No hotels found for this country.'}</div>;
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
                  {countryPageDict.discoverStaysIn?.replace('{formattedCategory}', formattedCategory)?.replace('{displayCountry}', displayCountry) || `Cheap ${formattedCategory} in ${displayCountry}`}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TopBreadCrumbCountry categoryslug={categoryslug} countryslug={countryslug} dictionary={dictionary} currentLang={currentLang} />

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

      {pagination.totalPages > 1 && (
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
      )}

      <div className="pt-40 sm:pt-20 item_gap-x30">
        {relatedcountry.length > 0 ? (
          <Relatedcountry88 relatedcountry={relatedcountry} categoryslug={categoryslug} countryslug={countryslug} dictionary={dictionary} currentLang={currentLang} />
        ) : (
          <p>{commonDict.noRelatedCountriesFound || 'No related countries found.'}</p>
        )}
      </div>

      <section id="faq" className="pt-40 layout-pb-md">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row y-gap-20">
              <div className="col-12 text-center">
                <h2 className="text-22 fw-500">
                  {countryPageDict.faqsAboutCountryHotels?.replace('{displayCountry}', displayCountry) || `FAQs about ${displayCountry} hotels`}
                </h2>
              </div>
              <div className="col-lg-8 offset-lg-2">
                <div className="accordion -simple row y-gap-20 js-accordion">
                  <Faqcountry country={displayCountry} dictionary={dictionary} currentLang={currentLang} />
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