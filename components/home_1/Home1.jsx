// Home1.jsx
// Asumsi: Ini adalah Server Component. Jika ada hooks atau interaktivitas, tambahkan 'use client';

import { Suspense } from 'react'; // WAJIB: Impor Suspense untuk membungkus komponen klien.

import Hero1 from "@/components/hero/hero-1"; // Hero1 harus diubah
import BlockGuide from "@/components/block/BlockGuide"; // Sudah diubah
import Destinations from "@/components/home/home-1/Destinations"; // Perlu diperiksa
import Testimonial from "@/components/home/home-1/Testimonial"; // Perlu diperiksa
import TestimonialLeftCol from "@/components/home/home-1/TestimonialLeftCol"; // Perlu diperiksa
import Footer from "@/components/footer"; // Perlu diperiksa
import CallToActions from "@/components/common/CallToActions"; // Perlu diperiksa
import Header1 from "@/components/header/header-11"; // Perlu diperiksa


const Home1 = ({ dictionary, currentLang }) => {
  const commonDict = dictionary?.common || {};
  const homepageDict = dictionary?.homepage || {};
  const blockGuideDict = dictionary?.blockGuide || {};

  return (
    <>
      {/* Header1 diasumsikan sebagai Client Component karena adanya masalah AOS/Hydration */}
      <Suspense fallback={
        <div style={{ height: '60px', background: '#252525' }}></div> // Fallback yang lebih baik
      }>
        <Header1 dictionary={dictionary} currentLang={currentLang} />
      </Suspense>

      {/* Pemanggilan Hero1 sudah benar. Perbaikan untuk MainFilterSearchBox ada di dalam komponen Hero1. */}
      {/* Hero1 sendiri juga diasumsikan Server Component, tetapi MainFilterSearchBox di dalamnya adalah Client Component */}
      <Hero1 dictionary={dictionary} currentLang={currentLang} />

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-between">
            <BlockGuide blockGuide={blockGuideDict} /> {/* data-aos sudah dihapus di BlockGuide.jsx */}
          </div>
        </div>
      </section>

      <section className="layout-pt-lg layout-pb-lg bg-blue-2">
        <div className="container">
          <div className="row y-gap-40 justify-between">
            <div className="col-xl-5 col-lg-6" /* HAPUS data-aos DARI SINI */>
              <TestimonialLeftCol dictionary={{ homepage: homepageDict }} /> {/* Pastikan TestimonialLeftCol adalah Server Component dan tidak ada data-aos */}
            </div>
            <div className="col-lg-6">
              <div
                className="overflow-hidden js-testimonials-slider-3"
                /* HAPUS data-aos DARI SINI */
              >
                <Testimonial dictionary={dictionary}/> {/* Pastikan Testimonial adalah Server Component dan tidak ada data-aos */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{homepageDict.dreamDestinations}</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {homepageDict.unforgettableSpots}
                </p>
              </div>
            </div>
          </div>
          <div className="tabs -pills pt-40 js-tabs">
            <Destinations dictionary={{ common: commonDict }} locale={currentLang} /> {/* Pastikan Destinations adalah Server Component dan tidak ada data-aos */}
          </div>
        </div>
      </section>

      <CallToActions dictionary={dictionary} currentLang={currentLang} /> {/* Pastikan CallToActions adalah Server Component dan tidak ada data-aos */}
      
      <Footer dictionary={dictionary} currentLang={currentLang} /> {/* Pastikan Footer adalah Server Component dan tidak ada data-aos */}
    </>
  );
};

export default Home1;