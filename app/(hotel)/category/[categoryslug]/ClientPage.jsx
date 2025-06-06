// ClientPage.jsx
'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import ReactPaginate from 'react-paginate';
import Link from 'next/link';
import Relatedcategory88 from '@/components/hotel-single/Relatedcategory88';
import HotelProperties88 from '@/components/hotel-list/hotel-list-v5/HotelProperties88';

const CallToActions = dynamic(() => import('@/components/common/CallToActions'), { ssr: false });
const Header11 = dynamic(() => import('@/components/header/header-11'), { ssr: false });
const DefaultFooter = dynamic(() => import('@/components/footer/default'), { ssr: false });
const MainFilterSearchBox = dynamic(() => import('@/components/hotel-list/common/MainFilterSearchBox'), { ssr: false });
const TopBreadCrumbCategory = dynamic(() => import('@/components/hotel-list/hotel-list-v5/TopBreadCrumbCategory'), { ssr: false });

export default function ClientPage({ categoryslug, initialData = { hotels: [], relatedcategory: [] } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetcher = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    return response.json();
  }, []);

  const { data, error, isLoading } = useSWR(
    `/api/category/${categoryslug}?page=${page}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      fallbackData: initialData,
    }
  );

  const hotels = useMemo(() => data?.hotels || initialData.hotels, [data, initialData]);
  const relatedcategory = useMemo(() => data?.relatedcategory || initialData.relatedcategory, [data, initialData]);
  const pagination = useMemo(() => data?.pagination || { page: 1, totalPages: 1, totalHotels: 0 }, [data]);
  const formattedCategory = useMemo(
    () => (categoryslug ? categoryslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Category'),
    [categoryslug]
  );

  const handlePageClick = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      if (newPage === pagination.page) return;
      router.push(`/category/${categoryslug}?page=${newPage}`, { shallow: true });
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
    console.error('SWR error:', error);
    return (
      <div className="container text-center py-60">
        <h2 className="text-24 fw-600">Oops! Something went wrong.</h2>
        <p className="mt-10">We couldn't load the hotel listings. Please try again later or explore other categories.</p>
        <div className="mt-20">
          <Link href="/" className="button -md -dark-1 bg-blue-1 text-white">
            Back to Homepage
          </Link>
          <Link href="/category/all" className="button -md -outline-dark-1 ml-10">
            Explore All Categories
          </Link>
        </div>
      </div>
    );
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
            {hotels.length > 0 ? (
              <HotelProperties88 hotels={hotels} />
            ) : (
              <div className="text-center py-60">
                <h2 className="text-24 fw-600">No Hotels Found in {formattedCategory}</h2>
                <p className="mt-10">
                  It looks like we don’t have any hotels in this category yet. Try searching for another category or
                  explore our popular destinations below.
                </p>
                <div className="mt-20">
                  <Link href="/" className="button -md -dark-1 bg-blue-1 text-white">
                    Back to Homepage
                  </Link>
                  <Link href="/category/all" className="button -md -outline-dark-1 ml-10">
                    Explore All Categories
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {hotels.length > 0 && (
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
      )}

      <div className="pt-40 sm:pt-20 item_gap-x30">
        {relatedcategory.length > 0 ? (
          <Relatedcategory88 relatedcategory={relatedcategory} categoryslug={categoryslug} />
        ) : (
          <div className="container text-center">
            <p>No related categories found. Explore more options below:</p>
            <Link href="/category/all" className="button -md -outline-dark-1 mt-10">
              View All Categories
            </Link>
          </div>
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
                <div className="accordion -simple row y-gap-20 js-accordion">
                  <p>Explore common questions about {formattedCategory.toLowerCase()} accommodations or contact us for more details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToActions beginnen aan de slag />
      <DefaultFooter />
    </>
  );
}