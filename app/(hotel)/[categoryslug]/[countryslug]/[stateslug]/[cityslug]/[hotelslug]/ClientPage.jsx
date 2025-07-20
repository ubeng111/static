// ClientPage.jsx
'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

import GalleryTwo from '@/components/hotel-single/GalleryTwo';
// Dynamic imports with ssr: true for components that can be server-rendered
// and benefit from Suspense for loading states or potential hydration issues.
// Note: ssr: true is default for dynamic, explicitly setting here for clarity.
const CallToActions = dynamic(() => import('@/components/common/CallToActions'), { ssr: true });
const Header11 = dynamic(() => import('@/components/header/header-11'), { ssr: true });
const Footer = dynamic(() => import('@/components/footer/'), { ssr: true });
// MapComponent explicitly ssr: false as it's client-side only (often due to browser APIs)
const MapComponent = dynamic(() => import('@/components/hotel-single/MapComponent'), { ssr: false });
const Facilities = dynamic(() => import('@/components/hotel-single/Facilities'), { ssr: true });
const Hotels2 = dynamic(() => import('@/components/hotels/Hotels2'), { ssr: true });
const LandmarkList = dynamic(() => import('@/components/hotel-single/LandmarkList'), { ssr: true });
const TopBreadCrumb88 = dynamic(() => import('@/components/hotel-single/TopBreadCrumb88'), { ssr: true });
const MainFilterSearchBox = dynamic(() => import('@/components/hotel-list/common/MainFilterSearchBox'), { ssr: true });
const RelatedHotels = dynamic(() => import('@/components/hotel-single/RelatedHotels'), { ssr: true });

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
  landmarks,
}) {
  const [openSections, setOpenSections] = useState({
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
        <p>Data hotel tidak tersedia. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  return (
    <>
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
      <Suspense fallback={<div>Memuat Header...</div>}>
        <Header11 />
      </Suspense>


      <div className="py-10 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Suspense fallback={<div>Memuat Breadcrumb...</div>}>
                <TopBreadCrumb88 hotel={hotel} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <section className="layout-pt-md">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Suspense fallback={<div>Memuat kotak pencarian...</div>}>
                <MainFilterSearchBox />
              </Suspense>
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
              id="facilitiesCollapse"
              icon="fas fa-concierge-bell"
              title={`Fasilitas ${hotel?.title}`}
              isOpen={openSections.facilities}
              toggle={() => toggleSection('facilities')}
              ariaLabel={`Alihkan Fasilitas ${hotel?.title}`}
            >
              <div className="row x-gap-40 y-gap-40">
                <Suspense fallback={<div>Memuat Fasilitas...</div>}>
                  <Facilities />
                </Suspense>
              </div>
            </AccordionItem>

            {hotel?.latitude && hotel?.longitude && (
              <AccordionItem
                id="landmarkCollapse"
                icon="fas fa-landmark"
                title="Landmark Terdekat"
                isOpen={openSections.landmark}
                toggle={() => toggleSection('landmark')}
                ariaLabel="Alihkan Landmark Terdekat"
              >
                <Suspense fallback={<div>Memuat Landmark...</div>}>
                  <LandmarkList landmarks={landmarks} />
                </Suspense>
              </AccordionItem>
            )}

            {relatedHotels?.length > 0 && (
              <AccordionItem
                id="relatedHotelsCollapse"
                icon="fas fa-hotel"
                title={`Properti populer serupa dengan ${hotel?.title}`}
                isOpen={openSections.relatedHotels}
                toggle={() => toggleSection('relatedHotels')}
                ariaLabel={`Alihkan Properti populer serupa dengan ${hotel?.title}`}
              >
                <div className="row justify-center text-center">
                  <div className="col-auto">
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                      Properti populer serupa dengan {hotel?.title}
                    </h2>
                    <p style={{ fontSize: '14px', marginTop: '14px' }}>
                      Temukan penginapan berperingkat teratas dengan fasilitas serupa di dekat tujuan Anda
                    </p>
                  </div>
                </div>
                <div className="pt-40 sm:pt-20 item_gap-x30">
                  <Suspense fallback={<div>Memuat Hotel Terkait (1/2)...</div>}>
                    <Hotels2
                      relatedHotels={relatedHotels}
                      categoryslug={categoryslug}
                      countryslug={countryslug}
                      stateslug={stateslug}
                      cityslug={cityslug}
                    />
                  </Suspense>
                  <Suspense fallback={<div>Memuat Hotel Terkait (2/2)...</div>}>
                    <RelatedHotels
                      relatedHotels={relatedHotels}
                      category={categoryslug}
                      city={hotel?.city || cityslug?.replace(/-/g, ' ') || ''}
                    />
                  </Suspense>
                </div>
              </AccordionItem>
            )}
          </div>

          <div className="row y-gap-30">
            <div className="col-12">
              <div className="accordion -simple js-accordion" id="sidebarAccordion">
                {hotel?.latitude && hotel?.longitude && (
                  <AccordionItem
                    id="mapCollapse"
                    icon="fas fa-map-marker-alt"
                    title="Peta Lokasi"
                    isOpen={openSections.map}
                    toggle={() => toggleSection('map')}
                    ariaLabel="Alihkan Peta Lokasi"
                  >
                    {/* MapComponent sudah ssr:false, jadi Suspense di sini lebih untuk fallback saat di-mount */}
                    <Suspense fallback={<div>Memuat Peta...</div>}>
                      <MapComponent
                        latitude={hotel?.latitude}
                        longitude={hotel?.longitude}
                        title={hotel?.title}
                      />
                    </Suspense>
                  </AccordionItem>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div>Memuat Call to Actions...</div>}>
        <CallToActions />
      </Suspense>
      <Suspense fallback={<div>Memuat Footer...</div>}>
        <Footer />
      </Suspense>
    </>
  );
}