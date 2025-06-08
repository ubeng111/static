import Image from "next/image";

const Block1 = () => {
  return (
    <>
      <div className="col-lg-5">
        <h2 className="text-30 fw-600">About Hoteloza</h2>
        <p className="mt-5">Discover a world of comfort and elegance</p>
        <p className="text-dark-1 mt-60 lg:mt-40 md:mt-20">
          Hoteloza is your sanctuary of luxury, offering unparalleled hospitality
          in the heart of vibrant destinations. Our hotels blend modern elegance
          with timeless comfort, ensuring every stay is a memorable experience.
          <br />
          <br />
          Immerse yourself in our world-class amenities, from serene spas to
          exquisite dining, and explore nearby attractions that make every visit
          unforgettable. Whether for business or leisure, Hoteloza is your home
          away from home.
        </p>
      </div>
      {/* End .col */}

      <div className="col-lg-6">
        <Image
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