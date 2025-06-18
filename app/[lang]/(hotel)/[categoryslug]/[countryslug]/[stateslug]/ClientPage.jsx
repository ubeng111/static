// ClientPage.jsx (State)
'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic'; // Pastikan dynamic sudah diimpor
import useSWR from 'swr';

// --- MODIFIKASI: Impor Komponen Secara Dinamis (next/dynamic) ---

// Komponen yang sudah dinamis:
const Faqstate = dynamic(() => import('@/components/faq/Faqstate'), { ssr: false, loading: () => <p>Loading FAQs...</p> });
const TopBreadCrumbState = dynamic(() => import('@/components/hotel-list/hotel-list-v5/TopBreadCrumbState'), { ssr: false, loading: () => <p>Loading breadcrumbs...</p> });

// Tambahkan dynamic import untuk komponen-komponen lain yang diimpor langsung:
const DynamicPaginationComponent = dynamic(() => import('@/components/hotel-list/hotel-list-v5/PaginationComponent'), { ssr: false, loading: () => <p>Loading pagination...</p> });
const DynamicRelatedstate88 = dynamic(() => import('@/components/hotel-single/Relatedstate88'), { ssr: false, loading: () => <p>Loading related states...</p> });
const DynamicHotelProperties88 = dynamic(() => import('@/components/hotel-list/hotel-list-v5/HotelProperties88'), { ssr: false, loading: () => <p>Loading hotel properties...</p> });
const DynamicFooter = dynamic(() => import("@/components/footer"), { ssr: false, loading: () => <p>Loading footer...</p> });
const DynamicCallToActions = dynamic(() => import("@/components/common/CallToActions"), { ssr: false, loading: () => <p>Loading call to actions...</p> });
const DynamicMainFilterSearchBox = dynamic(() => import("@/components/hotel-list/common/MainFilterSearchBox"), { ssr: false, loading: () => <p>Loading search box...</p> });
const DynamicHeader11 = dynamic(() => import("@/components/header/header-11"), { ssr: false, loading: () => <p>Loading header...</p> });

// --- AKHIR MODIFIKASI next/dynamic ---

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

export default function ClientPage({ categoryslug, countryslug, stateslug, dictionary, currentLang }) {
  console.log('ClientPage (State): Received props - category:', categoryslug, 'country:', countryslug, 'state:', stateslug, 'lang:', currentLang);

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

  const { data, error, isLoading } = useSWR(`/api/${categoryslug}/${countryslug}/${stateslug}?page=${page}`, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
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
                  {statePageDict.discoverStaysInState?.replace('{formattedState}', formattedState) || `Best Affordable ${formattedCategory} in ${formattedState}, ${formattedCountry}`}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TopBreadCrumbState sudah dinamis */}
      <TopBreadCrumbState categoryslug={categoryslug} countryslug={countryslug} stateslug={stateslug} dictionary={dictionary} currentLang={currentLang} />

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
        {relatedstate.length > 0 ? (
          // Panggil DynamicRelatedstate88
          <DynamicRelatedstate88 relatedstate={relatedstate} categoryslug={categoryslug} countryslug={countryslug} stateslug={stateslug} dictionary={dictionary} currentLang={currentLang} />
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
                  {/* Faqstate sudah dinamis */}
                  <Faqstate state={formattedState} dictionary={dictionary} currentLang={currentLang} />
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