// SearchResultContent.jsx
import HotelProperties2 from "@/components/hotel-list/hotel-list-v5/HotelProperties2";

export default function SearchResultContent({ hotels, cityName, error }) {
  return (
    <>
      <section className="section-bg pt-40 pb-40 relative z-5">
        <div className="section-bg__item col-12">
          <img
            src="/img/misc/bg-1.webp"
            srcSet="/img/misc/bg-1.webp 480w, /img/misc/bg-1.webp 768w, /img/misc/bg-1.webp 1200w"
            alt="Luxury background image"
            loading="lazy"
            className="w-full h-full object-cover"
            width="1200"
            height="800"
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h1 className="text-30 fw-600 text-white">Search Result Accomodation In {cityName}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            {error && <div>Error: {error}</div>}
            {!error && hotels.length === 0 && <div>Hotel tidak ditemukan.</div>}
            {!error && hotels.length > 0 && (
              <HotelProperties2 hotels={hotels} cityName={cityName} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}