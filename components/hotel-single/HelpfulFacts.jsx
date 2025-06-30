import React, { memo } from 'react';

const HelpfulFacts = ({ hotel }) => {
  const checkInTime = hotel?.checkin ?? "14:00";
  const checkOutTime = hotel?.checkout ?? "12:00";

  return (
    <div className="d-flex flex-wrap px-2">
      <div className="col-6 col-lg-4 px-2 flex-grow-1">
        <div>
          <div className="d-flex items-center">
            <i className="icon-plans text-20 mr-10"></i>
            <div className="text-16 fw-500">The property</div>
          </div>
          <div className="row x-gap-20 y-gap-10 pt-10">
            <div className="col-12">
              <div className="text-15">Non-smoking rooms/floors: Yes</div>
            </div>
            <div className="col-12">
              <div className="text-15">Number of bars/lounges: 1</div>
            </div>
            <div className="col-12">
              <div className="text-15">Number of floors: {hotel?.numberfloors}</div>
            </div>
            <div className="col-12">
              <div className="text-15">Number of restaurants: 1</div>
            </div>
            <div className="col-12">
              <div className="text-15">Number of rooms: {hotel?.numberrooms}</div>
            </div>
          </div>
        </div>
        <div className="mt-20">
          <div className="d-flex items-center">
            <i className="icon-parking text-20 mr-10"></i>
            <div className="text-16 fw-500">Parking</div>
          </div>
          <div className="row x-gap-20 y-gap-10 pt-10">
            <div className="col-12">
              <div className="text-15">Daily parking fee: free</div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-6 col-lg-8 px-2 flex-grow-1">
        <div className="d-flex flex-wrap">
          <div className="col-12 col-lg-6 flex-grow-1">
            <div>
              <div className="d-flex items-center">
                <i className="icon-ticket text-20 mr-10"></i>
                <div className="text-16 fw-500">Extras</div>
              </div>
              <div className="row x-gap-20 y-gap-15 pt-10">
                <div className="col-12">
                  <div className="text-15">Breakfast charge (unless included in room price)</div>
                </div>
                <div className="col-12">
                  <div className="text-15">Daily Internet/Wi-Fi fee: free</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6 flex-grow-1 mt-6" style={{ marginTop: "1cm" }}>
            <div>
              <div className="d-flex items-center">
                <i className="icon-calendar text-20 mr-10"></i>
                <div className="text-16 fw-500">Check-in/Check-out</div>
              </div>
              <div className="row x-gap-20 y-gap-10 pt-10">
                <div className="col-12">
                  <div className="text-15">Check-in from: {checkInTime}</div>
                </div>
                <div className="col-12">
                  <div className="text-15">Check-out until: {checkOutTime}</div>
                </div>
                <div className="col-12">
                  <div className="text-15">Reception open until: 00:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(HelpfulFacts);