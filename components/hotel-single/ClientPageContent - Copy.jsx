'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import CallToActions from '@/components/common/CallToActions';
import Header11 from '@/components/header/header-11';
import DefaultFooter from '@/components/footer/default';
import HotelProperties88 from '@/components/hotel-list/hotel-list-v5/HotelProperties88';
import Hotels2 from '@/components/hotels/Hotels2';
import LandmarkList from '@/components/hotel-single/LandmarkList';
import GalleryTwo from '@/components/hotel-single/GalleryTwo';
import MapComponent from '@/components/hotel-single/MapComponent';
import Relatedcategory88 from '@/components/hotel-single/Relatedcategory88';
import Relatedcountry88 from '@/components/hotel-single/Relatedcountry88';
import Relatedstate88 from '@/components/hotel-single/Relatedstate88';
import Relatedcity88 from '@/components/hotel-single/Relatedcity88';
import MainFilterSearchBox from '@/components/hotel-list/common/MainFilterSearchBox';

const TopBreadCrumb88 = dynamic(() => import('@/components/hotel-single/TopBreadCrumb88'), { ssr: false });
const Facilities = dynamic(() => import('@/components/hotel-single/Facilities'), { ssr: false });
const HelpfulFacts = dynamic(() => import('@/components/hotel-single/HelpfulFacts'), { ssr: false });
const RelatedHotels = dynamic(() => import('@/components/hotel-single/RelatedHotels'), { ssr: false });
const Faq = dynamic(() => import('@/components/faq/Faq'), { ssr: false });

const ClientPageContent = ({
  hotel,
  relatedHotels,
  hotels,
  landmarks,
  gallery,
  latitude,
  longitude,
  relatedcategory,
  relatedcountry,
  relatedstate,
  relatedcity,
  pagination,
  categoryslug,
  countryslug,
  stateslug,
  cityslug,
  faqComponent,
  useHotels2 = false,
  handlePageClick,
}) => {
  const isSingleHotel = !!hotel;
  const slug = isSingleHotel
    ? hotel?.title || 'Hotel'
    : cityslug || stateslug || countryslug || categoryslug || 'Hotels';
  const capitalizedSlug = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const metaTitle = isSingleHotel
    ? `${capitalizedSlug} - Book Now`
    : `Hotels in ${capitalizedSlug}`;
  const metaDescription = isSingleHotel
    ? `Book ${capitalizedSlug}, a luxury hotel with top amenities. Enjoy a memorable stay.`
    : `Explore luxury hotels in ${capitalizedSlug}. Book your perfect stay today.`;

  const [openSections, setOpenSections] = useState({
    facilities: true,
    helpfulFacts: true,
    map: true,
    landmark: true,
    faq: true,
    relatedHotels: true,
    hotels2: true,
    related: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {isSingleHotel && hotel?.img && (
          <link rel="preload" as="image" href={hotel.img} />
        )}
      </Head>

      <style jsx>{`
        .accordion-header {
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          border-radius: 8px;
          padding: 15px 20px;
          background-color: #1a5aa6;
          color: #ffffff;
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: 500;
          font-size: 16px;
          border: none;
          width: 100%;
          text-align: left;
        }
        .accordion-header:hover {
          background-color: #12497e;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .accordion-body {
          background-color: #f8fafc;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          padding: 20px;
        }
        .accordion-icon {
          margin-right: 12px;
          font-size: 18px;
        }
        .accordion-chevron {
          margin-left: auto;
          transition: transform 0.3s ease;
        }
        .accordion-chevron.open {
          transform: rotate(180deg);
        }
        .pagination .page-item .page-link {
          min-width: 44px;
          min-height: 44px;
          margin: 0 8px;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div className="header-margin"></div>
      <Header11 />

      {isSingleHotel ? (
        <>
          <div className="py-10 bg-white">
            <div className="container">
              <div className="row">
                <div className="col-12"></div>
              </div>
            </div>
          </div>
          <TopBreadCrumb88 hotel={hotel} />

          <section className="layout-pt-md">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <MainFilterSearchBox />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-40" id="overview">
            <GalleryTwo hotel={hotel} />
          </section>

          <section className="pt-40 layout-pb-md">
            <div className="container">
              <div className="accordion -simple js-accordion" id="hotelAccordion">
                <div className="accordion-item mb-20">
                  <button
                    className="accordion-header"
                    onClick={() => toggleSection('facilities')}
                    data-bs-toggle="collapse"
                    data-bs-target="#facilitiesCollapse"
                    aria-expanded={openSections.facilities}
                    aria-controls="facilitiesCollapse"
                    aria-label={`Toggle Facilities of ${hotel?.title}`}
                    type="button"
                  >
                    <i className="fas fa-concierge-bell accordion-icon"></i>
                    Facilities of {hotel?.title}
                    <i
                      className={`fas fa-chevron-down accordion-chevron ${openSections.facilities ? 'open' : ''}`}
                    ></i>
                  </button>
                  <div
                    id="facilitiesCollapse"
                    className={`accordion-collapse collapse ${openSections.facilities ? 'show' : ''}`}
                  >
                    <div className="accordion-body">
                      <div className="row x-gap-40 y-gap-40">
                        <Facilities />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="accordion-item mb-20">
                  <button
                    className="accordion-header"
                    onClick={() => toggleSection('helpfulFacts')}
                    data-bs-toggle="collapse"
                    data-bs-target="#helpfulFactsCollapse"
                    aria-expanded={openSections.helpfulFacts}
                    aria-controls="helpfulFactsCollapse"
                    aria-label="Toggle Helpful Facts"
                    type="button"
                  >
                    <i className="fas fa-info-circle accordion-icon"></i>
                    Helpful Facts
                    <i
                      className={`fas fa-chevron-down accordion-chevron ${openSections.helpfulFacts ? 'open' : ''}`}
                    ></i>
                  </button>
                  <div
                    id="helpfulFactsCollapse"
                    className={`accordion-collapse collapse ${openSections.helpfulFacts ? 'show' : ''}`}
                  >
                    <div className="accordion-body">
                      <div className="row x-gap-50 y-gap-30">
                        <HelpfulFacts hotel={hotel} />
                      </div>
                    </div>
                  </div>
                </div>

                {hotel?.latitude && hotel?.longitude && (
                  <div className="accordion-item mb-20">
                    <button
                      className="accordion-header"
                      onClick={() => toggleSection('map')}
                      data-bs-toggle="collapse"
                      data-bs-target="#mapCollapse"
                      aria-expanded={openSections.map}
                      aria-controls="mapCollapse"
                      aria-label="Toggle Location Map"
                      type="button"
                    >
                      <i className="fas fa-map-marker-alt accordion-icon"></i>
                      Location Map
                      <i
                        className={`fas fa-chevron-down accordion-chevron ${openSections.map ? 'open' : ''}`}
                      ></i>
                    </button>
                    <div
                      id="mapCollapse"
                      className={`accordion-collapse collapse ${openSections.map ? 'show' : ''}`}
                    >
                      <div className="accordion-body">
                        <MapComponent
                          latitude={hotel.latitude}
                          longitude={hotel.longitude}
                          title={hotel.title}
                          isOpen={openSections.map}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {hotel?.latitude && hotel?.longitude && (
                  <div className="accordion-item mb-20">
                    <button
                      className="accordion-header"
                      onClick={() => toggleSection('landmark')}
                      data-bs-toggle="collapse"
                      data-bs-target="#landmarkCollapse"
                      aria-expanded={openSections.landmark}
                      aria-controls="landmarkCollapse"
                      aria-label="Toggle Nearby Landmarks"
                      type="button"
                    >
                      <i className="fas fa-landmark accordion-icon"></i>
                      Nearby Landmarks
                      <i
                        className={`fas fa-chevron-down accordion-chevron ${openSections.landmark ? 'open' : ''}`}
                      ></i>
                    </button>
                    <div
                      id="landmarkCollapse"
                      className={`accordion-collapse collapse ${openSections.landmark ? 'show' : ''}`}
                    >
                      <div className="accordion-body">
                        <LandmarkList
                          latitude={hotel.latitude}
                          longitude={hotel.longitude}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="accordion-item mb-20">
                  <button
                    className="accordion-header"
                    onClick={() => toggleSection('faq')}
                    data-bs-toggle="collapse"
                    data-bs-target="#faqCollapse"
                    aria-expanded={openSections.faq}
                    aria-controls="faqCollapse"
                    aria-label={`Toggle FAQs about ${hotel?.title}`}
                    type="button"
                  >
                    <i className="fas fa-question-circle accordion-icon"></i>
                    FAQs about {hotel?.title}
                    <i
                      className={`fas fa-chevron-down accordion-chevron ${openSections.faq ? 'open' : ''}`}
                    ></i>
                  </button>
                  <div
                    id="faqCollapse"
                    className={`accordion-collapse collapse ${openSections.faq ? 'show' : ''}`}
                  >
                    <div className="accordion-body">
                      <div className="row y-gap-20">
                        <Faq title={hotel?.title} />
                      </div>
                    </div>
                  </div>
                </div>

                {relatedHotels && relatedHotels.length > 0 && (
                  <div className="accordion-item mb-20">
                    <button
                      className="accordion-header"
                      onClick={() => toggleSection('relatedHotels')}
                      data-bs-toggle="collapse"
                      data-bs-target="#relatedHotelsCollapse"
                      aria-expanded={openSections.relatedHotels}
                      aria-controls="relatedHotelsCollapse"
                      aria-label={`Toggle Popular properties similar to ${hotel?.title}`}
                      type="button"
                    >
                      <i className="fas fa-hotel accordion-icon"></i>
                      Popular properties similar to {hotel?.title}
                      <i
                        className={`fas fa-chevron-down accordion-chevron ${openSections.relatedHotels ? 'open' : ''}`}
                      ></i>
                    </button>
                    <div
                      id="relatedHotelsCollapse"
                      className={`accordion-collapse collapse ${openSections.relatedHotels ? 'show' : ''}`}
                    >
                      <div className="accordion-body">
                        <div className="row justify-center text-center">
                          <div className="col-auto">
                 <div className="sectionTitle -sm">
                            <h2
                          className="sectionTitle__title"
                       style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}
                                 >
                          Popular properties similar to {hotel?.title || 'Hotel'}
                                </h2>
                              <p
                       className="sectionTitle__text"
                       style={{ fontSize: '14px', marginTop: '14px' }}
                       >
                    Find top-rated stays with similar perks near your destination  </p>
                            </div>
                          </div>
                        </div>
                        <div className="pt-40 sm:pt-20 item_gap-x30">
                          <Hotels2 relatedHotels={relatedHotels} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="accordion-item mb-20">
                  <button
                    className="accordion-header"
                    onClick={() => toggleSection('related')}
                    data-bs-toggle="collapse"
                    data-bs-target="#relatedComponentCollapse"
                    aria-expanded={openSections.related}
                    aria-controls="relatedComponentCollapse"
                    aria-label={`Toggle Related Content for ${capitalizedSlug}`}
                    type="button"
                  >
                    <i className="fas fa-link accordion-icon"></i>
                    Related Content
                    <i
                      className={`fas fa-chevron-down accordion-chevron ${openSections.related ? 'open' : ''}`}
                    ></i>
                  </button>
                  <div
                    id="relatedComponentCollapse"
                    className={`accordion-collapse collapse ${openSections.related ? 'show' : ''}`}
                  >
                    <div className="accordion-body">
                      <div className="pt-40 sm:pt-20 item_gap-x30">
                        {isSingleHotel ? (
                          relatedHotels && relatedHotels.length > 0 ? (
                            <RelatedHotels relatedHotels={relatedHotels} />
                          ) : (
                            <p>No related hotels found.</p>
                          )
                        ) : relatedcity ? (
                          <Relatedcity88 relatedcity={relatedcity} />
                        ) : relatedstate ? (
                          <Relatedstate88 relatedstate={relatedstate} />
                        ) : relatedcountry ? (
                          <Relatedcountry88 relatedcountry={relatedcountry} />
                        ) : relatedcategory ? (
                          <Relatedcategory88 relatedcategory={relatedcategory} />
                        ) : (
                          <p>Tidak ada data terkait ditemukan.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="section-bg pt-40 pb-40 relative z-5">
            <div className="section-bg__item col-12">
              <img
                src="/img/misc/bg-1.webp"
                srcSet="/img/misc/bg-1.webp 480w, /img/misc/bg-1.webp 768w, /img/misc/bg-1.webp 1200w"
                alt="Luxury background image"
                loading="lazy"
                className="w-full h-full object-cover"
                width="1200"
                height="800"
              />
            </div>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="text-center">
                    <h1 className="text-30 fw-600 text-white">
                      Find Your Dream Luxury {capitalizedSlug}
                    </h1>
                  </div>
                  <MainFilterSearchBox />
                </div>
              </div>
            </div>
          </section>

          <section className="layout-pt-md layout-pb-lg">
            <div className="container">
              <div className="accordion -simple js-accordion" id="mainAccordion">
                <div className="accordion-item mb-20">
                  <button
                    className="accordion-header"
                    onClick={() => toggleSection('hotels2')}
                    data-bs-toggle="collapse"
                    data-bs-target="#hotels2Collapse"
                    aria-expanded={openSections.hotels2}
                    aria-controls="hotels2Collapse"
                    aria-label={`Toggle Hotels in ${capitalizedSlug}`}
                    type="button"
                  >
                    <i className="fas fa-hotel accordion-icon"></i>
                    Hotels in {capitalizedSlug}
                    <i
                      className={`fas fa-chevron-down accordion-chevron ${openSections.hotels2 ? 'open' : ''}`}
                    ></i>
                  </button>
                  <div
                    id="hotels2Collapse"
                    className={`accordion-collapse collapse ${openSections.hotels2 ? 'show' : ''}`}
                  >
                    <div className="accordion-body">
                      <div className="row">
                        {useHotels2 ? <Hotels2 hotels={hotels} /> : <HotelProperties88 hotels={hotels} />}
                      </div>
                    </div>
                  </div>
                </div>

                {landmarks && landmarks.length > 0 && (
                  <div className="accordion-item mb-20">
                    <button
                      className="accordion-header"
                      onClick={() => toggleSection('landmark')}
                      data-bs-toggle="collapse"
                      data-bs-target="#landmarkCollapse"
                      aria-expanded={openSections.landmark}
                      aria-controls="landmarkCollapse"
                      aria-label={`Toggle Landmark Populer di ${capitalizedSlug}`}
                      type="button"
                    >
                      <i className="fas fa-landmark accordion-icon"></i>
                      Landmark Populer di {capitalizedSlug}
                      <i
                        className={`fas fa-chevron-down accordion-chevron ${openSections.landmark ? 'open' : ''}`}
                      ></i>
                    </button>
                    <div
                      id="landmarkCollapse"
                      className={`accordion-collapse collapse ${openSections.landmark ? 'show' : ''}`}
                    >
                      <div className="accordion-body">
                        <LandmarkList landmarks={landmarks} />
                      </div>
                    </div>
                  </div>
                )}

                {gallery && gallery.length > 0 && (
                  <div className="accordion-item mb-20">
                    <button
                      className="accordion-header"
                      onClick={() => toggleSection('gallery')}
                      data-bs-toggle="collapse"
                      data-bs-target="#galleryCollapse"
                      aria-expanded={openSections.gallery}
                      aria-controls="galleryCollapse"
                      aria-label={`Toggle Gallery of ${capitalizedSlug}`}
                      type="button"
                    >
                      <i className="fas fa-image accordion-icon"></i>
                      Gallery of {capitalizedSlug}
                      <i
                        className={`fas fa-chevron-down accordion-chevron ${openSections.gallery ? 'open' : ''}`}
                      ></i>
                    </button>
                    <div
                      id="galleryCollapse"
                      className={`accordion-collapse collapse ${openSections.gallery ? 'show' : ''}`}
                    >
                      <div className="accordion-body">
                        <GalleryTwo gallery={gallery} />
                      </div>
                    </div>
                  </div>
                )}

                {latitude && longitude && (
                  <div className="accordion-item mb-20">
                    <button
                      className="accordion-header"
                      onClick={() => toggleSection('map')}
                      data-bs-toggle="collapse"
                      data-bs-target="#mapCollapse"
                      aria-expanded={openSections.map}
                      aria-controls="mapCollapse"
                      aria-label="Toggle Location Map"
                      type="button"
                    >
                      <i className="fas fa-map-marker-alt accordion-icon"></i>
                      Location Map
                      <i
                        className={`fas fa-chevron-down accordion-chevron ${openSections.map ? 'open' : ''}`}
                      ></i>
                    </button>
                    <div
                      id="mapCollapse"
                      className={`accordion-collapse collapse ${openSections.map ? 'show' : ''}`}
                    >
                      <div className="accordion-body">
                        <MapComponent
                          latitude={latitude}
                          longitude={longitude}
                          title={capitalizedSlug}
                          isOpen={openSections.map}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="accordion-item mb-20">
                  <button
                    className="accordion-header"
                    onClick={() => toggleSection('related')}
                    data-bs-toggle="collapse"
                    data-bs-target="#relatedComponentCollapse"
                    aria-expanded={openSections.related}
                    aria-controls="relatedComponentCollapse"
                    aria-label={`Toggle Related Content for ${capitalizedSlug}`}
                    type="button"
                  >
                    <i className="fas fa-link accordion-icon"></i>
                    Related Content
                    <i
                      className={`fas fa-chevron-down accordion-chevron ${openSections.related ? 'open' : ''}`}
                    ></i>
                  </button>
                  <div
                    id="relatedComponentCollapse"
                    className={`accordion-collapse collapse ${openSections.related ? 'show' : ''}`}
                  >
                    <div className="accordion-body">
                      <div className="pt-40 sm:pt-20 item_gap-x30">
                        {isSingleHotel ? (
                          relatedHotels && relatedHotels.length > 0 ? (
                            <RelatedHotels relatedHotels={relatedHotels} />
                          ) : (
                            <p>No related hotels found.</p>
                          )
                        ) : relatedcity ? (
                          <Relatedcity88 relatedcity={relatedcity} />
                        ) : relatedstate ? (
                          <Relatedstate88 relatedstate={relatedstate} />
                        ) : relatedcountry ? (
                          <Relatedcountry88 relatedcountry={relatedcountry} />
                        ) : relatedcategory ? (
                          <Relatedcategory88 relatedcategory={relatedcategory} />
                        ) : (
                          <p>Tidak ada data terkait ditemukan.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {faqComponent && (
                  <div className="accordion-item mb-20">
                    <button
                      className="accordion-header"
                      onClick={() => toggleSection('faq')}
                      data-bs-toggle="collapse"
                      data-bs-target="#faqCollapse"
                      aria-expanded={openSections.faq}
                      aria-controls="faqCollapse"
                      aria-label={`Toggle FAQs about ${capitalizedSlug} hotels`}
                      type="button"
                    >
                      <i className="fas fa-question-circle accordion-icon"></i>
                      FAQs about {capitalizedSlug} hotels
                      <i
                        className={`fas fa-chevron-down accordion-chevron ${openSections.faq ? 'open' : ''}`}
                      ></i>
                    </button>
                    <div
                      id="faqCollapse"
                      className={`accordion-collapse collapse ${openSections.faq ? 'show' : ''}`}
                    >
                      <div className="accordion-body">
                        <div className="row y-gap-20">
                          {faqComponent}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', transform: 'translateY(-90px)', marginTop: '7%' }}>
              <ReactPaginate
                pageCount={pagination.totalPages}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousLabel={null}
                nextLabel={null}
                forcePage={pagination.page - 1}
                pageLinkStyle={{ padding: '10px' }}
              />
            </div>
          )}
        </>
      )}

      <CallToActions />
      <DefaultFooter />
    </>
  );
};

export default ClientPageContent;