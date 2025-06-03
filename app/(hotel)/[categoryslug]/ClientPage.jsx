'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import ReactPaginate from 'react-paginate';
import Relatedcategory88 from '@/components/hotel-single/Relatedcategory88';

// Dynamically import components to reduce initial bundle size
const CallToActions = dynamic(() => import('@/components/common/CallToActions'), { ssr: false });
const Header11 = dynamic(() => import('@/components/header/header-11'), { ssr: false });
const DefaultFooter = dynamic(() => import('@/components/footer/default'), { ssr: false });
const HotelProperties88 = dynamic(() => import('@/components/hotel-list/hotel-list-v5/HotelProperties88'), { ssr: false });
const MainFilterSearchBox = dynamic(() => import('@/components/hotel-list/common/MainFilterSearchBox'), { ssr: false });
const TopBreadCrumbCategory = dynamic(() => import('@/components/hotel-list/hotel-list-v5/TopBreadCrumbCategory'), { ssr: false });

export default function ClientPage({ categoryslug, schema }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  // Memoize the fetcher function to prevent re-creation
  const fetcher = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
  }, []);

  // Use SWR for data fetching
  const { data, error, isLoading } = useSWR(`/api/${categoryslug}?page=${page}`, fetcher, {
    revalidateOnFocus: false, // Prevent revalidation on focus
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  // Memoize derived data
  const hotels = useMemo(() => data?.hotels || [], [data]);
  const relatedcategory = useMemo(() => data?.relatedcategory || [], [data]);
  const pagination = useMemo(() => data?.pagination || { page: 1, totalPages: 1, totalHotels: 0 }, [data]);
  const formattedCategory = useMemo(
    () => categoryslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    [categoryslug]
  );

  // Handle pagination click
  const handlePageClick = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      if (newPage === pagination.page) return;
      router.push(`/${categoryslug}?page=${newPage}`, { shallow: true });
      window.scrollTo(0, 0);
    },
    [categoryslug, pagination.page, router]
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
                <h1 className="text-30 fw-600 text-white">Discover Luxe Stays In {formattedCategory}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TopBreadCrumbCategory categoryslug={categoryslug} />

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

      <div style={{ display: 'flex', justifyContent: 'center', transform: 'translateY(-90px)', marginTop: '7%' }}>
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
      </div>

      <div className="pt-40 sm:pt-20 item_gap-x30">
        {relatedcategory.length > 0 ? (
          <Relatedcategory88 relatedcategory={relatedcategory} categoryslug={categoryslug} />
        ) : (
          <p>No related categories found.</p>
        )}
      </div>

      <section id="faq" className="pt-40 layout-pb-md">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row y-gap-20">
              <div className="col-12 text-center">
                <h2 className="text-22 fw-500">FAQs about {formattedCategory} hotels</h2>
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