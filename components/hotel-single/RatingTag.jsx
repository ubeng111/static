const RatingTag = ({ hotel }) => {
  return (
    <>
      <div className="px-12 py-10 rounded-4 bg-green-1">
        <div className="row x-gap-12 y-gap-12 items-center">
          <div className="col-auto">
            <h4 className="text-14 lh-15 fw-500">
              This {hotel?.title} is in high demand!
            </h4>
            <div className="text-12 lh-15">
              {hotel?.numberofreviews} travelers have booked.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RatingTag;