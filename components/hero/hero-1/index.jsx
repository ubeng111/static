// components/hero/hero-1/index.jsx
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";

// Komponen Hero pertama, menerima dictionary dan currentLang sebagai prop
const Hero1 = ({ dictionary, currentLang }) => { // <--- Tambahkan currentLang di sini
  // Mengakses bagian dictionary yang relevan, menyediakan objek kosong sebagai fallback
  const homepageDict = dictionary?.homepage || {};
  // mainFilterSearchBoxDict tidak perlu dibuat terpisah di sini jika dictionary utuh diteruskan
  // const mainFilterSearchBoxDict = dictionary?.mainFilterSearchBox || {};

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
                data-aos="fade-up"
              >
                {/* Menggunakan teks dari dictionary untuk judul hero */}
                {homepageDict.hotelozaHeroTitle || "Find, Book, and Relax with Hoteloza"}
              </h1>
              <p
                className="text-white mt-6 md:mt-10"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {/* Menggunakan teks dari dictionary untuk subjudul hero */}
                {homepageDict.hotelozaHeroSubtitle || "Explore thousands of hotels worldwide with Hoteloza"}
              </p>
            </div>

            <div
              className="tabs -underline mt-60 js-tabs w-full py-8"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {/* Meneruskan dictionary UTUH dan currentLang */}
              <MainFilterSearchBox dictionary={dictionary} currentLang={currentLang} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;