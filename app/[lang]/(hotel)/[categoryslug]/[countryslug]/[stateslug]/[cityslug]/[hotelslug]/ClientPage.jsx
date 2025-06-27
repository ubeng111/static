// ClientPage.jsx (Hotel Single Page Detail)
'use client';

import { useState, useMemo, useCallback } from 'react'; // Tambahkan useMemo, useCallback
// Hapus dynamic import untuk semua komponen di sini.
// Karena ClientPage sendiri adalah Client Component, Anda bisa mengimpornya langsung.

import GalleryTwo from '@/components/hotel-single/GalleryTwo';
import TopBreadCrumb88 from '@/components/hotel-single/TopBreadCrumb88';
import Footer from "@/components/footer";
import CallToActions from "@/components/common/CallToActions";
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";
import Header11 from "@/components/header/header-11";

// Impor langsung komponen-komponen ini karena ClientPage sudah 'use client;'
import MapComponent from '@/components/hotel-single/MapComponent';
import Facilities from '@/components/hotel-single/Facilities';
import Hotels2 from '@/components/hotels/Hotels2';
import LandmarkList from '@/components/hotel-single/LandmarkList';
import RelatedHotels from '@/components/hotel-single/RelatedHotels';
import Faq from '@/components/faq/Faq';


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

  const toggleSection = useCallback((section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  // Pastikan hotel adalah objek yang valid sebelum mencoba merendernya
  if (!hotel) {
    return (
      <div className="text-center py-5">
        <p>{commonDict.hotelNotFound || "Hotel data is not available. Please try again later."}</p>
      </div>
    );
  }

  // Memoized values untuk judul dan label AccordionItem
  const facilitiesTitle = useMemo(() => hotelSinglePageDict.facilitiesAndServices || `Facilities & Services of ${hotel?.title || commonDict.unnamedHotel}`, [hotelSinglePageDict, hotel, commonDict]);
  const facilitiesAriaLabel = useMemo(() => hotelSinglePageDict.toggleFacilities || `Toggle Facilities of ${hotel?.title || commonDict.unnamedHotel}`, [hotelSinglePageDict, hotel, commonDict]);

  const attractionsTitle = useMemo(() => hotelSinglePageDict.attractionsNearby || "Attractions Nearby", [hotelSinglePageDict]);
  const attractionsAriaLabel = useMemo(() => hotelSinglePageDict.toggleLandmarks || "Toggle Nearby Landmarks", [hotelSinglePageDict]);

  const relatedHotelsTitle = useMemo(() => `${hotelSinglePageDict.relatedHotels || "Popular properties similar to"} ${hotel?.title || commonDict.unnamedHotel}`, [hotelSinglePageDict, hotel, commonDict]);
  const relatedHotelsAriaLabel = useMemo(() => `${hotelSinglePageDict.toggleRelatedHotels || "Toggle Popular properties similar to"} ${hotel?.title || commonDict.unnamedHotel}`, [hotelSinglePageDict, hotel, commonDict]);

  const faqTitle = useMemo(() => hotelSinglePageDict.frequentlyAskedQuestions || "Frequently Asked Questions", [hotelSinglePageDict]);
  const faqAriaLabel = useMemo(() => hotelSinglePageDict.toggleFrequentlyAskedQuestions || "Toggle Frequently Asked Questions", [hotelSinglePageDict]);

  const mapTitle = useMemo(() => hotelSinglePageDict.locationMap || "Location Map", [hotelSinglePageDict]);
  const mapAriaLabel = useMemo(() => hotelSinglePageDict.toggleLocationMap || "Toggle Location Map", [hotelSinglePageDict]);


  return (
    <>
      <Header11 dictionary={dictionary} currentLang={currentLang} />

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
        .accordion-body {
          background-color: #f8fafc;
          border-radius: 0 0 8px 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
      `}</style>

      <div className="header-margin"></div>

      <div className="py-10 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <TopBreadCrumb88 hotel={hotel} dictionary={dictionary} currentLang={currentLang} />
            </div>
          </div>
        </div>
      </div>

      <section className="layout-pt-md">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <MainFilterSearchBox dictionary={dictionary} currentLang={currentLang} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-40" id="overview">
        <div className="container">
          <GalleryTwo hotel={hotel} />
        </div>
      </section>

      <section className="pt-40 layout-pb-md">
        <div className="container">
          <div className="accordion -simple js-accordion" id="hotelAccordion">
            {/* Facilities Section */}
            <AccordionItem
              id="facilitiesCollapse"
              icon="fas fa-concierge-bell"
              title={facilitiesTitle}
              isOpen={openSections.facilities}
              toggle={() => toggleSection('facilities')}
              ariaLabel={facilitiesAriaLabel}
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
                title={attractionsTitle}
                isOpen={openSections.landmark}
                toggle={() => toggleSection('landmark')}
                ariaLabel={attractionsAriaLabel}
              >
                <LandmarkList latitude={hotel.latitude} longitude={hotel.longitude} dictionary={dictionary} currentLang={currentLang} />
              </AccordionItem>
            )}

            {/* Related Hotels Section */}
            {relatedHotels?.length > 0 && (
              <AccordionItem
                id="relatedHotelsCollapse"
                icon="fas fa-hotel"
                title={relatedHotelsTitle}
                isOpen={openSections.relatedHotels}
                toggle={() => toggleSection('relatedHotels')}
                ariaLabel={relatedHotelsAriaLabel}
              >
                <div className="row justify-center text-center">
                  <div className="col-auto">
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                      {relatedHotelsTitle}
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
              title={faqTitle}
              isOpen={openSections.faq}
              toggle={() => toggleSection('faq')}
              ariaLabel={faqAriaLabel}
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
                    title={mapTitle}
                    isOpen={openSections.map}
                    toggle={() => toggleSection('map')}
                    ariaLabel={mapAriaLabel}
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
      <CallToActions dictionary={dictionary} currentLang={currentLang} />

      <Footer dictionary={dictionary} currentLang={currentLang} />
    </>
  );
}