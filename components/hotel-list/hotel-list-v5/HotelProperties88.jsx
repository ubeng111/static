import Image from "next/image";
import Link from "next/link";

// Utility function for category matching
const isTextMatched = (text, match) => text?.toLowerCase() === match?.toLowerCase();

export default function HotelProperties88({ hotels }) {
  if (!hotels || !Array.isArray(hotels) || hotels.length === 0) {
    return <div>No hotels found.</div>;
  }

  return (
    <>
      {hotels.map((item, index) => (
        <div
          className="col-lg-3 col-md-4 col-12 mb-30"
          key={item?.id || index}
        >
          <Link
            href={`/${item?.categoryslug || 'unknown'}/${item?.countryslug || 'unknown'}/${item?.stateslug || 'unknown'}/${item?.cityslug || 'unknown'}/${item.hotelslug || 'unknown'}`}
            className="hotelsCard -type-1 hover-inside-slider"
          >
            <div className="hotelsCard__image">
              <div className="cardImage">
                {item?.img && (
                  <div className="cardImage ratio ratio-1:1">
                    <div className="cardImage__content">
                      <Image
                        width={300}
                        height={300}
                        className="rounded-4 col-12"
                        src={item.img}
                        alt={item.title || "Hotel image"}
                        sizes="(max-width: 768px) 100vw, 300px"
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        quality={75} // Kompresi gambar untuk ukuran lebih kecil
                      />
                    </div>
                  </div>
                )}
                <div className="cardImage__leftBadge">
                  {item?.category && (
                    <div
                      className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${
                        isTextMatched(item.category, "Entire bungalow") ? "bg-brown-1 text-white" :
                        // ... (logika category lainnya tetap sama)
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
              <h2 className="hotelsCard__title text-dark-1 text-18 lh-16 fw-500">
                <span>{item?.title || "Untitled Hotel"}</span>
              </h2>
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
}