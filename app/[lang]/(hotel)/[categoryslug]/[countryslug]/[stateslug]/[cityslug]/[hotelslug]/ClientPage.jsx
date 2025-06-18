// ClientPage.jsx (Hotel Single Page Detail)
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// --- MODIFIKASI: Impor Komponen Secara Dinamis (next/dynamic) ---

// Komponen-komponen yang diimpor secara dinamis
const DynamicGalleryTwo = dynamic(() => import('@/components/hotel-single/GalleryTwo'), { ssr: false, loading: () => <p>Loading gallery...</p> });
const DynamicTopBreadCrumb88 = dynamic(() => import('@/components/hotel-single/TopBreadCrumb88'), { ssr: false, loading: () => <p>Loading breadcrumbs...</p> });
const DynamicFooter = dynamic(() => import("@/components/footer"), { ssr: false, loading: () => <p>Loading footer...</p> });
const DynamicCallToActions = dynamic(() => import("@/components/common/CallToActions"), { ssr: false, loading: () => <p>Loading call to actions...</p> });
const DynamicMainFilterSearchBox = dynamic(() => import("@/components/hotel-list/common/MainFilterSearchBox"), { ssr: false, loading: () => <p>Loading search box...</p> });
const DynamicHeader11 = dynamic(() => import("@/components/header/header-11"), { ssr: false, loading: () => <p>Loading header...</p> });

// Komponen-komponen yang sudah Anda buat dinamis sebelumnya
const MapComponent = dynamic(() => import('@/components/hotel-single/MapComponent'), { ssr: false });
const Facilities = dynamic(() => import('@/components/hotel-single/Facilities'), { ssr: false });
const Hotels2 = dynamic(() => import('@/components/hotels/Hotels2'), { ssr: false });
const LandmarkList = dynamic(() => import('@/components/hotel-single/LandmarkList'), { ssr: false });
const RelatedHotels = dynamic(() => import('@/components/hotel-single/RelatedHotels'), { ssr: false });
const Faq = dynamic(() => import('@/components/faq/Faq'), { ssr: false });

// --- AKHIR MODIFIKASI next/dynamic ---

// AccordionItem Component (dibuat di sini agar bisa menggunakan dictionary dari parent ClientPage)
const AccordionItem = ({ id, icon, title, isOpen, toggle, ariaLabel, children }) => (
  <div className="accordion-item mb-20">
    <button
      className="accordion-header"
      onClick={toggle}
      data-bs-toggle="collapse"
      data-bs-target={`#${id}`}
      aria-expanded={isOpen}
      aria-controls={id}
      aria-label={ariaLabel}
      type="button"
    >
      <i className={`${icon} accordion-icon`}></i>
      {title}
      <i className={`fas fa-chevron-down accordion-chevron ${isOpen ? 'open' : ''}`}></i>
    </button>
    <div id={id} className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
      <div className="accordion-body">{children}</div>
    </div>
  </div>
);

// Main ClientPage component for Hotel Single Page Detail
export default function ClientPage({
  hotel,
  relatedHotels,
  hotelslug,
  categoryslug,
  countryslug,
  stateslug,
  cityslug,
  dictionary,
  currentLang,
}) {
  const [openSections, setOpenSections] = useState({
    facilities: true,
    map: true,
    landmark: true,
    relatedHotels: true,
    faq: true,
  });

  // Akses dictionary yang relevan
  const commonDict = dictionary?.common || {};
  const hotelSinglePageDict = dictionary?.hotelSinglePage || {};

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!hotel) {
    return (
      <div className="text-center py-5">
        <p>{commonDict.hotelNotFound || "Hotel data is not available. Please try again later."}</p>
      </div>
    );
  }

  return (
    <>
      <DynamicHeader11 dictionary={dictionary} currentLang={currentLang} />

      <style jsx global>{`
        .accordion-item .accordion-header {
          background-color: #0056b3 !important;
          color: white !important;
          border-radius: 8px;
          padding: 15px 20px;
          font-weight: 500;
          font-size: 16px;
          border: none;
          width: 100%;
          text-align: left;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .accordion-item .accordion-header:hover {
          background-color: #003366 !important;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .accordion-body {
          background-color: #f8fafc;
          border-radius: 0 0 8px 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
      `}</style>

      <div className="header-margin"></div>

      <div className="py-10 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <DynamicTopBreadCrumb88 hotel={hotel} dictionary={dictionary} currentLang={currentLang} />
            </div>
          </div>
        </div>
      </div>

      <section className="layout-pt-md">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <DynamicMainFilterSearchBox dictionary={dictionary} currentLang={currentLang} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-40" id="overview">
        <div className="container">
          <DynamicGalleryTwo hotel={hotel} />
        </div>
      </section>

      <section className="pt-40 layout-pb-md">
        <div className="container">
          <div className="accordion -simple js-accordion" id="hotelAccordion">
            {/* Facilities Section */}
            <AccordionItem
              id="facilitiesCollapse"
              icon="fas fa-concierge-bell"
              title={hotelSinglePageDict.facilitiesAndServices || `Facilities & Services of ${hotel?.title}`}
              isOpen={openSections.facilities}
              toggle={() => toggleSection('facilities')}
              ariaLabel={hotelSinglePageDict.toggleFacilities || `Toggle Facilities of ${hotel?.title}`}
            >
              <div className="row x-gap-40 y-gap-40">
                <Facilities dictionary={dictionary} />
              </div>
            </AccordionItem>

            {/* Nearby Landmarks Section */}
            {hotel?.latitude && hotel?.longitude && (
              <AccordionItem
                id="landmarkCollapse"
                icon="fas fa-landmark"
                title={hotelSinglePageDict.attractionsNearby || "Attractions Nearby"}
                isOpen={openSections.landmark}
                toggle={() => toggleSection('landmark')}
                ariaLabel={hotelSinglePageDict.toggleLandmarks || "Toggle Nearby Landmarks"}
              >
                <LandmarkList latitude={hotel.latitude} longitude={hotel.longitude} dictionary={dictionary} currentLang={currentLang} />
              </AccordionItem>
            )}

            {/* Related Hotels Section */}
            {relatedHotels?.length > 0 && (
              <AccordionItem
                id="relatedHotelsCollapse"
                icon="fas fa-hotel"
                title={`${hotelSinglePageDict.relatedHotels || "Popular properties similar to"} ${hotel?.title || "this hotel"}`}
                isOpen={openSections.relatedHotels}
                toggle={() => toggleSection('relatedHotels')}
                ariaLabel={`${hotelSinglePageDict.toggleRelatedHotels || "Toggle Popular properties similar to"} ${hotel?.title || "this hotel"}`}
              >
                <div className="row justify-center text-center">
                  <div className="col-auto">
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                      {`${hotelSinglePageDict.relatedHotels || "Popular properties similar to"} ${hotel?.title || "this hotel"}`}
                    </h2>
                    <p style={{ fontSize: '14px', marginTop: '14px' }}>
                      {commonDict.findTopRatedStays || "Find top-rated stays with similar perks near your destination"}
                    </p>
                  </div>
                </div>
                <div className="pt-40 sm:pt-20 item_gap-x30">
                  <Hotels2
                    relatedHotels={relatedHotels}
                    categoryslug={categoryslug}
                    countryslug={countryslug}
                    stateslug={stateslug}
                    cityslug={cityslug}
                    dictionary={dictionary}
                    currentLang={currentLang}
                  />
                  <RelatedHotels
                    relatedHotels={relatedHotels}
                    category={categoryslug}
                    city={hotel?.city || cityslug?.replace(/-/g, ' ') || ''}
                    dictionary={dictionary}
                    currentLang={currentLang}
                  />
                </div>
              </AccordionItem>
            )}

            {/* FAQ Section */}
            <AccordionItem
              id="faqCollapse"
              icon="fas fa-question-circle"
              title={hotelSinglePageDict.frequentlyAskedQuestions || "Frequently Asked Questions"}
              isOpen={openSections.faq}
              toggle={() => toggleSection('faq')}
              ariaLabel={hotelSinglePageDict.toggleFrequentlyAskedQuestions || "Toggle Frequently Asked Questions"}
            >
              <div id="Faq1" className="row y-gap-20">
                <Faq title={hotel?.title} dictionary={dictionary} />
              </div>
            </AccordionItem>
          </div>

          {/* Map Section in Sidebar */}
          <div className="row y-gap-30 mt-40">
            <div className="col-12">
              <div className="accordion -simple js-accordion" id="sidebarAccordion">
                {hotel?.latitude && hotel?.longitude && (
                  <AccordionItem
                    id="mapCollapse"
                    icon="fas fa-map-marker-alt"
                    title={hotelSinglePageDict.locationMap || "Location Map"}
                    isOpen={openSections.map}
                    toggle={() => toggleSection('map')}
                    ariaLabel={hotelSinglePageDict.toggleLocationMap || "Toggle Location Map"}
                  >
                    <MapComponent
                      latitude={hotel?.latitude}
                      longitude={hotel?.longitude}
                      title={hotel?.title}
                      dictionary={dictionary}
                    />
                  </AccordionItem>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <DynamicCallToActions dictionary={dictionary} currentLang={currentLang} />

      <DynamicFooter dictionary={dictionary} currentLang={currentLang} />
    </>
  );
}