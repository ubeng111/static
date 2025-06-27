// app/[lang]/(others)/contact/Client.jsx
"use client";

import Footer from "@/components/footer";
import CallToActions from "@/components/common/CallToActions";
import Header1 from "@/components/header/header-11";
import { useEffect } from "react";


const Client = ({ dictionary, currentLang }) => {
  const contactPageDict = dictionary?.contactPage || {};
  const navigationDict = dictionary?.navigation || {};
  const footerDict = dictionary?.footer || {}; // Masih perlu ini untuk debugging jika diinginkan

  useEffect(() => {
    console.log("CLIENT: Dictionary received in Client.jsx (contact):", dictionary);
    console.log("CLIENT: currentLang received in Client.jsx (contact):", currentLang);
    console.log("CLIENT: contactPageDict:", contactPageDict);
    console.log("CLIENT: navigationDict:", navigationDict);
    console.log("CLIENT: footerDict:", footerDict);
    console.log("CLIENT: Hero Title from dict:", contactPageDict.heroTitle);
  }, [dictionary, currentLang, contactPageDict, navigationDict, footerDict]);

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
            alt={contactPageDict.imageAlt || "Contact Us Background"}
          />
        </div>

        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-xl-6 col-lg-8 col-md-10">
              <h1 className="text-40 md:text-25 fw-600 text-white">
                {contactPageDict.heroTitle || "Get in Touch with Us"}
              </h1>
              <div className="text-white mt-15">
                {contactPageDict.heroSubtitle || "We're here to help and answer any question you might have."}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="row y-gap-30">

            <div className="col-12">

              <h2 className="text-22 fw-500 mb-20">{contactPageDict.getInTouchTitle || "Contact Information"}</h2>
              <p className="text-dark-1 mb-20">
                {contactPageDict.getInTouchDescription || "Feel free to reach out to us using the details below."}
              </p>
              <div className="text-dark-1">
                <p><strong>{contactPageDict.addressLabel || "Address"}:</strong> {contactPageDict.addressValue || "123 Main St, Anytown, USA"}</p>
                <p><strong>{contactPageDict.emailLabel || "Email"}:</strong> {contactPageDict.emailValue || "info@example.com"}</p>
                <p><strong>{contactPageDict.workingHoursLabel || "Working Hours"}:</strong> {contactPageDict.workingHoursValue || "Mon - Fri: 9 AM - 5 PM"}</p>
              </div>
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