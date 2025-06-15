// app/[lang]/(others)/about/Client.jsx
"use client";

import dynamic from "next/dynamic";

const WhyChoose = dynamic(() => import("@/components/block/BlockGuide"), { ssr: false });
const Block1 = dynamic(() => import("@/components/about/Block1"), { ssr: false });
const Counter = dynamic(() => import("@/components/counter/Counter"), { ssr: false });
const Testimonial = dynamic(() => import("@/components/testimonial/Testimonial"), { ssr: false });
const Counter2 = dynamic(() => import("@/components/counter/Counter2"), { ssr: false });
import Footer from "@/components/footer";
import CallToActions from "@/components/common/CallToActions";
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";
import Header2 from "@/components/header/header2"; // Import Header11



// Add currentLang to the destructured props
const Client = ({ dictionary, currentLang }) => {
  const aboutDict = dictionary?.about || {};
  const blockGuideDict = dictionary?.blockGuide || {};
  const commonDict = dictionary?.common || {};
  const homepageDict = dictionary?.homepage || {};

  return (
    <>
              <Header2 dictionary={dictionary} currentLang={currentLang} />

      <div className="header-margin"></div>


      <section className="section-bg layout-pt-lg layout-pb-lg">
        <div className="section-bg__item col-12">
          <img
            width={1920}
            height={400}
            src="/img/pages/about/1.png"
            alt="image"
          />
        </div>

        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-xl-6 col-lg-8 col-md-10">
              <h1 className="text-40 md:text-25 fw-600 text-white">
                {aboutDict.lookingForJoy}
              </h1>
              <div className="text-white mt-15">
                {aboutDict.trustedTripCompanion}

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
              {/* Pass currentLang here */}

              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{aboutDict.whyChooseUs}</h2>
                <p className="sectionTitle__text mt-5 sm:mt-0">
                  {aboutDict.popularDestinationsOffer}
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
              <Counter />
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
                  {aboutDict.overheardFromTravelers}
                </h2>
                <p className="sectionTitle__text mt-5 sm:mt-0">
                  {aboutDict.popularDestinationsOffer}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden pt-80 js-section-slider">
            <div className="item_gap-x30">
              <Testimonial />
            </div>
          </div>

          <div className="row y-gap-30 items-center pt-40 sm:pt-20">
            <div className="col-xl-4">
              <Counter2 />
            </div>
          </div>
        </div>
      </section>
      {/* Pass currentLang here */}
      <CallToActions dictionary={dictionary} currentLang={currentLang} />

      {/* Pass currentLang here */}
      <Footer dictionary={dictionary} currentLang={currentLang} />

    </>
  );
};

export default Client;