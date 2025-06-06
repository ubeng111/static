'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import ReactPaginate from 'react-paginate';
import Link from 'next/link';

import TopBreadCrumbState from '@/components/hotel-list/hotel-list-v5/TopBreadCrumbState';
import HotelProperties88 from '@/components/hotel-list/hotel-list-v5/HotelProperties88';
import Relatedstate88 from '@/components/hotel-single/Relatedstate88';

const CallToActions = dynamic(() => import('@/components/common/CallToActions'), { ssr: false });
const Header11 = dynamic(() => import('@/components/header/header-11'), { ssr: false });
const DefaultFooter = dynamic(() => import('@/components/footer/default'), { ssr: false });
const MainFilterSearchBox = dynamic(() => import('@/components/hotel-list/common/MainFilterSearchBox'), { ssr: false });

export default function ClientPage({ stateslug }) { // Removed countryslug prop
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetcher = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch data: ${response.status} - ${errorData.message}`);
    }
    return response.json();
  }, []);

  const { data, error, isLoading } = useSWR(`/api/state/${stateslug}?page=${page}`, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const hotels = useMemo(() => data?.hotels || [], [data]);
  const relatedstate = useMemo(() => data?.relatedstate || [], [data]);
  const pagination = useMemo(() => data?.pagination || { page: 1, totalPages: 1, totalHotels: 0 }, [data]);
  const breadcrumb = useMemo(() => data?.breadcrumb || {}, [data]);

  const formattedState = useMemo(
    () => (stateslug ? stateslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'State'),
    [stateslug]
  );

  const handlePageClick = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      if (newPage === pagination.page) return;
      router.push(`/state/${stateslug}?page=${newPage}`, { shallow: true });
      window.scrollTo(0, 0);
    },
    [stateslug, pagination.page, router]
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
    console.error('SWR error:', error);
    if (error.message.includes('404')) {
      return (
        <div className="text-center py-5">
          <h2 className="text-2xl font-bold mb-4">State Not Found</h2>
          <p>We couldn't find any data for "{formattedState}". Please check the URL or try another state.</p>
          <Link href="/" className="btn btn-primary mt-4">Go to Homepage</Link>
        </div>
      );
    }
    return <div>Error loading data. Please try again later.</div>;
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
                <h1 className="text-30 fw-600 text-white">Discover Luxe Stays In {formattedState}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TopBreadCrumbState breadcrumbData={breadcrumb} stateslug={stateslug} countryslug={breadcrumb.countryslug} />

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
            {hotels.length > 0 ? (
              <HotelProperties88 hotels={hotels} />
            ) : (
              <div className="col-12 text-center">No hotels found for this state.</div>
            )}
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'center', transform: 'translateY(-90px)', marginTop: '7%' }}>
        {pagination.totalPages > 1 && (
          <ReactPaginate
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
        )}
      </div>

      <div className="pt-40 sm:pt-20 item_gap-x30">
        {relatedstate.length > 0 ? (
          <Relatedstate88 relatedstate={relatedstate} stateslug={stateslug} countryslug={breadcrumb.countryslug} />
        ) : (
          <p>No related cities found for this state.</p>
        )}
      </div>

      <section id="faq" className="pt-40 layout-pb-md">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row y-gap-20">
              <div className="col-12 text-center">
                <h2 className="text-22 fw-500">FAQs about {formattedState} hotels</h2>
              </div>
              <div className="col-lg-8 offset-lg-2">
                <div className="accordion -simple row y-gap-20 js-accordion">{/* Placeholder for FAQ content */}</div>
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