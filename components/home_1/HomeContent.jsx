// components/home_1/HomeContent.jsx
"use client";

// --- MODIFIKASI: Impor Komponen Secara Dinamis (next/dynamic) ---
import dynamic from 'next/dynamic';

const DynamicHero1 = dynamic(() => import("@/components/hero/hero-1"), {
  ssr: false, // Jika komponen ini hanya berinteraksi di client
  loading: () => <p>Loading hero section...</p>,
});

const DynamicBlockGuide = dynamic(() => import("@/components/block/BlockGuide"), {
  ssr: false, // Mungkin memiliki interaksi atau SVG besar
  loading: () => <p>Loading guide blocks...</p>,
});

const DynamicDestinations = dynamic(() => import("@/components/home/home-1/Destinations"), {
  ssr: false, // Komponen daftar destinasi seringkali interaktif/punya banyak gambar
  loading: () => <p>Loading destinations...</p>,
});

const DynamicTestimonial = dynamic(() => import("@/components/home/home-1/Testimonial"), {
  ssr: false, // Komponen testimonial bisa punya carousel/slider
  loading: () => <p>Loading testimonials...</p>,
});

const DynamicTestimonialLeftCol = dynamic(() => import("@/components/home/home-1/TestimonialLeftCol"), {
  ssr: false, // Bagian lain dari testimonial
  loading: () => <p>Loading testimonial details...</p>,
});

const DynamicFooter = dynamic(() => import("@/components/footer"), {
  ssr: false, // Footer seringkali statis, tapi bisa jadi punya JS besar
  loading: () => <p>Loading footer...</p>,
});

const DynamicCallToActions = dynamic(() => import("@/components/common/CallToActions"), {
  ssr: false, // Mungkin punya interaksi JS
  loading: () => <p>Loading call to action...</p>,
});

const DynamicHeader11 = dynamic(() => import("@/components/header/header-11"), {
  ssr: false, // Header seringkali punya JS interaktif (misal dropdown, navigasi)
  loading: () => <p>Loading header...</p>,
});
// --- AKHIR MODIFIKASI next/dynamic ---

const HomeContent = ({ dictionary, currentLang }) => { // currentLang is received as a prop
  const commonDict = dictionary?.common || {};
  const homepageDict = dictionary?.homepage || {};
  const blockGuideDict = dictionary?.blockGuide || {};
  const mainFilterSearchBoxDict = dictionary?.mainFilterSearchBox || {}; // Meskipun tidak digunakan langsung di HomeContent, mungkin relevan di komponen anak.

  return (
    <>
      {/* Ganti Header11 dengan DynamicHeader11 */}
      <DynamicHeader11 dictionary={dictionary} currentLang={currentLang} />

      {/* Ganti Hero1 dengan DynamicHero1 */}
      <DynamicHero1 dictionary={dictionary} currentLang={currentLang} />

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-between">
            {/* Ganti BlockGuide dengan DynamicBlockGuide */}
            <DynamicBlockGuide blockGuide={blockGuideDict} />
          </div>
        </div>
      </section>

      <section className="layout-pt-lg layout-pb-lg bg-blue-2">
        <div className="container">
          <div className="row y-gap-40 justify-between">
            <div className="col-xl-5 col-lg-6" data-aos="fade-up">
              {/* Ganti TestimonialLeftCol dengan DynamicTestimonialLeftCol */}
              <DynamicTestimonialLeftCol dictionary={{ homepage: homepageDict }} />
            </div>
            <div className="col-lg-6">
              <div
                className="overflow-hidden js-testimonials-slider-3"
                data-aos="fade-up"
                data-aos-delay="50"
              >
                {/* Ganti Testimonial dengan DynamicTestimonial */}
                <DynamicTestimonial dictionary={dictionary}/>
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
            {/* Ganti Destinations dengan DynamicDestinations */}
            <DynamicDestinations dictionary={{ common: commonDict }} locale={currentLang} />
          </div>
        </div>
      </section>

      {/* Ganti CallToActions dengan DynamicCallToActions */}
      <DynamicCallToActions dictionary={dictionary} currentLang={currentLang} />

      {/* Ganti Footer dengan DynamicFooter */}
      <DynamicFooter dictionary={dictionary} currentLang={currentLang} />
    </>
  );
};

export default HomeContent;