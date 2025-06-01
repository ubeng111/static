import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";

const Hotels2 = ({ relatedHotels, itemsToShow = 4 }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: itemsToShow,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 520, settings: { slidesToShow: 1 } },
    ],
  };

  const itemSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  function ArrowSlick(props) {
    const className =
      props.type === "next"
        ? "slick_arrow-between slick_arrow -next arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-next"
        : "slick_arrow-between slick_arrow -prev arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-prev";
    const char =
      props.type === "next" ? (
        <i className="icon icon-chevron-right text-12"></i>
      ) : (
        <span className="icon icon-chevron-left text-12"></span>
      );
    return (
      <button className={className} onClick={props.onClick}>
        {char}
      </button>
    );
  }

  if (!relatedHotels || relatedHotels.length === 0) {
    return <div>No related hotels available.</div>;
  }

  const displayedHotels = relatedHotels.slice(0, 8);

  const getCategoryClass = (category) => {
    const categoryStyles = {
      "Entire bungalow": "bg-brown-1 text-white",
      House: "bg-red-1 text-white",
      Hostel: "bg-dark-1 text-white",
      Hotel: "bg-blue-1 text-white",
      Villa: "bg-brown-1 text-white",
      Guesthouse: "bg-dark-1 text-white",
      Lodge: "bg-blue-1 text-white",
      Ryokan: "bg-brown-1 text-white",
      Homestay: "bg-yellow-1 text-dark-1",
      Inn: "bg-yellow-1 text-dark",
      "Serviced apartment": "bg-dark-3 text-white",
      "Hotel, Inn": "bg-red-1 text-white",
      "Resort villa": "bg-red-1 text-white",
      Motel: "bg-purple-1 text-white",
      "Holiday park": "bg-brown-1 text-white",
      "Apartment/Flat": "bg-blue-1 text-white",
      resort: "bg-purple-1 text-white",
      "Farm stay": "bg-blue-1 text-white",
      Riad: "bg-blue-1 text-white",
      "Motel, Hotel": "bg-yellow-2 text-dark",
      Minsu: "bg-brown-1 text-white",
      "Entire House": "bg-dark-3 text-white",
    };
    return categoryStyles[category] || "bg-blue-1 text-white";
  };

  return (
    <Slider {...settings}>
      {displayedHotels.map((item, i) => {
        const categorySlug = item?.categoryslug || "unknown";
        const countrySlug = item?.countryslug || "unknown";
        const stateSlug = item?.stateslug || "";
        const citySlug = item?.cityslug || "unknown";
        const hotelSlug = item?.hotelslug || "unknown";

        // Tentukan URL berdasarkan keberadaan stateslug
        const hotelUrl = stateSlug
          ? `/${categorySlug}/${countrySlug}/${stateSlug}/${citySlug}/${hotelSlug}`
          : `/${categorySlug}/${countrySlug}/${citySlug}/${hotelSlug}`;

        return (
          <div
            className="col-xl-3 col-lg-3 col-sm-6"
            key={item?.id || i}
            data-aos="fade"
          >
            <Link href={hotelUrl} className="hotelsCard -type-1 hover-inside-slider">
              <div className="hotelsCard__image">
                <div className="cardImage inside-slider">
                  <Slider
                    {...itemSettings}
                    arrows={true}
                    nextArrow={<ArrowSlick type="next" />}
                    prevArrow={<ArrowSlick type="prev" />}
                  >
                    {item?.img && (
                      <div className="cardImage ratio ratio-1:1">
                        <div className="cardImage__content">
                          <Image
                            width={300}
                            height={300}
                            className="rounded-4 col-12 js-lazy"
                            src={item.img || "/img/placeholder.jpg"}
                            alt={item?.title || "hotel image"}
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}
                    {Array.isArray(item?.slideimg) &&
                      item.slideimg.slice(0, 2).map((slide, i) => (
                        <div className="cardImage ratio ratio-1:1" key={i}>
                          <div className="cardImage__content">
                            <Image
                              width={300}
                              height={300}
                              className="rounded-4 col-12 js-lazy"
                              src={slide || "/img/placeholder.jpg"}
                              alt="hotel image"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      ))}
                  </Slider>

                  <div className="cardImage__wishlist">
                    <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                      <i className="icon-heart text-12" />
                    </button>
                  </div>

                  <div className="cardImage__leftBadge">
                    <div
                      className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${getCategoryClass(
                        item?.category
                      )}`}
                    >
                      {item?.category || "No category"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="hotelsCard__content mt-10">
                <h4 className="hotelsCard__title text-dark-1 text-18 lh-16 fw-500">
                  <span>{item?.title || "Untitled Hotel"}</span>
                </h4>
                <p className="text-light-1 lh-14 text-14 mt-5">
                  {item?.location || "Location not available"}
                </p>
                <div className="d-flex items-center mt-20">
                  <div className="flex-center bg-blue-1 rounded-4 size-30 text-12 fw-600 text-white">
                    {item?.ratings || "No rating"}
                  </div>
                  <div className="text-14 text-dark-1 fw-500 ml-10">
                    Exceptional
                  </div>
                  <div className="text-14 text-light-1 ml-10">
                    {item?.numberofreviews || 0} reviews
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </Slider>
  );
};

export default Hotels2;