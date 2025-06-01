import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import isTextMatched from "../../utils/isTextMatched";
import React, { useRef, useEffect } from "react"; // Added useRef, useEffect

const Hotels2 = ({ relatedHotels, itemsToShow = 4 }) => {
  const sliderRef = useRef(null); // Ref to access the slider

  if (!relatedHotels || relatedHotels.length === 0) {
    return <div>No related hotels available.</div>;
  }

  const totalItems = relatedHotels.length;
  const displayedHotels = relatedHotels.slice(0, 8);
  const effectiveItemsToShow = Math.min(itemsToShow, totalItems);

  const settings = {
    dots: true,
    infinite: totalItems > effectiveItemsToShow,
    speed: 500,
    slidesToShow: totalItems > 1 ? effectiveItemsToShow : 1,
    slidesToScroll: 1,
    centerMode: totalItems === 1,
    centerPadding: totalItems === 1 ? "30%" : "0px",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(4, totalItems),
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: Math.min(3, totalItems),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, totalItems),
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    accessibility: true,
    dotsClass: "slick-dots slick-thumb",
    customPaging: function (i) {
      return (
        <button
          aria-label={`Go to slide ${i + 1}`}
          className="slick-dot-button"
          style={{
            width: '24px',
            height: '24px',
            padding: 0,
            border: '1px solid #ccc',
            borderRadius: '50%',
            position: 'relative',
            margin: '0 4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '48px',
              minHeight: '48px',
              content: '""',
              display: 'block',
            }}
          ></span>
        </button>
      );
    },
    afterChange: () => updateFocusableElements(), // Call to update focus after slide change
  };

  const itemSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  function ArrowSlick(props) {
    const className =
      props.type === "next"
        ? "slick_arrow-between slick_arrow -next arrow-md flex-center button -blue-1 bg-white shadow-1 size-44 rounded-full sm:d-none js-next"
        : "slick_arrow-between slick_arrow -prev arrow-md flex-center button -blue-1 bg-white shadow-1 size-44 rounded-full sm:d-none js-prev";

    const char =
      props.type === "next" ? (
        <i className="icon icon-chevron-right text-16" aria-hidden="true"></i>
      ) : (
        <span className="icon icon-chevron-left text-16" aria-hidden="true"></span>
      );

    return (
      <button
        className={className}
        onClick={props.onClick}
        aria-label={props.type === "next" ? "Next slide" : "Previous slide"}
        style={{ minWidth: '44px', minHeight: '44px', margin: '0 8px' }}
      >
        {char}
      </button>
    );
  }

  const renderHotelCard = (item, i) => (
    <div
      className="col-xl-3 col-lg-3 col-sm-6"
      key={item?.id || i}
      data-aos="fade"
    >
      <Link
        href={`/${item?.categoryslug || "unknown"}/${item?.countryslug || "unknown"}/${item?.stateslug || "unknown"}/${item?.cityslug || "unknown"}/${item?.hotelslug || "unknown"}`}
        className="hotelsCard -type-1 hover-inside-slider"
        tabIndex={-1} // Initially not focusable, updated by useEffect
        data-slide-index={i} // Add index for identification
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
                      className="rounded-4 col-12 js-lazy"
                      src={item?.img || "/path/to/default-image.jpg"}
                      alt={`Hotel image for ${item?.title || "Untitled Hotel"}`}
                    />
                  </div>
                </div>
              )}
              {Array.isArray(item?.slideimg) &&
                item?.slideimg.slice(0, 2).map((slide, i) => (
                  <div className="cardImage ratio ratio-1:1" key={i}>
                    <div className="cardImage__content">
                      <Image
                        width={300}
                        height={300}
                        className="rounded-4 col-12 js-lazy"
                        src={slide || "/path/to/default-image.jpg"}
                        alt={`Slide image ${i + 1} for ${item?.title || "Untitled Hotel"}`}
                      />
                    </div>
                  </div>
                ))}
            </Slider>

            <div className="cardImage__leftBadge">
              <div
                className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase 
                  ${isTextMatched(item?.category || "", "Entire bungalow") ? "bg-brown-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "House") ? "bg-red-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Hostel") ? "bg-dark-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Hotel") ? "bg-blue-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Villa") ? "bg-brown-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Guesthouse") ? "bg-dark-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Lodge") ? "bg-blue-1 text-white" : "Serviced Apartment"} 
                  ${isTextMatched(item?.category || "", "Ryokan") ? "bg-brown-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Homestay") ? "bg-yellow-1 text-dark-1" : ""} 
                  ${isTextMatched(item?.category || "", "Inn") ? "bg-yellow-1 text-dark" : ""} 
                  ${isTextMatched(item?.category || "", "Serviced apartment") ? "bg-dark-3 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Hotel, Inn") ? "bg-red-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Resort villa") ? "bg-red-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Motel") ? "bg-purple-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Holiday park") ? "bg-brown-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Apartment/Flat") ? "bg-blue-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Apartment") ? "bg-blue-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "resort") ? "bg-purple-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Farm stay") ? "bg-blue-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Riad") ? "bg-blue-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Motel, Hotel") ? "bg-yellow-2 text-dark" : ""} 
                  ${isTextMatched(item?.category || "", "Minsu") ? "bg-brown-1 text-white" : ""} 
                  ${isTextMatched(item?.category || "", "Entire House") ? "bg-dark-3 text-white" : ""}`}
              >
                {item?.category || "No category"}
              </div>
            </div>
          </div>
        </div>
        <div className="hotelsCard__content mt-10">
          <h3 className="hotelsCard__title text-dark-1 text-18 lh-16 fw-500">
            <span>{item?.title || "Untitled Hotel"}</span>
          </h3>
          <p className="text-light-1 lh-14 text-14 mt-5">
            {item?.location || "Location not available"}
          </p>
          <div className="d-flex items-center mt-20">
            <div className="flex-center bg-blue-1 rounded-4 size-30 text-12 fw-600 text-white">
              {item?.ratings || "No rating"}
            </div>
            <div className="text-14 text-dark-1 fw-500 ml-10">Exceptional</div>
            <div className="text-14 text-light-1 ml-10">
              {item?.numberofreviews} reviews
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  // Function to update focusable elements based on slide visibility
  const updateFocusableElements = () => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const slides = slider.innerSlider?.list?.querySelectorAll('.slick-slide');
    if (!slides) return;

    slides.forEach((slide) => {
      const isHidden = slide.getAttribute('aria-hidden') === 'true';
      const link = slide.querySelector('a.hotelsCard');
      if (link) {
        link.setAttribute('tabIndex', isHidden ? '-1' : '0');
      }
    });
  };

  // Run on mount and after slide changes
  useEffect(() => {
    updateFocusableElements();
  }, [displayedHotels]);

  return totalItems === 1 ? (
    <div className="row">{renderHotelCard(displayedHotels[0], 0)}</div>
  ) : (
    <Slider {...settings} ref={sliderRef}>
      {displayedHotels.map((item, i) => renderHotelCard(item, i))}
    </Slider>
  );
};

export default React.memo(Hotels2);