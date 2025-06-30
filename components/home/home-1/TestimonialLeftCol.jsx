const TestimonialLeftCol = () => {
  return (
    <>
      <h2 className="text-30">
        What our guests
        <br /> truly love about us
      </h2>
      <p className="mt-20">
        Experience the magic that keeps millions coming back. At Hoteloza, we’re committed to making every stay unforgettable, with comfort, care, and exceptional service.
      </p>
      <div className="row y-gap-30 pt-60 lg:pt-40">
        <div className="col-sm-5 col-6">
          <div className="text-30 lh-15 fw-600">13M+</div>
          <div className="text-light-1 lh-15">Delighted Guests</div>
        </div>
        <div className="col-sm-5 col-6">
          <div className="text-30 lh-15 fw-600">4.88</div>
          <div className="text-light-1 lh-15">Guest Satisfaction Score</div>
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
