// components/about/Block1.jsx

// Komponen Block1, menerima dictionary sebagai prop
const Block1 = ({ dictionary }) => {
  // Mengakses bagian 'about' dari dictionary, menyediakan objek kosong sebagai fallback
  // Ini memastikan bahwa jika 'dictionary' atau 'dictionary.about' adalah undefined,
  // aboutDict tidak akan null/undefined dan tidak akan menyebabkan error saat mencoba mengakses propertinya.
  const aboutDict = dictionary?.about || {};

  return (
    <>
      <div className="col-lg-5">
        {/* Menggunakan teks dari dictionary untuk judul. Jika tidak ada, gunakan string default. */}
        <h2 className="text-30 fw-600">{aboutDict.aboutHotelozaTitle || "About Hoteloza"}</h2>
        {/* Menggunakan teks dari dictionary untuk subjudul. Jika tidak ada, gunakan string default. */}
        <p className="mt-5">{aboutDict.aboutHotelozaSubtitle || "Discover a world of comfort and elegance"}</p>
        <p className="text-dark-1 mt-60 lg:mt-40 md:mt-20">
          {/* Menggunakan teks dari dictionary untuk paragraf pertama. Jika tidak ada, gunakan string default. */}
          {aboutDict.aboutHotelozaParagraph1 || "Hoteloza is your sanctuary of luxury, offering unparalleled hospitality in the heart of vibrant destinations. Our hotels blend modern elegance with timeless comfort, ensuring every stay is a memorable experience."}
          <br />
          <br />
          {/* Menggunakan teks dari dictionary untuk paragraf kedua. Jika tidak ada, gunakan string default. */}
          {aboutDict.aboutHotelozaParagraph2 || "Immerse yourself in our world-class amenities, from serene spas to exquisite dining, and explore nearby attractions that make every visit unforgettable. Whether for business or leisure, Hoteloza is your home away from home."}
        </p>
      </div>
      {/* End .col */}

      <div className="col-lg-6">
        {/* Tetap menggunakan tag <img> HTML standar karena Anda telah memutuskan tidak menggunakan Next.js Image component. */}
        <img
          width={400}
          height={400}
          src="/img/app/1.png"
          alt="Hoteloza about page image"
          className="rounded-4 w-100"
        />
      </div>
      {/* End .col */}
    </>
  );
};

export default Block1;