import React, { memo, useEffect, useState } from "react";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const LandmarkList = ({ latitude, longitude }) => {
  const [landmarks, setLandmarks] = useState([]);

  useEffect(() => {
    if (!latitude || !longitude) {
      console.error("Latitude atau Longitude tidak valid");
      return;
    }

    const fetchLandmarks = async () => {
      try {
        const radius = 10000;
        const response = await fetch(
          `https://overpass.kumi.systems/api/interpreter?data=[out:json];node(around:${radius},${latitude},${longitude})["name"];out;`
        );
        const data = await response.json();

        const landmarksList = data.elements
          .filter((element) => element.tags && element.tags.name)
          .map((element) => ({
            name: element.tags.name,
            distance: calculateDistance(latitude, longitude, element.lat, element.lon),
          }));

        const sortedLandmarks = landmarksList.sort((a, b) => a.distance - b.distance);
        setLandmarks(sortedLandmarks.slice(0, 15));
      } catch (error) {
        console.error("Error fetching landmarks:", error);
      }
    };

    fetchLandmarks();
  }, [latitude, longitude]);

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>
      <div className="row y-gap-10">
        <div className="col-12">
          <h2
            className="text-center fw-bold mb-3 mt-3 text-dark text-md"
            style={{ fontSize: "24px" }}
          >
            🗺️ Nearby Landmarks
          </h2>
        </div>
      </div>
      <div className="row y-gap-10">
        {landmarks.length === 0 ? (
          <div className="col-12">
            <div className="text-14 fw-500">No Nearby Landmarks Found</div>
          </div>
        ) : (
          landmarks.map((landmark, index) => (
            <div key={index} className="col-xl-4 col-md-6 col-sm-12">
              <div
                className="d-flex align-items-center p-2"
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div className="d-flex align-items-center text-14 fw-500 text-dark flex-grow-1">
                  <i className="icon-landmark text-20 me-2" />
                  <span style={{ maxWidth: "200px" }} className="text-truncate">
                    {landmark.name}
                  </span>
                </div>
                <span
                  className="badge bg-primary rounded-pill ms-1"
                  style={{ fontSize: "10px", padding: "4px 8px" }}
                >
                  {landmark.distance.toFixed(2)} km
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default memo(LandmarkList);