// components/home_1/HomeContent.jsx
"use client";

import Hero1 from "@/components/hero/hero-1";
import BlockGuide from "@/components/block/BlockGuide";
import Destinations from "@/components/home/home-1/Destinations";
import Testimonial from "@/components/home/home-1/Testimonial";
import TestimonialLeftCol from "@/components/home/home-1/TestimonialLeftCol";
import Footer from "@/components/footer";
import CallToActions from "@/components/common/CallToActions";
import Header1 from "@/components/header/header-11"; // PASTIKAN PATH INI BENAR (mengarah ke components/index.jsx)

const HomeContent = ({ dictionary, currentLang }) => {
  const commonDict = dictionary?.common || {};
  const homepageDict = dictionary?.homepage || {};
  const blockGuideDict = dictionary?.blockGuide || {};
  const mainFilterSearchBoxDict = dictionary?.mainFilterSearchBox || {};

  return (
    <>
      <Header1 dictionary={dictionary} currentLang={currentLang} />

      <Hero1 dictionary={dictionary} currentLang={currentLang} />

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-between">
            <BlockGuide blockGuide={blockGuideDict} />
          </div>
        </div>
      </section>

      <section className="layout-pt-lg layout-pb-lg bg-blue-2">
        <div className="container">
          <div className="row y-gap-40 justify-between">
            <div className="col-xl-5 col-lg-6" data-aos="fade-up">
              <TestimonialLeftCol dictionary={{ homepage: homepageDict }} />
            </div>
            <div className="col-lg-6">
              <div
                className="overflow-hidden js-testimonials-slider-3"
                data-aos="fade-up"
                data-aos-delay="50"
              >
                <Testimonial dictionary={dictionary}/>
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
            <Destinations dictionary={{ common: commonDict }} locale={currentLang} />
          </div>
        </div>
      </section>

      <CallToActions dictionary={dictionary} currentLang={currentLang} />

      <Footer dictionary={dictionary} currentLang={currentLang} />
    </>
  );
};

export default HomeContent;