import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import isTextMatched from "../../../utils/isTextMatched";
import React from "react"; // Import React

const HotelProperties88 = ({ hotels }) => {
  const itemSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  function ArrowSlick(props) {
    let className =
      props.type === "next"
        ? "slick_arrow-between slick_arrow -next arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-next"
        : "slick_arrow-between slick_arrow -prev arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-prev";
    className += " arrow";
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

  if (!hotels || !Array.isArray(hotels) || hotels.length === 0) {
    return <div>No hotels found.</div>;
  }

  return (
    <>
      {hotels.map((item, index) => (
        <div
          className="col-lg-3 col-md-4 col-6 mb-30"
          key={item?.id || index}
          data-aos="fade"
          data-aos-delay={index * 100}
        >
          <Link
            href={`/${item?.categoryslug || 'unknown'}/${item?.countryslug || 'unknown'}/${item?.stateslug || 'unknown'}/${item?.cityslug || 'unknown'}/${item.hotelslug || 'unknown'}`}
            className="hotelsCard -type-1 hover-inside-slider"
          >
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
                          className="rounded-4 col-12"
                          src={item.img}
                          alt={item.title || "Hotel image"}
                          loading="eager"
                          fetchPriority="high"
                        />
                      </div>
                    </div>
                  )}
                  {item?.slideimg?.slice(0, 2).map((slide, i) => (
                    <div className="cardImage ratio ratio-1:1" key={i}>
                      <div className="cardImage__content">
                        <Image
                          width={300}
                          height={300}
                          className="rounded-4 col-12"
                          src={slide}
                          alt={`Slide ${i + 1}`}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </Slider>

                

                <div className="cardImage__leftBadge">
                  {item?.category && (
                    <div
                      className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${
                        isTextMatched(item.category, "Entire bungalow") ? "bg-brown-1 text-white" :
                        isTextMatched(item.category, "House") ? "bg-red-1 text-white" :
                        isTextMatched(item.category, "Hostel") ? "bg-dark-1 text-white" :
                        isTextMatched(item.category, "Hotel") ? "bg-blue-1 text-white" :
                        isTextMatched(item.category, "Villa") ? "bg-brown-1 text-white" :
                        isTextMatched(item.category, "Guesthouse") ? "bg-dark-1 text-white" :
                        isTextMatched(item.category, "Lodge") ? "bg-blue-1 text-white" :
                        isTextMatched(item.category, "Serviced apartment") ? "bg-dark-3 text-white" :
                        isTextMatched(item.category, "Ryokan") ? "bg-brown-1 text-white" :
                        isTextMatched(item.category, "Homestay") ? "bg-yellow-1 text-dark-1" :
                        isTextMatched(item.category, "Inn") ? "bg-yellow-1 text-dark" :
                        isTextMatched(item.category, "Hotel, Inn") ? "bg-red-1 text-white" :
                        isTextMatched(item.category, "Resort villa") ? "bg-red-1 text-white" :
                        isTextMatched(item.category, "Motel") ? "bg-purple-1 text-white" :
                        isTextMatched(item.category, "Holiday park") ? "bg-brown-1 text-white" :
                        isTextMatched(item.category, "Apartment/Flat") ? "bg-blue-1 text-white" :
                        isTextMatched(item.category, "resort") ? "bg-purple-1 text-white" :
                        isTextMatched(item.category, "Farm stay") ? "bg-blue-1 text-white" :
                        isTextMatched(item.category, "Riad") ? "bg-blue-1 text-white" :
                        isTextMatched(item.category, "Motel, Hotel") ? "bg-yellow-2 text-dark" :
                        isTextMatched(item.category, "Minsu") ? "bg-brown-1 text-white" :
                        isTextMatched(item.category, "Entire House") ? "bg-dark-3 text-white" :
                        "bg-blue-1 text-white"
                      }`}
                    >
                      {item.category}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="hotelsCard__content mt-10">
              <h4 className="hotelsCard__title text-dark-1 text-18 lh-16 fw-500">
                <span>{item?.title || "Untitled Hotel"}</span>
              </h4>
              <p className="text-light-1 lh-14 text-14 mt-5">{item?.location || "Unknown Location"}</p>
              <div className="d-flex align-items-center mt-20">
                <div className="flex-center bg-blue-1 rounded-4 size-30 text-12 fw-600 text-white">
                  {item?.ratings || "N/A"}
                </div>
                <div className="text-14 text-dark-1 fw-bold ml-10">
                  {item?.numberofreviews || 0} reviews
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default React.memo(HotelProperties88);