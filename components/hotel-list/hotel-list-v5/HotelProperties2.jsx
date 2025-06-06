'use client';

import Slider from "react-slick";
import { useCurrency } from '@/components/CurrencyContext';

const HotelProperties2 = ({ hotels, cityName = "Lokasi Tidak Diketahui" }) => {
  const { currency } = useCurrency();

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

  if (!hotels || hotels.length === 0) {
    return <div>Tidak ada hotel ditemukan untuk kota ini.</div>;
  }

  return (
    <>
      {hotels.map((item, index) => {
        const hotel = {
          id: item.hotelId,
          title: item.hotelName || "Nama Hotel Tidak Tersedia",
          img: item.imageURL || "/images/placeholder.jpg",
          slideimg: item.slideImages || [],
          location: cityName,
          ratings: item.reviewScore || 0,
          numberofreviews: item.reviewCount || 0,
          dailyRate: item.dailyRate || 0,
          discountPercentage: item.discountPercentage || 0,
          freeWifi: item.freeWifi || false,
          delayAnimation: (index % 4) * 100,
          landingURL: item.landingURL || "#",
        };

        return (
          <div
            className="col-lg-3 col-md-6 col-12 mb-30"
            key={hotel.id || index}
            data-aos="fade"
            data-aos-delay={hotel.delayAnimation}
          >
            <a
              href={hotel.landingURL}
              className="hotelsCard -type-1 hover-inside-slider"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="hotelsCard__image">
                <div className="cardImage inside-slider">
                  <Slider
                    {...itemSettings}
                    arrows={true}
                    nextArrow={<ArrowSlick type="next" />}
                    prevArrow={<ArrowSlick type="prev" />}
                  >
                    {hotel.img && (
                      <div className="cardImage ratio ratio-1:1">
                        <div className="cardImage__content">
                          <img
                            width={300}
                            height={300}
                            className="rounded-4 col-12"
  src={(hotel.img?.replace('http://', 'https://')) || '/images/placeholder.jpg'}
                            alt={`Gambar dari hotel ${hotel.title}`}
                            loading="eager"
                          />
                        </div>
                      </div>
                    )}
                    {hotel.slideimg && hotel.slideimg.length > 0 &&
                      hotel.slideimg.slice(0, 2).map((slide, i) => (
                        <div className="cardImage ratio ratio-1:1" key={i}>
                          <div className="cardImage__content">
                            <img
                              width={300}
                              height={300}
                              className="rounded-4 col-12"
                              src={slide}
                              alt={`Gambar slider ${i + 1} dari hotel ${hotel.title}`}
                              loading="lazy"
                            />
                          </div>
                        </div>
                      ))}
                  </Slider>

                  <div className="cardImage__leftBadge">
                    {hotel.discountPercentage > 0 && (
                      <div className="py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase bg-red-1 text-white">
                        {hotel.discountPercentage}% OFF
                      </div>
                    )}
                    {hotel.freeWifi && (
                      <div
                        className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase bg-purple-1 text-white ${
                          hotel.discountPercentage > 0 ? 'mt-10' : ''
                        }`}
                      >
                        Free WiFi
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="hotelsCard__content mt-10">
                <h4 className="hotelsCard__title text-dark-1 text-18 lh-16 fw-500">
                  <span>{hotel.title}</span>
                </h4>
                <p className="text-light-1 lh-14 text-14 mt-5">{hotel.location}</p>
                <div className="d-flex align-items-center mt-20">
                  <div className="flex-center bg-blue-1 rounded-4 size-30 text-12 fw-600 text-white">
                    {hotel.ratings}
                  </div>
                  <div className="text-14 text-dark-1 fw-bold ml-10">
                    {hotel.numberofreviews} reviews
                  </div>
                </div>
                <div className="mt-10">
                  <span className="text-16 fw-600 text-blue-1">
                    {currency.symbol} {hotel.dailyRate.toFixed(0)} / Night
                  </span>
                </div>
              </div>
            </a>
          </div>
        );
      })}
    </>
  );
};

export default HotelProperties2;