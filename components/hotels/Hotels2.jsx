'use client';

import Link from "next/link";
import Slider from "react-slick";
import React, { useRef, useEffect, useCallback } from "react";

// Utility function (assuming it's optimized)
const isTextMatched = (text, match) => text && text.toLowerCase() === match.toLowerCase();

const Hotels2 = ({ relatedHotels, itemsToShow = 4 }) => {
  const sliderRef = useRef(null);

  if (!relatedHotels || relatedHotels.length === 0) {
    return <div>No related hotels available.</div>;
  }

  const totalItems = relatedHotels.length;
  // Limiting displayed hotels to a reasonable number to avoid excessive DOM
  const displayedHotels = relatedHotels.slice(0, 12); // Reasonable upper limit
  const effectiveItemsToShow = Math.min(itemsToShow, totalItems);

  // Memoize settings to prevent unnecessary re-renders of Slider
  const settings = React.useMemo(
    () => ({
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
      afterChange: () => updateFocusableElements(),
    }),
    [totalItems, effectiveItemsToShow]
  );

  // Memoize itemSettings for individual hotel sliders
  const itemSettings = React.useMemo(
    () => ({
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }),
    []
  );

  // Memoize ArrowSlick component to prevent re-renders
  const ArrowSlick = React.memo(({ type, onClick }) => {
    const className =
      type === "next"
        ? "slick_arrow-between slick_arrow -next arrow-md flex-center button -blue-1 bg-white shadow-1 size-44 rounded-full sm:d-none js-next"
        : "slick_arrow-between slick_arrow -prev arrow-md flex-center button -blue-1 bg-white shadow-1 size-44 rounded-full sm:d-none js-prev";

    const char =
      type === "next" ? (
        <i className="icon icon-chevron-right text-16" aria-hidden="true"></i>
      ) : (
        <span className="icon icon-chevron-left text-16" aria-hidden="true"></span>
      );

    return (
      <button
        className={className}
        onClick={onClick}
        aria-label={type === "next" ? "Next slide" : "Previous slide"}
        style={{ minWidth: '44px', minHeight: '44px', margin: '0 8px' }}
      >
        {char}
      </button>
    );
  });

  // Optimize the mapping for category colors
  const categoryColorMap = React.useMemo(
    () =>
      new Map([
        ["entire bungalow", "bg-brown-1 text-white"],
        ["house", "bg-red-1 text-white"],
        ["hostel", "bg-dark-1 text-white"],
        ["hotel", "bg-blue-1 text-white"],
        ["villa", "bg-brown-1 text-white"],
        ["guesthouse", "bg-dark-1 text-white"],
        ["lodge", "bg-blue-1 text-white"],
        ["ryokan", "bg-brown-1 text-white"],
        ["homestay", "bg-yellow-1 text-dark-1"],
        ["inn", "bg-yellow-1 text-dark"],
        ["serviced apartment", "bg-dark-3 text-white"],
        ["hotel, inn", "bg-red-1 text-white"],
        ["resort villa", "bg-red-1 text-white"],
        ["motel", "bg-purple-1 text-white"],
        ["holiday park", "bg-brown-1 text-white"],
        ["apartment/flat", "bg-blue-1 text-white"],
        ["apartment", "bg-blue-1 text-white"],
        ["resort", "bg-purple-1 text-white"],
        ["farm stay", "bg-blue-1 text-white"],
        ["riad", "bg-blue-1 text-white"],
        ["motel, hotel", "bg-yellow-2 text-dark"],
        ["minsu", "bg-brown-1 text-white"],
        ["entire house", "bg-dark-3 text-white"],
      ]),
    []
  );

  const renderHotelCard = useCallback(
    (item, i) => {
      const categoryClass = categoryColorMap.get((item?.category || "").toLowerCase()) || "bg-blue-1 text-white";
      const hotelLink = `/${item?.categoryslug || "unknown"}/${item?.countryslug || "unknown"}/${item?.stateslug || "unknown"}/${item?.cityslug || "unknown"}/${item?.hotelslug || "unknown"}`;

      return (
        <div
          className="col-xl-3 col-lg-3 col-sm-6"
          key={item?.id || i}
          data-aos="fade"
        >
          <Link
            href={hotelLink}
            className="hotelsCard -type-1 hover-inside-slider"
            tabIndex={-1}
            data-slide-index={i}
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
                        <img
                          width={300}
                          height={300}
                          className="rounded-4 col-12 js-lazy"
  src={(item.img?.replace('http://', 'https://')) || '/images/placeholder.jpg'}
                          alt={`Hotel image for ${item?.title || "Untitled Hotel"}`}
                          loading={i < effectiveItemsToShow ? "eager" : "lazy"}
                        />
                      </div>
                    </div>
                  )}
                  {Array.isArray(item?.slideimg) &&
                    item?.slideimg.slice(0, 2).map((slide, slideIndex) => (
                      <div className="cardImage ratio ratio-1:1" key={slideIndex}>
                        <div className="cardImage__content">
                          <img
                            width={300}
                            height={300}
                            className="rounded-4 col-12 js-lazy"
                            src={slide || "/images/placeholder.jpg"}
                            alt={`Slide image ${slideIndex + 1} for ${item?.title || "Untitled Hotel"}`}
                            loading="lazy"
                          />
                        </div>
                      </div>
                    ))}
                </Slider>

                <div className="cardImage__leftBadge">
                  <div className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${categoryClass}`}>
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
    },
    [itemSettings, effectiveItemsToShow, categoryColorMap]
  );

  // Function to update focusable elements based on slide visibility
  const updateFocusableElements = useCallback(() => {
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
  }, []);

  // Run on mount and after slide changes
  useEffect(() => {
    updateFocusableElements();
  }, [displayedHotels, updateFocusableElements]);

  return totalItems === 1 ? (
    <div className="row">{renderHotelCard(displayedHotels[0], 0)}</div>
  ) : (
    <Slider {...settings} ref={sliderRef}>
      {displayedHotels.map((item, i) => renderHotelCard(item, i))}
    </Slider>
  );
};

export default React.memo(Hotels2);