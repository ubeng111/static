// HotelProperties88.jsx
import Link from "next/link";

// Utility function for category matching (assumed server-compatible)
const isTextMatched = (text, match) => text?.toLowerCase() === match?.toLowerCase();

// Generic slug creation function
const createSlug = (name) => {
  if (!name) return 'unknown';
  return String(name).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

// Menerima hanya hotels
export default function HotelProperties88({ hotels }) { // currentLang dan dictionary dihapus
  if (!hotels || !Array.isArray(hotels) || hotels.length === 0) {
    return <div>No hotels found.</div>; // Teks statis
  }

  const effectiveItemsToShow = 4; 

  return (
    <>
      {hotels.map((item, index) => {
        // Buat slug secara dinamis jika properti slug tidak ada atau undefined
        const hotelCategorySlug = item?.categoryslug || createSlug(item?.category);
        const hotelCountrySlug = item?.countryslug || createSlug(item?.country);
        const hotelStateSlug = item?.stateslug || createSlug(item?.state);
        const hotelCitySlug = item?.cityslug || createSlug(item?.city);
        const hotelSlug = item?.hotelslug || createSlug(item?.title || item?.name); // Gunakan title atau name untuk hotelSlug

        // Hapus `currentLang` dari URL
        const generatedHref = `/${hotelCategorySlug}/${hotelCountrySlug}/${hotelStateSlug}/${hotelCitySlug}/${hotelSlug}`;

        return (
          <div
            className="col-lg-3 col-md-4 col-12 mb-30"
            key={item?.id || index}
          >
            <Link
              href={generatedHref} // Gunakan href yang sudah dibuat
              className="hotelsCard -type-1 hover-inside-slider"
            >
              <div className="hotelsCard__image">
                <div className="cardImage">
                  {item?.img && (
                    <div className="cardImage ratio ratio-1:1">
                      <div className="cardImage__content">
                        <img
                          width={300}
                          height={300}
                          className="rounded-4 col-12 js-lazy"
                          src={(item.img?.replace('http://', 'https://')) || '/images/placeholder.jpg'}
                          alt={`Image of ${item?.title || "Untitled Hotel"} - A ${item?.category || "hotel"} in ${item?.city || "Unknown Location"}`}
                          loading={index < effectiveItemsToShow ? "eager" : "lazy"}
                        />
                      </div>
                    </div>
                  )}
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
                <h2 className="hotelsCard__title text-dark-1 text-18 lh-16 fw-500">
                  <span>{item?.title || "Untitled Hotel"}</span> {/* Teks statis */}
                </h2>
                <p className="text-light-1 lh-14 text-14 mt-5">{item?.location || "Unknown Location"}</p> {/* Teks statis */}
                <div className="d-flex align-items-center mt-20">
                  <div className="flex-center bg-blue-1 rounded-4 size-30 text-12 fw-600 text-white">
                    {item?.ratings || "N/A"}
                  </div>
                  <div className="text-14 text-dark-1 fw-bold ml-10">
                    {item?.numberofreviews || 0} reviews {/* Teks statis */}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
}