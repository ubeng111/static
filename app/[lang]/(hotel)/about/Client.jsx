// app/[lang]/(others)/about/Client.jsx
"use client"; // WAJIB: Ini adalah Client Component

// --- MODIFIKASI: Import Komponen Secara LANGSUNG ---
// Karena Client.jsx sudah 'use client;', komponen-komponen ini dapat diimpor secara langsung.
// PASTIKAN SEMUA KOMPONEN INI JUGA ADALAH CLIENT COMPONENTS JIKA MEREKA MENGGUNAKAN HOOKS ATAU DOM API.
// (yaitu, memiliki 'use client;' di bagian paling atas file mereka).

import WhyChoose from "@/components/block/BlockGuide"; // Perlu diperiksa data-aos
import Block1 from "@/components/about/Block1"; // Perlu diperiksa data-aos
import Counter from "@/components/counter/Counter"; // SUDAH DIUBAH DI ATAS
import Testimonial from "@/components/home/home-1/Testimonial"; // Perlu diperiksa data-aos
import Counter2 from "@/components/counter/Counter2"; // Perlu diperiksa data-aos
import Footer from "@/components/footer"; // Perlu diperiksa data-aos
import CallToActions from "@/components/common/CallToActions"; // Perlu diperiksa data-aos
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox"; // Perlu diperiksa data-aos
import Header1 from "@/components/header/header-11"; // Perlu diperiksa data-aos


// Add currentLang to the destructured props
const Client = ({ dictionary, currentLang }) => {
  const aboutDict = dictionary?.about || {};
  const blockGuideDict = dictionary?.blockGuide || {};
  const commonDict = dictionary?.common || {};
  const homepageDict = dictionary?.homepage || {}; // Tidak digunakan langsung di sini, tapi mungkin di komponen anak.

  return (
    <>
      <Header1 dictionary={dictionary} currentLang={currentLang} />

      <div className="header-margin"></div>

      <section className="section-bg layout-pt-lg layout-pb-lg">
        <div className="section-bg__item col-12">
          <img
            width={1920}
            height={400}
            src="/img/pages/about/1.png"
            alt={aboutDict.imageAlt || "About Us Background"}
          />
        </div>

        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-xl-6 col-lg-8 col-md-10">
              <h1 className="text-40 md:text-25 fw-600 text-white">
                {aboutDict.lookingForJoy || "Looking for Joy?"}
              </h1>
              <div className="text-white mt-15">
                {aboutDict.trustedTripCompanion || "Your trusted trip companion."}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <MainFilterSearchBox dictionary={dictionary} currentLang={currentLang} />
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{aboutDict.whyChooseUs || "Why Choose Us?"}</h2>
                <p className="sectionTitle__text mt-5 sm:mt-0">
                  {aboutDict.popularDestinationsOffer || "Discover popular destinations and offers."}
                </p>
              </div>
            </div>
          </div>

          <div className="row y-gap-40 justify-between pt-50">
            <WhyChoose blockGuide={blockGuideDict} />
          </div>
        </div>
      </section>

      <section className="layout-pt-md">
        <div className="container">
          <div className="row y-gap-30 justify-between items-center">
            <Block1 dictionary={dictionary} />
          </div>
        </div>
      </section>

      <section className="pt-60">
        <div className="container">
          <div className="border-bottom-light pb-40">
            <div className="row y-gap-30 justify-center text-center">
              <Counter /> {/* Counter sudah diubah di atas */}
            </div>
          </div>
        </div>
      </section>

      <section className="section-bg layout-pt-lg layout-pb-lg">
        <div className="section-bg__item -mx-20 bg-light-2" />
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  {aboutDict.overheardFromTravelers || "What Travelers Say About Us"}
                </h2>
                <p className="sectionTitle__text mt-5 sm:mt-0">
                  {aboutDict.popularDestinationsOffer || "Discover popular destinations and offers."}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden pt-80 js-section-slider">
            <div className="item_gap-x30">
              <Testimonial dictionary={dictionary} />
            </div>
          </div>

          <div className="row y-gap-30 items-center pt-40 sm:pt-20">
            <div className="col-xl-4">
              <Counter2 />
            </div>
          </div>
        </div>
      </section>

      <CallToActions dictionary={dictionary} currentLang={currentLang} />

      <Footer dictionary={dictionary} currentLang={currentLang} />
    </>
  );
};

export default Client;