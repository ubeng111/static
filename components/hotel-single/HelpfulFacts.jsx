import React, { memo } from 'react';

const HelpfulFacts = ({ hotel, dictionary }) => { // Menerima dictionary
  const helpfulFactsDict = dictionary?.helpfulFacts || {}; // Asumsi ada bagian helpfulFacts di dictionary
  const commonDict = dictionary?.common || {}; // Untuk unknown values

  const checkInTime = hotel?.checkin ?? "14:00";
  const checkOutTime = hotel?.checkout ?? "12:00";

  return (
    <div className="d-flex flex-wrap px-2">
      <div className="col-6 col-lg-4 px-2 flex-grow-1">
        <div>
          <div className="d-flex items-center">
            <i className="icon-plans text-20 mr-10"></i>
            {/* Teks dari dictionary atau fallback */}
            <div className="text-16 fw-500">{helpfulFactsDict.thePropertyTitle || "The property"}</div>
          </div>
          <div className="row x-gap-20 y-gap-10 pt-10">
            <div className="col-12">
              <div className="text-15">{helpfulFactsDict.nonSmokingRooms || "Non-smoking rooms/floors: Yes"}</div>
            </div>
            <div className="col-12">
              <div className="text-15">
                {helpfulFactsDict.numberOfBars || "Number of bars/lounges:"} {hotel?.numberofbars || 1}
              </div>
            </div>
            <div className="col-12">
              <div className="text-15">
                {helpfulFactsDict.numberOfFloors || "Number of floors:"} {hotel?.numberfloors || 0}
              </div>
            </div>
            <div className="col-12">
              <div className="text-15">
                {helpfulFactsDict.numberOfRestaurants || "Number of restaurants:"} {hotel?.numberofrestaurants || 1}
              </div>
            </div>
            <div className="col-12">
              <div className="text-15">
                {helpfulFactsDict.numberOfRooms || "Number of rooms:"} {hotel?.numberrooms || 0}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20">
          <div className="d-flex items-center">
            <i className="icon-parking text-20 mr-10"></i>
            {/* Teks dari dictionary atau fallback */}
            <div className="text-16 fw-500">{helpfulFactsDict.parkingTitle || "Parking"}</div>
          </div>
          <div className="row x-gap-20 y-gap-10 pt-10">
            <div className="col-12">
              <div className="text-15">{helpfulFactsDict.dailyParkingFee || "Daily parking fee: free"}</div>
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
                {/* Teks dari dictionary atau fallback */}
                <div className="text-16 fw-500">{helpfulFactsDict.extrasTitle || "Extras"}</div>
              </div>
              <div className="row x-gap-20 y-gap-15 pt-10">
                <div className="col-12">
                  <div className="text-15">{helpfulFactsDict.breakfastCharge || "Breakfast charge (unless included in room price)"}</div>
                </div>
                <div className="col-12">
                  <div className="text-15">{helpfulFactsDict.dailyInternetFee || "Daily Internet/Wi-Fi fee: free"}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6 flex-grow-1 mt-6" style={{ marginTop: "1cm" }}>
            <div>
              <div className="d-flex items-center">
                <i className="icon-calendar text-20 mr-10"></i>
                {/* Teks dari dictionary atau fallback */}
                <div className="text-16 fw-500">{helpfulFactsDict.checkInOutTitle || "Check-in/Check-out"}</div>
              </div>
              <div className="row x-gap-20 y-gap-10 pt-10">
                <div className="col-12">
                  <div className="text-15">{helpfulFactsDict.checkInFrom || "Check-in from:"} {checkInTime}</div>
                </div>
                <div className="col-12">
                  <div className="text-15">{helpfulFactsDict.checkOutUntil || "Check-out until:"} {checkOutTime}</div>
                </div>
                <div className="col-12">
                  <div className="text-15">{helpfulFactsDict.receptionOpenUntil || "Reception open until: 00:00"}</div>
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