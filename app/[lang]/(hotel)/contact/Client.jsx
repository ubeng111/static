// app/[lang]/(others)/contact/Client.jsx
"use client";

import Footer from "@/components/footer";
import CallToActions from "@/components/common/CallToActions";
import Header2 from "@/components/header/header2"; // Import Header11



const Client = ({ dictionary, currentLang }) => { // Accept currentLang as a prop
  // Ambil bagian-bagian dictionary yang relevan, dengan fallback objek kosong
  const contactPageDict = dictionary?.contactPage || {};
  const navigationDict = dictionary?.navigation || {};
  const footerDict = dictionary?.footer || {};

  // --- DEBUGGING CLIENT SIDE (akan muncul di konsol browser Anda) ---
  console.log("CLIENT: Dictionary received in Client.jsx (contact):", dictionary);
  console.log("CLIENT: currentLang received in Client.jsx (contact):", currentLang); // Debugging currentLang
  console.log("CLIENT: contactPageDict:", contactPageDict);
  console.log("CLIENT: navigationDict:", navigationDict);
  console.log("CLIENT: footerDict:", footerDict);
  console.log("CLIENT: Hero Title from dict:", contactPageDict.heroTitle);
  // --- END DEBUGGING ---

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
            alt="Contact Us"
          />
        </div>
        {/* Pass currentLang here */}

        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-xl-6 col-lg-8 col-md-10">
              <h1 className="text-40 md:text-25 fw-600 text-white">
                {contactPageDict.heroTitle}
              </h1>
              <div className="text-white mt-15">
                {contactPageDict.heroSubtitle}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="row y-gap-30">

            <div className="col-12">

              <h2 className="text-22 fw-500 mb-20">{contactPageDict.getInTouchTitle}</h2>
              <p className="text-dark-1 mb-20">
                {contactPageDict.getInTouchDescription}
              </p>
              <div className="text-dark-1">
                <p><strong>{contactPageDict.addressLabel}:</strong> {contactPageDict.addressValue}</p>
                <p><strong>{contactPageDict.emailLabel}:</strong> {contactPageDict.emailValue}</p>
                <p><strong>{contactPageDict.workingHoursLabel}:</strong> {contactPageDict.workingHoursValue}</p>
              </div>
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