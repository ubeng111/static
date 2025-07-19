// ClientPage.jsx (City)
'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import ReactPaginate from 'react-paginate';
import Relatedcity88 from '@/components/hotel-single/Relatedcity88';
import HotelProperties88 from '@/components/hotel-list/hotel-list-v5/HotelProperties88';

const CallToActions = dynamic(() => import('@/components/common/CallToActions'), { ssr: false });
const Header11 = dynamic(() => import('@/components/header/header-11'), { ssr: false });
const Footer = dynamic(() => import('@/components/footer/'), { ssr: false });
const Faqcity = dynamic(() => import('@/components/faq/Faqcity'), { ssr: false });
const MainFilterSearchBox = dynamic(() => import('@/components/hotel-list/common/MainFilterSearchBox'), { ssr: false });
const TopBreadCrumbCity = dynamic(() => import('@/components/hotel-list/hotel-list-v5/TopBreadCrumbCity'), { ssr: false });

// Helper function to format slugs (added for consistent formatting in client)
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

export default function ClientPage({
  categoryslug,
  countryslug,
  stateslug,
  cityslug,
  formattedCategory,
  formattedCity,
  formattedState,
  formattedCountry,
  longDescriptionSegments: initialLongDescriptionSegments // Renamed prop to distinguish from useMemo result
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  const fetcher = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        // Attempt to parse error message if available, otherwise use status text
        const errorText = await response.text();
        let errorMessage = `Failed to fetch data: ${response.status} - ${response.statusText}`;
        try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.message) {
                errorMessage = errorJson.message;
            }
        } catch (e) {
            // Not a JSON error message, use default
        }
        throw new Error(errorMessage);
    }
    return response.json();
  }, []);

  const { data, error, isLoading } = useSWR(
    `/api/${categoryslug}/${countryslug}/${stateslug}/${cityslug}?page=${page}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      // Error handling for SWR, can be more granular
      onError: (err) => {
          console.error("SWR Error fetching hotels:", err.message);
      }
    }
  );

  const hotels = useMemo(() => data?.hotels || [], [data]);
  const relatedcity = useMemo(() => data?.relatedcity || [], [data]);
  const pagination = useMemo(() => data?.pagination || { page: 1, totalPages: 1, totalHotels: 0 }, [data]);

  // Ensure longDescriptionSegments is an array, using the passed prop as initial value
  const longDescriptionSegments = useMemo(() => initialLongDescriptionSegments || [], [initialLongDescriptionSegments]);

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
      router.push(`/${categoryslug}/${countryslug}/${stateslug}/${cityslug}?page=${newPage}`, { shallow: true });
      window.scrollTo(0, 0);
    },
    [categoryslug, countryslug, stateslug, cityslug, pagination.page, router]
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
    // Display a user-friendly error message
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>Oops! There was an error loading the page.</h2>
            <p>{error.message || 'Please try again later.'}</p>
        </div>
    );
  }

  // Changed this check to use hotels.length, which is derived from data?.hotels || []
  // Only show "No hotels found" if not loading and no error, and the array is empty
  if (!hotels.length && !isLoading && !error) {
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>No hotels found for this location.</h2>
            <p>Please check back later or explore other destinations.</p>
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
                {/* H1 Tag */}
                <h1 className="text-30 fw-600 text-white">
                  {`Discover Best ${formattedCategory} Options in ${formattedCity}, ${formattedState}`}
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

      <TopBreadCrumbCity categoryslug={categoryslug} countryslug={countryslug} stateslug={stateslug} cityslug={cityslug} />

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
            {/* Conditional rendering for hotels array to ensure it's not empty */}
            {hotels.length > 0 ? (
                <HotelProperties88 hotels={hotels} />
            ) : (
                <div className="col-12 text-center">
                    <p>No accommodations found matching your criteria. Please adjust your search.</p>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Only show pagination if there are hotels and more than one page */}
      {hotels.length > 0 && pagination.totalPages > 1 && (
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

      {/* Bagian H2 dan LONG DESKRIPSI penuh setelah paginasi dan daftar hotel */}
      {/* Ensure longDescriptionSegments is an array and not empty before mapping */}
      {longDescriptionSegments.length > 0 && (
        <section className="layout-pt-md layout-pb-lg">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className="text-24 fw-600 mb-20">
                  {`About Our ${formattedCategory} Collection in ${formattedCity}, ${formattedState}`}
                </h2>
                {/* Render setiap segmen paragraf dengan sub-header */}
                {longDescriptionSegments.map((segment, index) => (
                  <div key={index} className="mt-10">
                    {segment.subHeader && (
                      <h3 className="text-18 fw-500 mb-5">{segment.subHeader}</h3>
                    )}
                    <p className="text-15">{segment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="pt-40 sm:pt-20 item_gap-x30">
        {relatedcity.length > 0 ? (
          <Relatedcity88
            relatedcity={relatedcity}
            categoryslug={categoryslug}
            countryslug={countryslug}
            stateslug={stateslug}
            cityslug={cityslug}
          />
        ) : (
          <p>No related cities found.</p>
        )}
      </div>

      <section id="faq" className="pt-40 layout-pb-md">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row y-gap-20">
              <div className="col-12 text-center">
                {/* H2 Tag untuk FAQ */}
                <h2 className="text-22 fw-500">
                  {`Frequently Asked Questions About ${formattedCategory} in ${formattedCity}`}
                </h2>
              </div>
              <div className="col-lg-8 offset-lg-2">
                <div className="accordion -simple row y-gap-20 js-accordion">
                  <Faqcity
                    city={formattedCity}
                    category={formattedCategory}
                    stateName={formattedState}
                    countryName={formattedCountry}
                    hotels={hotels}
                    categoryslug={categoryslug}
                    countryslug={countryslug}
                    stateslug={stateslug}
                    cityslug={cityslug}
                  />
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