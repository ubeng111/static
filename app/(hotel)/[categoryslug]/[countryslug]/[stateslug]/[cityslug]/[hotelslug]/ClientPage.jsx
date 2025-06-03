'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components
const CallToActions = dynamic(() => import('@/components/common/CallToActions'), { ssr: false });
const Header11 = dynamic(() => import('@/components/header/header-11'), { ssr: false });
const DefaultFooter = dynamic(() => import('@/components/footer/default'), { ssr: false });
const GalleryTwo = dynamic(() => import('@/components/hotel-single/GalleryTwo'), { ssr: false });
const MapComponent = dynamic(() => import('@/components/hotel-single/MapComponent'), { ssr: false });
const Facilities = dynamic(() => import('@/components/hotel-single/Facilities'), { ssr: false });
const Hotels2 = dynamic(() => import('@/components/hotels/Hotels2'), { ssr: false });
const LandmarkList = dynamic(() => import('@/components/hotel-single/LandmarkList'), { ssr: false });
const TopBreadCrumb88 = dynamic(() => import('@/components/hotel-single/TopBreadCrumb88'), { ssr: false });
const MainFilterSearchBox = dynamic(() => import('@/components/hotel-list/common/MainFilterSearchBox'), { ssr: false });
const RelatedHotels = dynamic(() => import('@/components/hotel-single/RelatedHotels'), { ssr: false });

// Reusable AccordionItem component
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

export default function ClientPage({
  hotel,
  relatedHotels,
  hotelslug,
  categoryslug,
  countryslug,
  stateslug,
  cityslug,
}) {
  // State for accordion sections
  const [openSections, setOpenSections] = useState({
    overview: true,
    facilities: true,
    map: true,
    landmark: true,
    relatedHotels: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Safeguard for missing hotel data
  if (!hotel) {
    return (
      <div className="text-center py-5">
        <p>Hotel data is not available. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .accordion-header {
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          border-radius: 8px;
          padding: 15px 20px;
          background-color: #001F3F; /* Navy blue */
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
          background-color: #003366; /* Lighter navy blue for hover */
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
      `}</style>

      <div className="header-margin"></div>
      <Header11 />

      {/* Top Breadcrumb Section */}
      <div className="py-10 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <TopBreadCrumb88 hotel={hotel} />
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter Section */}
      <section className="layout-pt-md">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <MainFilterSearchBox />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="mt-40" id="overview">
        <div className="container">
          <GalleryTwo hotel={hotel} />
        </div>
      </section>

      {/* Main Sections */}
      <section className="pt-40 layout-pb-md">
        <div className="container">
          <div className="accordion -simple js-accordion" id="hotelAccordion">
            {/* Overview Section */}
            

            {/* Facilities Section */}
            <AccordionItem
              id="facilitiesCollapse"
              icon="fas fa-concierge-bell"
              title={`Facilities of ${hotel?.title}`}
              isOpen={openSections.facilities}
              toggle={() => toggleSection('facilities')}
              ariaLabel={`Toggle Facilities of ${hotel?.title}`}
            >
              <div className="row x-gap-40 y-gap-40">
                <Facilities />
              </div>
            </AccordionItem>

            {/* Nearby Landmarks Section */}
            {hotel?.latitude && hotel?.longitude && (
              <AccordionItem
                id="landmarkCollapse"
                icon="fas fa-landmark"
                title="Nearby Landmarks"
                isOpen={openSections.landmark}
                toggle={() => toggleSection('landmark')}
                ariaLabel="Toggle Nearby Landmarks"
              >
                <LandmarkList latitude={hotel.latitude} longitude={hotel.longitude} />
              </AccordionItem>
            )}

            {/* Related Hotels Section with Hotels2 and RelatedHotels */}
            {relatedHotels && relatedHotels.length > 0 && (
              <AccordionItem
                id="relatedHotelsCollapse"
                icon="fas fa-hotel"
                title={`Popular properties similar to ${hotel?.title}`}
                isOpen={openSections.relatedHotels}
                toggle={() => toggleSection('relatedHotels')}
                ariaLabel={`Toggle Popular properties similar to ${hotel?.title}`}
              >
                <div className="row justify-center text-center">
                  <div className="col-auto">
                    <div className="sectionTitle -simple">
                      <h2
                        className="sectionTitle"
                        style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}
                      >
                        Popular properties similar to {hotel?.title || 'Hotel'}
                      </h2>
                      <p
                        className="sectionTitle"
                        style={{ fontSize: '14px', marginTop: '14px' }}
                      >
                        Find top-rated stays with similar perks near your destination
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-40 sm:pt-20 item_gap-x30">
                  <Hotels2 relatedHotels={relatedHotels} />
                  <RelatedHotels
                    relatedHotels={relatedHotels}
                    category={categoryslug}
                    city={hotel?.city || ''}
                  />
                </div>
              </AccordionItem>
            )}
          </div>

          {/* Sidebar (Map) */}
          <div className="row y-gap-30">
            <div className="col-12">
              <div className="accordion -simple js-accordion" id="sidebarAccordion">
                {hotel?.latitude && hotel?.longitude && (
                  <AccordionItem
                    id="mapCollapse"
                    icon="fas fa-map-marker-alt"
                    title="Location Map"
                    isOpen={openSections.map}
                    toggle={() => toggleSection('map')}
                    ariaLabel="Toggle Location Map"
                  >
                    <MapComponent
                      latitude={hotel?.latitude}
                      longitude={hotel?.longitude}
                      title={hotel?.title}
                    />
                  </AccordionItem>
                )}
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