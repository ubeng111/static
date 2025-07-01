// Testimonial.jsx
'use client'

// Hapus import Image dari next/image
// import Image from "next/image"; 
// Hapus import Swiper dan Scrollbar
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Scrollbar } from "swiper";
import { testimonial1 } from "../../../data/testimonialData"; // Asumsi data ini ada dan berfungsi

const Testimonial = () => {
  // Ambil testimonial pertama untuk ditampilkan secara statis
  const firstTestimonial = testimonial1[0];

  if (!firstTestimonial) {
    return null; // Atau tampilkan pesan jika tidak ada testimonial
  }

  return (
    <>
      {/* Hapus elemen Swiper */}
      <div>
        <div className="row items-center x-gap-15 y-gap-20">
          <div className="col-auto">
            {/* --- START MODIFIKASI: Ganti <Image> dengan <img> standar --- */}
            <img
              // Pastikan src tetap mengambil dari firstTestimonial.avatar
              src={firstTestimonial.avatar} 
              alt="Testimonial Image" // Ganti alt="image" dengan deskripsi yang lebih spesifik
              // Tetapkan width dan height eksplisit untuk menghindari CLS dan membantu browser
              width={80} 
              height={80} 
              // Gunakan styling langsung atau class CSS untuk roundness dan object-fit
              className="js-lazy rounded-circle" 
              style={{ objectFit: 'cover' }} // Pastikan rasio aspek terjaga
            />
            {/* --- END MODIFIKASI --- */}
          </div>
          <div className="col-auto">
            <h5 className="text-16 fw-500">{firstTestimonial.name}</h5>
            <div className="text-15 text-light-1 lh-15">
              {firstTestimonial.designation}
            </div>
          </div>
        </div>
        <p className="text-18 fw-500 text-dark-1 mt-30 sm:mt-20">
          {firstTestimonial.text}
        </p>
      </div>
      {/* Hapus navigasi slider */}
      {/* <div className="d-flex items-center mt-60 sm:mt-20 js-testimonials-slider-pag">
        <div className="text-dark-1 fw-500 js-current">01</div>
        <div className="slider-scrollbar bg-border ml-20 mr-20 w-max-300 js-scrollbar" />
        <div className="text-dark-1 fw-500 js-all">03</div>
      </div> */}
    </>
  );
};

export default Testimonial;