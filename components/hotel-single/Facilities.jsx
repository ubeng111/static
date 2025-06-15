import React, { memo } from 'react';

const Facilities = ({ dictionary }) => { // Menerima dictionary
  const facilitiesDict = dictionary?.facilities || {}; // Akses bagian facilities dari dictionary

  const facilitiesContent = [
    {
      id: 1,
      items: [
        {
          id: 1,
          icon: "icon-bathtub ",
          title: facilitiesDict.bathroom || "Bathroom", // Gunakan dictionary
          facilities: [
            facilitiesDict.towels || "Towels", // Gunakan dictionary
            facilitiesDict.bathOrShower || "Bath or shower", // Gunakan dictionary
            facilitiesDict.privateBathroom || "Private bathroom", // Gunakan dictionary
            facilitiesDict.toilet || "Toilet", // Gunakan dictionary
            facilitiesDict.freeToiletries || "Free toiletries", // Gunakan dictionary
            facilitiesDict.hairdryer || "Hairdryer", // Gunakan dictionary
            facilitiesDict.bath || "Bath", // Gunakan dictionary
          ],
        },
        {
          id: 2,
          icon: "icon-bed ",
          title: facilitiesDict.bedroom || "Bedroom", // Gunakan dictionary
          facilities: [
            facilitiesDict.linen || "Linen", // Gunakan dictionary
            facilitiesDict.wardrobeOrCloset || "Wardrobe or closet" // Gunakan dictionary
          ],
        },
        {
          id: 3,
          icon: "icon-bell-ring ",
          title: facilitiesDict.receptionServices || "Reception services", // Gunakan dictionary
          facilities: [
            facilitiesDict.invoiceProvided || "Invoice provided", // Gunakan dictionary
            facilitiesDict.privateCheckInCheckOut || "Private check-in/check-out", // Gunakan dictionary
            facilitiesDict.luggageStorage || "Luggage storage", // Gunakan dictionary
            facilitiesDict.twentyFourHourFrontDesk || "24-hour front desk", // Gunakan dictionary
          ],
        },
      ],
    },
    {
      id: 2,
      items: [
        {
          id: 1,
          icon: "icon-tv",
          title: facilitiesDict.mediaTechnology || "Media & Technology", // Gunakan dictionary
          facilities: [
            facilitiesDict.flatScreenTV || "Flat-screen TV", // Gunakan dictionary
            facilitiesDict.satelliteChannels || "Satellite channels", // Gunakan dictionary
            facilitiesDict.radio || "Radio", // Gunakan dictionary
            facilitiesDict.telephone || "Telephone", // Gunakan dictionary
            facilitiesDict.tv || "TV", // Gunakan dictionary
          ],
        },
        {
          id: 2,
          icon: "icon-juice",
          title: facilitiesDict.foodDrink || "Food & Drink", // Gunakan dictionary
          facilities: [
            facilitiesDict.kidMeals || "Kid meals", // Gunakan dictionary
            facilitiesDict.specialDietMenusOnRequest || "Special diet menus (on request)", // Gunakan dictionary
            facilitiesDict.breakfastInTheRoom || "Breakfast in the room", // Gunakan dictionary
            facilitiesDict.bar || "Bar", // Tambahkan ke en.json jika perlu
            facilitiesDict.restaurant || "Restaurant", // Tambahkan ke en.json jika perlu
            facilitiesDict.teaCoffeeMaker || "Tea/Coffee maker", // Tambahkan ke en.json jika perlu
          ],
        },
        {
          id: 3,
          icon: "icon-washing-machine",
          title: facilitiesDict.cleaningServices || "Cleaning services", // Gunakan dictionary
          facilities: [
            facilitiesDict.dailyHousekeeping || "Daily housekeeping", // Gunakan dictionary
            facilitiesDict.dryCleaning || "Dry cleaning", // Gunakan dictionary
            facilitiesDict.laundry || "Laundry" // Gunakan dictionary
          ],
        },
      ],
    },
    {
      id: 3,
      items: [
        {
          id: 1,
          icon: "icon-shield",
          title: facilitiesDict.safetySecurity || "Safety & security", // Gunakan dictionary
          facilities: [
            facilitiesDict.fireExtinguishers || "Fire extinguishers", // Gunakan dictionary
            facilitiesDict.cctvInCommonAreas || "CCTV in common areas", // Gunakan dictionary
            facilitiesDict.smokeAlarms || "Smoke alarms", // Gunakan dictionary
            facilitiesDict.twentyFourHourSecurity || "24-hour security", // Gunakan dictionary
          ],
        },
      ],
    },
  ];

  return (
    <>
      {facilitiesContent.map((item) => (
        <div className="col-xl-4 col-6" key={item.id}>
          <div className="row y-gap-30">
            {item?.items?.map((facility) => (
              <div className="col-12" key={facility.id}>
                <div>
                  <div className="d-flex items-center text-16 fw-500">
                    <i className={`${facility.icon} text-20 mr-10`} />
                    {facility.title}
                  </div>
                  <ul className="text-14 pt-10">
                    {facility?.facilities?.map((val, i) => (
                      <li className="d-flex items-center" key={i}>
                        <i className="icon-check text-10 mr-20" />
                        {val}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default memo(Facilities);