'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

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
          background-color: #001F3F;
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
          background-color: #003366;
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

      <div className="py-10 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <TopBreadCrumb88 hotel={hotel} />
            </div>
          </div>
        </div>
      </div>

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
        <div className="container">
          <GalleryTwo hotel={hotel} />
        </div>
      </section>

      <section className="pt-40 layout-pb-md">
        <div className="container">
          <div className="accordion -simple js-accordion" id="hotelAccordion">
            <AccordionItem
              id="overviewCollapse"
              icon="fas fa-info-circle"
              title={`About ${hotel?.title}`}
              isOpen={openSections.overview}
              toggle={() => toggleSection('overview')}
              ariaLabel={`Toggle About ${hotel?.title}`}
            >
              <p>{hotel?.overview || 'Discover the luxury and comfort of this hotel, offering top amenities and a memorable stay.'}</p>
            </AccordionItem>

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

            {hotel?.latitude && hotel?.longitude && (
              <>
                <AccordionItem
                  id="mapCollapse"
                  icon="fas fa-map-marker-alt"
                  title="Location Map"
                  isOpen={openSections.map}
                  toggle={() => toggleSection('map')}
                  ariaLabel="Toggle Location Map"
                >
                  <MapComponent latitude={hotel.latitude} longitude={hotel.longitude} />
                </AccordionItem>

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
              </>
            )}

            {relatedHotels && relatedHotels.length > 0 && (
              <AccordionItem
                id="relatedHotelsCollapse"
                icon="fas fa-hotel"
                title={`Popular properties similar to ${hotel?.title}`}
                isOpen={openSections.relatedHotels}
                toggle={() => toggleSection('relatedHotels')}
                ariaLabel={`Toggle Popular properties similar to ${hotel?.title}`}
              >
                <Hotels2
                  hotels={relatedHotels}
                  categoryslug={categoryslug}
                  countryslug={countryslug}
                  stateslug={stateslug}
                  cityslug={cityslug}
                />
              </AccordionItem>
            )}
          </div>
        </div>
      </section>

      <CallToActions />
      <DefaultFooter />
    </>
  );
}