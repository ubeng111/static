// components/hotel-single/LandmarkList.jsx
'use client';

import React, { memo } from "react";
import Link from "next/link";

const LandmarkList = ({ landmarks = [] }) => {
  const landmarksToDisplay = Array.isArray(landmarks) ? landmarks : [];
  
  const nearbySpotsText = "🗺️ Nearby Essential & Tourist Spots";
  const noPlacesFoundText = `No nearby places of interest were found.`; 

  console.log("CLIENT DEBUG [LandmarkList.jsx]: Component rendering. Landmarks received as prop:", landmarks);
  console.log("CLIENT DEBUG [LandmarkList.jsx]: All landmarks to display (no internal truncation):", landmarksToDisplay.length);


  return (
    <div className="container" style={{ maxWidth: "1200px", padding: '0' }}> 
      <div className="row y-gap-10">
        <div className="col-12">
          <h2
            className="text-center fw-bold mb-3 mt-3 text-dark text-md"
            style={{ fontSize: "24px" }}
          >
            {nearbySpotsText}
          </h2>
        </div>
      </div>

      <div className="row y-gap-10">
        {landmarksToDisplay.length === 0 ? (
          <div className="col-12 text-center">
            <div className="text-14 fw-500">
              {noPlacesFoundText}
            </div>
          </div>
        ) : (
          landmarksToDisplay.map((landmark, index) => (
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
                {/* *** PERBAIKAN: Tambahkan parseFloat lagi di sini sebagai lapisan pengaman *** */}
                {/* Menampilkan jarak (km) menggunakan nilai landmark.distance */}
                {landmark.distance !== null && typeof landmark.distance !== 'undefined' ? (
                  // Coba konversi ke float di sisi klien juga
                  (() => {
                    const parsedDistance = parseFloat(landmark.distance);
                    return !isNaN(parsedDistance) ? (
                      <span
                        className="badge bg-primary rounded-pill ms-1"
                        style={{ fontSize: "10px", padding: "4px 8px" }}
                      >
                        {parsedDistance.toFixed(2)} km
                      </span>
                    ) : (
                      // Fallback jika parsedDistance adalah NaN
                      landmark.category && (
                        <span
                          className="badge bg-secondary rounded-pill ms-1"
                          style={{ fontSize: "10px", padding: "4px 8px" }}
                        >
                          {landmark.category}
                        </span>
                      )
                    );
                  })()
                ) : (
                  // Fallback jika distance null/undefined dari server
                  landmark.category && (
                    <span
                      className="badge bg-secondary rounded-pill ms-1"
                      style={{ fontSize: "10px", padding: "4px 8px" }}
                    >
                      {landmark.category}
                    </span>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default memo(LandmarkList);