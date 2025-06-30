import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";

const index = () => {
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
                Find, Book, and Relax with Hoteloza              </h1>
              <p
                className="text-white mt-6 md:mt-10"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Explore thousands of hotels worldwide with Hoteloza
              </p>
            </div>

            <div
              className="tabs -underline mt-60 js-tabs w-full py-8"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <MainFilterSearchBox />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default index;
