// components/Testimonial.jsx
'use client'

import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import React from 'react';

const Testimonial = ({ dictionary }) => {
  if (!dictionary) {
    return <div>Loading testimonials...</div>;
  }

  const allTestimonials = [];

  // Add testimonials from 'data'
  (dictionary.testimonials.data || []).forEach((item, index) => {
    allTestimonials.push({ ...item, uniqueKey: `data-${item.id || index}` });
  });

  // Add testimonials from 'data2'
  (dictionary.testimonials.data2 || []).forEach((item, index) => {
    allTestimonials.push({ ...item, uniqueKey: `data2-${item.meta}-${item.id || index}` });
  });

  // Add testimonials from 'data3'
  (dictionary.testimonials.data3 || []).forEach((item, index) => {
    allTestimonials.push({ ...item, uniqueKey: `data3-${item.meta}-${item.id || index}` });
  });

  const currentLocale = dictionary.locale || 'us';

  const validTestimonials = allTestimonials.filter(item => item.text && item.name);


  return (
    <>
      {validTestimonials.length > 0 ? (
        <Swiper
          scrollbar={{
            el: ".js-scrollbar",
            draggable: true,
          }}
          modules={[Scrollbar]}
        >
          {validTestimonials.map((item) => (
            <SwiperSlide key={item.uniqueKey}>
              <div className="row items-center x-gap-15 y-gap-20">
                <div className="col-auto">
                  <img
                    width={80}
                    height={80}
                    src={item.avatar}
                    alt={item.name}
                    className="js-lazy rounded-circle"
                  />
                </div>
                <div className="col-auto">
                  <h2 className="text-16 fw-500">{item.name}</h2>
                  <div className="text-15 text-light-1 lh-15">
                    {item.designation}
                  </div>
                </div>
              </div>
              <p className="text-18 fw-500 text-dark-1 mt-30 sm:mt-20">
                {item.text}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div>{currentLocale === 'id' ? 'Tidak ada testimonial untuk ditampilkan.' : 'No testimonials to display.'}</div>
      )}

      {validTestimonials.length > 0 && (
        <div className="d-flex items-center mt-60 sm:mt-20 js-testimonials-slider-pag">
          <div className="text-dark-1 fw-500 js-current">01</div>
          <div className="slider-scrollbar bg-border ml-20 mr-20 w-max-300 js-scrollbar" />
          <div className="text-dark-1 fw-500 js-all">{validTestimonials.length.toString().padStart(2, '0')}</div>
        </div>
      )}
      {/* Removed lines: */}
      {/* <p>Rating: {dictionary.hotelSinglePage.exceptionalReviewText}</p> */}
      {/* <p>Price per {dictionary.common.night}</p> */}
    </>
  );
};

export default Testimonial;