// app/(others)/contact/Client.jsx
"use client"; // Mark this as a Client Component

import Image from "next/image"; // Image dari next/image biasanya aman untuk SSR
import dynamic from "next/dynamic"; // Import dynamic untuk komponen yang hanya dirender di klien

// Dynamically import components that are likely to cause SSR/prerendering issues.
// Ini adalah langkah paling aman untuk mengatasi prerendering issues.
const Header1 = dynamic(() => import("@/components/header/header-11"), { ssr: false });
const Footer = dynamic(() => import("@/components/footer/"), { ssr: false });
const CallToActions = dynamic(() => import("@/components/common/CallToActions"), { ssr: false });

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
                Contact Us
              </h1>
              <div className="text-white mt-15">
                We're here to help!
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="row y-gap-30">
            {/* Bagian Informasi Kontak Statis */}
            <div className="col-12">
              <h2 className="text-22 fw-500 mb-20">Get in Touch</h2>
              <p className="text-dark-1 mb-20">
                Have questions or need assistance? Reach out to us through the following channels:
              </p>
              <div className="text-dark-1">
                <p><strong>Address:</strong> 123 Travel Avenue, Tourism City, TX 78901</p>
                <p><strong>Phone:</strong> +1 234 567 890</p>
                <p><strong>Email:</strong> support@hoteloza.com</p>
                <p><strong>Working Hours:</strong> Mon - Fri, 9 AM - 5 PM</p>
              </div>
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