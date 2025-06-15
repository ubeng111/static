import Link from "next/link";
import { destinations1 } from "../../data/desinations";

// Perbaikan: Menerima 'locale' sebagai prop
const TopDestinations = ({ locale }) => {
  const currentCountryCode = locale; // Menggunakan 'locale' yang diterima sebagai prop

  return (
    <>
      {destinations1.map((item) => (
        <div
          className={item.colClass || "col-xl-3 col-lg-3 col-md-4 col-sm-6"}
          key={item.id}
          data-aos="fade"
          data-aos-delay={item.delayAnimation || "0"}
        >
          <Link
            href={`/${currentCountryCode}${item.url}`} // Menggunakan currentCountryCode dari prop locale
            className="citiesCard -type-3 d-block h-full rounded-4 "
          >
            <div className="citiesCard__image ratio ratio-1:1">
              <img
                className="col-12 js-lazy"
                src={item.img || "/img/placeholder.jpg"}
                alt={item.city}
              />
            </div>
            <div className="citiesCard__content px-30 py-30">
              <h4 className="text-26 fw-600 text-white text-capitalize">
                {item.city}
              </h4>
              <div className="text-15 text-white">
                {item.properties} properties
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default TopDestinations;