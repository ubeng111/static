// Client.jsx
"use client"; // Mark this as a Client Component

import Image from "next/image"; // next/image biasanya aman, tidak perlu dynamic import
import dynamic from "next/dynamic"; // Import dynamic untuk komponen yang hanya dirender di klien

// Dynamically import ALL potentially problematic components with ssr: false.
// Ini adalah langkah paling aman untuk mengatasi prerendering issues.
const Header1 = dynamic(() => import("@/components/header/header-11"), { ssr: false });
const Footer = dynamic(() => import("@/components/footer/"), { ssr: false });
const WhyChoose = dynamic(() => import("@/components/block/BlockGuide"), { ssr: false });
const Block1 = dynamic(() => import("@/components/about/Block1"), { ssr: false });
const Counter = dynamic(() => import("@/components/counter/Counter"), { ssr: false });
const Testimonial = dynamic(() => import("@/components/testimonial/Testimonial"), { ssr: false });
const Counter2 = dynamic(() => import("@/components/counter/Counter2"), { ssr: false });
const CallToActions = dynamic(() => import("@/components/common/CallToActions"), { ssr: false }); // Juga dynamic import ini

const Client = () => {
  return (
    <>
      <div className="header-margin"></div>

      <Header1 />

      <section className="section-bg layout-pt-lg layout-pb-lg">
        <div className="section-bg__item col-12">
          <Image
            width={1920}
            height={400}
            src="/img/pages/about/1.png"
            alt="image"
            priority
          />
        </div>

        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-xl-6 col-lg-8 col-md-10">
              <h1 className="text-40 md:text-25 fw-600 text-white">
                Looking for joy?
              </h1>
              <div className="text-white mt-15">
                Your trusted trip companion
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Why Choose Us</h2>
                <p className="sectionTitle__text mt-5 sm:mt-0">
                  These popular destinations have a lot to offer
                </p>
              </div>
            </div>
          </div>

          <div className="row y-gap-40 justify-between pt-50">
            <WhyChoose />
          </div>
        </div>
      </section>

      <section className="layout-pt-md">
        <div className="container">
          <div className="row y-gap-30 justify-between items-center">
            <Block1 />
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
                  Overheard from travelers
                </h2>
                <p className="sectionTitle__text mt-5 sm:mt-0">
                  These popular destinations have a lot to offer
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

      <CallToActions />

      <Footer />
    </>
  );
};

export default Client;