// ClientPage.jsx (Category)
'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import ReactPaginate from 'react-paginate';
import Relatedcategory88 from '@/components/hotel-single/Relatedcategory88';
import HotelProperties88 from '@/components/hotel-list/hotel-list-v5/HotelProperties88';
import FaqCategory from '@/components/faq/Faqcategory'; // Import komponen FAQCategory

const CallToActions = dynamic(() => import('@/components/common/CallToActions'), { ssr: false });
const Header11 = dynamic(() => import('@/components/header/header-11'), { ssr: false });
const Footer = dynamic(() => import('@/components/footer/'), { ssr: false });
const MainFilterSearchBox = dynamic(() => import('@/components/hotel-list/common/MainFilterSearchBox'), { ssr: false });
const TopBreadCrumbCategory = dynamic(() => import('@/components/hotel-list/hotel-list-v5/TopBreadCrumbCategory'), { ssr: false });

// Menerima longDescription sebagai array objek dari page.jsx
export default function ClientPage({ categoryslug, longDescriptionSegments }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  const fetcher = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
  }, []);

  const { data, error, isLoading } = useSWR(`/api/${categoryslug}?page=${page}`, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const hotels = useMemo(() => data?.hotels || [], [data]);
  const relatedcategory = useMemo(() => data?.relatedcategory || [], [data]);
  const pagination = useMemo(() => data?.pagination || { page: 1, totalPages: 1, totalHotels: 0 }, [data]);
  const formattedCategory = useMemo(
    () => (categoryslug ? categoryslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Category'),
    [categoryslug]
  );

  // Data items untuk FAQCategory (opsional, jika Anda ingin menampilkan daftar hotel di FAQ)
  const faqItems = useMemo(() => hotels.map(hotel => ({
    name: hotel.title || hotel.name,
    slug: hotel.hotelslug // Pastikan slug hotel tersedia jika ingin link
  })), [hotels]);

  // Ambil deskripsi singkat dari konten paragraf pertama array
  const shortDescription = useMemo(() => {
    if (!longDescriptionSegments || longDescriptionSegments.length === 0) return '';
    const firstParagraphContent = longDescriptionSegments[0].content;
    const firstSentenceEnd = firstParagraphContent.indexOf('. ');
    if (firstSentenceEnd !== -1 && firstSentenceEnd < 140) {
      return firstParagraphContent.substring(0, firstSentenceEnd + 1).trim();
    }
    return firstParagraphContent.substring(0, 150).trim() + (firstParagraphContent.length > 150 ? '...' : '');
  }, [longDescriptionSegments]);


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

  if (!hotels.length) {
    return <div>No hotels found for this category.</div>;
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
                {/* H1 Tag */}
                <h1 className="text-30 fw-600 text-white">
                  {`Discover The Best ${formattedCategory} Options Worldwide`}
                </h1>
                {/* Deskripsi Singkat di bawah H1 */}
                <p className="text-16 text-white mt-10">
                  {shortDescription}
                </p>
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

      {/* Bagian H2 dan LONG DESKRIPSI penuh setelah paginasi dan daftar hotel */}
      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="text-24 fw-600 mb-20">
                {`About Our ${formattedCategory} Collection`} {/* H2 Tag baru */}
              </h2>
              {/* Render setiap segmen paragraf dengan sub-header */}
              {longDescriptionSegments.map((segment, index) => (
                <div key={index} className="mt-10">
                  {segment.subHeader && (
                    <h5 className="text-18 fw-500 mb-5">{segment.subHeader}</h5>
                  )}
                  <p className="text-15">{segment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
                {/* H2 Tag untuk FAQ */}
                <h2 className="text-22 fw-500">
                  {`Frequently Asked Questions About ${formattedCategory}s`}
                </h2>
              </div>
              <div className="col-lg-8 offset-lg-2">
                <div className="accordion -simple row y-gap-20 js-accordion">
                  <FaqCategory category={formattedCategory} items={faqItems} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToActions />
      <Footer />
    </>
  );
}