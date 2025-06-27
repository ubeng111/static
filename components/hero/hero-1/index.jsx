// File: components/hero/hero-1/index.jsx
// Ini adalah Server Component

import { Suspense } from 'react';
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";

const Hero1 = ({ dictionary, currentLang }) => {
  const homepageDict = dictionary?.homepage || {};

  return (
    <section className="masthead -type-1 z-5 py-12">
      <div className="masthead__bg">
        <img alt="image" src="/img/masthead/1/bg.webp" className="js-lazy" />
      </div>
      <div className="container py-12">
        <div className="row justify-center">
          <div className="col-12 col-md-11 col-lg-10 col-xl-10 mx-auto">
            <div className="text-center mb-8">
              <h1
                className="text-40 lg:text-40 md:text-30 text-white"
                // Hapus data-aos dari sini
                // data-aos="fade-up"
              >
                {homepageDict.hotelozaHeroTitle || "Find, Book, and Relax with Hoteloza"}
              </h1>
              <p
                className="text-white mt-6 md:mt-10"
                // Hapus data-aos dari sini
                // data-aos="fade-up"
                // data-aos-delay="100"
              >
                {homepageDict.hotelozaHeroSubtitle || "Explore thousands of hotels worldwide with Hoteloza"}
              </p>
            </div>

            <div
              className="tabs -underline mt-60 js-tabs w-full py-8"
              // Hapus data-aos dari sini
              // data-aos="fade-up"
              // data-aos-delay="200"
            >
              {/* === INI BAGIAN PALING PENTING === */}
              {/* MainFilterSearchBox HARUS Client Component. */}
              {/* Bungkus komponen klien dengan Suspense */}
              <Suspense fallback={<div className="text-white text-center p-5">Loading Search Form...</div>}>
                <MainFilterSearchBox dictionary={dictionary} currentLang={currentLang} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;