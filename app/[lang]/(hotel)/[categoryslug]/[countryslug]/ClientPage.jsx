// ClientPage.jsx (Country - app/[lang]/(hotel)/[categoryslug]/[countryslug]/ClientPage.jsx)
'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic'; // Pastikan dynamic sudah diimpor
import useSWR from 'swr';

// --- MODIFIKASI: Impor Komponen Secara Dinamis (next/dynamic) ---

// Komponen yang sudah dinamis:
const Faqcountry = dynamic(() => import('@/components/faq/Faqcountry'), { ssr: false, loading: () => <p>Loading FAQs...</p> });
const TopBreadCrumbCountry = dynamic(() => import('@/components/hotel-list/hotel-list-v5/TopBreadCrumbCountry'), { ssr: false, loading: () => <p>Loading breadcrumbs...</p> });

// Tambahkan dynamic import untuk komponen-komponen lain yang diimpor langsung:
const DynamicPaginationComponent = dynamic(() => import('@/components/hotel-list/hotel-list-v5/PaginationComponent'), { ssr: false, loading: () => <p>Loading pagination...</p> });
const DynamicRelatedcountry88 = dynamic(() => import('@/components/hotel-single/Relatedcountry88'), { ssr: false, loading: () => <p>Loading related countries...</p> });
const DynamicHotelProperties88 = dynamic(() => import('@/components/hotel-list/hotel-list-v5/HotelProperties88'), { ssr: false, loading: () => <p>Loading hotel properties...</p> });
const DynamicFooter = dynamic(() => import("@/components/footer"), { ssr: false, loading: () => <p>Loading footer...</p> });
const DynamicCallToActions = dynamic(() => import("@/components/common/CallToActions"), { ssr: false, loading: () => <p>Loading call to actions...</p> });
const DynamicMainFilterSearchBox = dynamic(() => import("@/components/hotel-list/common/MainFilterSearchBox"), { ssr: false, loading: () => <p>Loading search box...</p> });
const DynamicHeader11 = dynamic(() => import("@/components/header/header-11"), { ssr: false, loading: () => <p>Loading header...</p> });

// --- AKHIR MODIFIKASI next/dynamic ---

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

export default function ClientPage({ categoryslug, countryslug, dictionary, currentLang }) {
  console.log('ClientPage (Country): Received props - category:', categoryslug, 'country:', countryslug, 'lang:', currentLang);

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  const commonDict = dictionary?.common || {};
  const countryPageDict = dictionary?.countryPage || {};
  const headerDict = dictionary?.header || {};
  // Pastikan faqDict juga diakses jika Faqcountry membutuhkannya
  const faqDict = dictionary?.faq || {}; 

  const fetcher = useCallback(async (url) => {
    console.log('ClientPage (Country) SWR Fetcher: Fetching URL:', url); // DEBUGGING SWR FETCH
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('ClientPage (Country) SWR Fetcher Error:', response.status, response.statusText, errorBody);
      throw new Error(commonDict.failedToLoadHotelList || `Failed to fetch data: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  }, [commonDict.failedToLoadHotelList]);

  const apiUrlForSWR = `/api/${categoryslug}/${countryslug}?page=${page}`;
  console.log('ClientPage (Country) SWR API URL:', apiUrlForSWR);

  const { data, error, isLoading } = useSWR(apiUrlForSWR, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  console.log('ClientPage (Country) SWR Hook Status - data:', data, 'error:', error, 'isLoading:', isLoading);

  const hotels = useMemo(() => data?.hotels || [], [data]);
  const relatedcountry = useMemo(() => {
    console.log('ClientPage (Country) SWR Data:', data); // DEBUGGING SWR DATA
    console.log('ClientPage (Country) relatedcountry data for prop:', data?.relatedcountry); // DEBUGGING specific prop
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
      console.log('handlePageClick: Navigating to page', newPage);
      if (newPage === pagination.page) return;
      router.push(`/${currentLang}/${categoryslug}/${countryslug}?page=${newPage}`);
      window.scrollTo(0, 0);
    },
    [categoryslug, countryslug, pagination.page, router, currentLang]
  );

  if (isLoading) {
    console.log('ClientPage (Country): Showing loading state.');
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
    console.error('ClientPage (Country): Showing error state:', error);
    return <div>{commonDict.errorLoadingData || 'Error loading data. Please try again later.'}</div>;
  }

  if (!hotels.length) {
    console.warn('ClientPage (Country): No hotels found for this country.');
    return <div>{countryPageDict.noHotelsFoundForCountry || 'No hotels found for this country.'}</div>;
  }

  console.log('ClientPage (Country): Rendering content with hotels data.');
  return (
    <>
      {/* Panggil DynamicHeader11 */}
      <DynamicHeader11 dictionary={dictionary} currentLang={currentLang} />

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

      {/* TopBreadCrumbCountry sudah dinamis */}
      <TopBreadCrumbCountry categoryslug={categoryslug} countryslug={countryslug} dictionary={dictionary} currentLang={currentLang} />

      <section className="layout-pt-md">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* Panggil DynamicMainFilterSearchBox */}
              <DynamicMainFilterSearchBox dictionary={dictionary} currentLang={currentLang} />
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            {/* Panggil DynamicHotelProperties88 */}
            <DynamicHotelProperties88 hotels={hotels} dictionary={dictionary} currentLang={currentLang} />
          </div>
        </div>
      </section>

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', transform: 'translateY(-60px)', marginTop: '5%' }}>
          {/* Panggil DynamicPaginationComponent */}
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

      <div className="pt-40 sm:pt-20 item_gap-x30">
        {relatedcountry.length > 0 ? (
          // Panggil DynamicRelatedcountry88
          <DynamicRelatedcountry88 relatedcountry={relatedcountry} categoryslug={categoryslug} countryslug={countryslug} dictionary={dictionary} currentLang={currentLang} />
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
                  {/* Panggil Faqcountry (yang sudah dinamis) */}
                  <Faqcountry country={displayCountry} dictionary={dictionary} currentLang={currentLang} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Panggil DynamicCallToActions */}
      <DynamicCallToActions dictionary={dictionary} currentLang={currentLang} />

      {/* Panggil DynamicFooter */}
      <DynamicFooter dictionary={dictionary} currentLang={currentLang} />
    </>
  );
}