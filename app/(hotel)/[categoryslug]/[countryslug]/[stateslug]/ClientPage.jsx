// ClientPage.jsx (State)
'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import PaginationComponent from '@/components/hotel-list/hotel-list-v5/PaginationComponent';
import Relatedstate88 from '@/components/hotel-single/Relatedstate88';
import HotelProperties88 from '@/components/hotel-list/hotel-list-v5/HotelProperties88';

const CallToActions = dynamic(() => import('@/components/common/CallToActions'), { ssr: false });
const Header11 = dynamic(() => import('@/components/header/header-11'), { ssr: false });
const DefaultFooter = dynamic(() => import('@/components/footer/default'), { ssr: false });
const Faqstate = dynamic(() => import('@/components/faq/Faqstate'), { ssr: false });
const MainFilterSearchBox = dynamic(() => import('@/components/hotel-list/common/MainFilterSearchBox'), { ssr: false });
const TopBreadCrumbState = dynamic(() => import('@/components/hotel-list/hotel-list-v5/TopBreadCrumbState'), { ssr: false });

export default function ClientPage({ categoryslug, countryslug, stateslug }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  const fetcher = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
  }, []);

  const { data, error, isLoading } = useSWR(`/api/${categoryslug}/${countryslug}/${stateslug}?page=${page}`, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const hotels = useMemo(() => data?.hotels || [], [data]);
  const relatedstate = useMemo(() => data?.relatedstate || [], [data]);
  const pagination = useMemo(() => data?.pagination || { page: 1, totalPages: 1, totalHotels: 0 }, [data]);
  const formattedCategory = useMemo(
    () => (categoryslug ? categoryslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Category'),
    [categoryslug]
  );
  const formattedCountry = useMemo(
    () => (countryslug ? countryslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Country'),
    [countryslug]
  );
  const formattedState = useMemo(
    () => (stateslug ? stateslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'State'),
    [stateslug]
  );

  const handlePageClick = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      if (newPage === pagination.page) return;
      router.push(`/${categoryslug}/${countryslug}/${stateslug}?page=${newPage}`, { shallow: true });
      window.scrollTo(0, 0);
    },
    [categoryslug, countryslug, stateslug, pagination.page, router]
  );

  if (isLoading) {
    return (
      <div className="preloader">
        <div className="preloader__wrap">
          <div className="preloader__icon"></div>
        </div>
        <div className="preloader__title">Hoteloza..</div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading data. Please try again later.</div>;
  }

  if (!hotels.length) {
    return <div>No hotels found for this state.</div>;
  }

  return (
    <>
      <div className="header-margin"></div>
      <Header11 />
      <section className="section-bg pt-40 pb-40 relative z-5">
        <div className="section-bg__item col-12">
          <img
            src="/img/misc/bg-1.webp"
            srcSet="/img/misc/bg-1.webp 480w, /img/misc/bg-1.webp 768w, /img/misc/bg-1.webp 1200w"
            alt="Luxury background image"
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
                  Best Affordable {formattedCategory} in {hotels[0]?.['negara bagian'] ? formatSlug(hotels[0]['negara bagian']) : formattedState}, {formattedCountry}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TopBreadCrumbState categoryslug={categoryslug} countryslug={countryslug} stateslug={stateslug} />

      <section className="layout-pt-md">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <MainFilterSearchBox />
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

      <div style={{ display: 'flex', justifyContent: 'center', transform: 'translateY(-90px)', marginTop: '2%' }}>
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
          <Relatedstate88 relatedstate={relatedstate} categoryslug={categoryslug} countryslug={countryslug} stateslug={stateslug} />
        ) : (
          <p>No related states found.</p>
        )}
      </div>

      <section id="faq" className="pt-40 layout-pb-md">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row y-gap-20">
              <div className="col-12 text-center">
                <h2 className="text-22 fw-500">FAQs about {hotels[0]?.['negara bagian'] ? formatSlug(hotels[0]['negara bagian']) : formattedState} hotels</h2>
              </div>
              <div className="col-lg-8 offset-lg-2">
                <div className="accordion -simple row y-gap-20 js-accordion">
                  <Faqstate state={hotels[0]?.['negara bagian'] ? formatSlug(hotels[0]['negara bagian']) : formattedState} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToActions />
      <DefaultFooter />
    </>
  );
}