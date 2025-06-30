// components/hotel-single/LandmarkList.jsx
import React, { memo } from "react"; // Hapus useEffect, useState, useCallback
import Link from "next/link";

// Fungsi calculateDistance tidak lagi dibutuhkan di sini karena sudah dipindahkan ke page.jsx (server)

const LandmarkList = ({ landmarks, dictionary, currentLang }) => { // Terima 'landmarks' sebagai prop
  // Tidak perlu lagi fetchLandmarks, useEffect, useState
  const OVERPASS_RADIUS_KM = 5; // Tetap didefinisikan untuk pesan atau logika filter di sisi klien jika ada
  const landmarkListDict = dictionary?.landmarkList || {};

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>
      <div className="row y-gap-10">
        <div className="col-12">
          <h2
            className="text-center fw-bold mb-3 mt-3 text-dark text-md"
            style={{ fontSize: "24px" }}
          >
            {landmarkListDict.nearbyEssentialAndTouristSpots || "🗺️ Nearby Essential & Tourist Spots"}
          </h2>
        </div>
      </div>

      <div className="row y-gap-10">
        {landmarks.length === 0 ? (
          <div className="col-12 text-center">
            <div className="text-14 fw-500">
              {landmarkListDict.noNearbyPlacesFound?.replace('{radius}', OVERPASS_RADIUS_KM) || `No nearby places of interest were found within radius ${OVERPASS_RADIUS_KM} km.`}
            </div>
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
                  <Link
                    href={`/landmark/${landmark.slug}`}
                    style={{ maxWidth: "200px" }}
                    className="text-truncate text-dark"
                  >
                    {landmark.name}
                  </Link>
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