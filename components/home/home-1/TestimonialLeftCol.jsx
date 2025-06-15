// TestimonialLeftCol.jsx
// Komponen TestimonialLeftCol, menerima dictionary sebagai prop
const TestimonialLeftCol = ({ dictionary }) => {
  // Mengakses bagian homepage dari dictionary, menyediakan objek kosong sebagai fallback
  const homepageDict = dictionary?.homepage || {};

  return (
    <>
      <h2 className="text-30">
        {/* Menggunakan teks dari dictionary untuk judul */}
        {homepageDict.whatOurGuestsTrulyLoveAboutUs || "What our guests<br /> truly love about us"}
      </h2>
      <p className="mt-20">
        {/* Menggunakan teks dari dictionary untuk paragraf deskripsi */}
        {homepageDict.experienceTheMagic || "Experience the magic that keeps millions coming back. At Hoteloza, we’re committed to making every stay unforgettable, with comfort, care, and exceptional service."}
      </p>
      <div className="row y-gap-30 pt-60 lg:pt-40">
        <div className="col-sm-5 col-6">
          <div className="text-30 lh-15 fw-600">13M+</div> {/* Angka statis */}
          <div className="text-light-1 lh-15">{homepageDict.delightedGuests || "Delighted Guests"}</div> {/* Menggunakan teks dari dictionary */}
        </div>
        <div className="col-sm-5 col-6">
          <div className="text-30 lh-15 fw-600">4.88</div> {/* Angka statis */}
          <div className="text-light-1 lh-15">{homepageDict.guestSatisfactionScore || "Guest Satisfaction Score"}</div> {/* Menggunakan teks dari dictionary */}
          <div className="d-flex x-gap-5 items-center pt-10">
            <div className="icon-star text-blue-1 text-10" />
            <div className="icon-star text-blue-1 text-10" />
            <div className="icon-star text-blue-1 text-10" />
            <div className="icon-star text-blue-1 text-10" />
            <div className="icon-star text-blue-1 text-10" />
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialLeftCol;
