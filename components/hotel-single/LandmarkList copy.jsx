// components/hotel-single/LandmarkList.jsx
import React, { memo, useEffect, useState, useCallback } from "react";
import Link from "next/link";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const LandmarkList = ({ latitude, longitude, dictionary, currentLang }) => {
  const [landmarks, setLandmarks] = useState([]);
  const OVERPASS_RADIUS_KM = 5;
  const RESULTS_LIMIT = 15;

  const landmarkListDict = dictionary?.landmarkList || {};
  const commonDict = dictionary?.common || {};

  const fetchLandmarks = useCallback(async () => {
    if (!latitude || !longitude) {
      return;
    }

    try {
      const proxyUrl = "/api/overpass"; // URL ke API Route proxy Anda
      const radiusInMeters = OVERPASS_RADIUS_KM * 1000;

      // --- KODE PERBAIKAN PENTING DI SINI ---
      // Query Overpass yang DIBERSIHKAN dari double backslash yang salah.
      // Template literal ini akan menghasilkan string yang benar.
      const overpassQuery = `
        [out:json];
        (
          node(around:${radiusInMeters},${latitude},${longitude})[amenity=hospital][!"place"];
          way(around:${radiusInMeters},${latitude},${longitude})[amenity=hospital][!"place"];
          node(around:${radiusInMeters},${latitude},${longitude})[aeroway=aerodrome][!"place"];
          way(around:${radiusInMeters},${latitude},${longitude})[aeroway=aerodrome][!"place"];
          node(around:${radiusInMeters},${latitude},${longitude})[railway=station][!"place"];
          way(around:${radiusInMeters},${latitude},${longitude})[railway=station][!"place"];
          node(around:${radiusInMeters},${latitude},${longitude})[tourism~"^(attraction|museum|theme_park|zoo|monument|artwork|memorial|viewpoint|castle|ruins)$"][!"place"];
          way(around:${radiusInMeters},${latitude},${longitude})[tourism~"^(attraction|museum|theme_park|zoo|monument|artwork|memorial|viewpoint|castle|ruins)$"][!"place"];
          rel(around:${radiusInMeters},${latitude},${longitude})[tourism~"^(attraction|museum|theme_park|zoo|monument|artwork|memorial|viewpoint|castle|ruins)$"][!"place"];
          node(around:${radiusInMeters},${latitude},${longitude})[amenity=university][!"place"];
          way(around:${radiusInMeters},${latitude},${longitude})[amenity=university][!"place"];
          node(around:${radiusInMeters},${latitude},${longitude})[amenity=bus_station][!"place"];
          way(around:${radiusInMeters},${latitude},${longitude})[amenity=bus_station][!"place"];
          node(around:${radiusInMeters},${latitude},${longitude})[shop=mall][!"place"];
          way(around:${radiusInMeters},${latitude},${longitude})[shop=mall][!"place"];
        );
        out center;
      `;
      // --- AKHIR KODE PERBAIKAN ---

      // Kirim POST request ke proxy Anda dengan query di body
      const response = await fetch(proxyUrl, {
        method: 'POST', // Ganti menjadi POST
        headers: {
          'Content-Type': 'application/json', // Kirim sebagai JSON
        },
        body: JSON.stringify({ overpassQuery }), // Kirim query dalam objek JSON
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.details || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.elements) {
        const relevantLandmarks = data.elements
          .filter(el => el.tags && el.tags.name)
          .filter(el => !el.tags.place)
          .filter(el => {
            const name = el.tags.name.trim();
            return name.includes(' ') && name.split(' ').length > 1;
          })
          .filter(el => {
            if (el.tags.amenity === 'hospital') {
              if (el.tags.healthcare === 'clinic' || el.tags.healthcare === 'community_healthcare') {
                return false;
              }
              return true;
            }
            return true;
          });

        const landmarkNames = relevantLandmarks.map(el => el.tags.name);

        let slugMap = new Map();
        if (landmarkNames.length > 0) {
          const slugResponse = await fetch('/api/resolve-landmark-slug', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ names: landmarkNames }),
          });

          if (slugResponse.ok) {
            const slugData = await slugResponse.json();
            if (slugData.slugs) {
              slugData.slugs.forEach(item => {
                if (item.slug) {
                  slugMap.set(item.name, item.slug);
                }
              });
            }
          } else {
            // console.warn(`Could not fetch slugs from API, status: ${slugResponse.status}`);
          }
        }

        const processedLandmarks = relevantLandmarks.map(el => {
          const lat = el.lat || (el.center ? el.center.lat : null);
          const lon = el.lon || (el.center ? el.center.lon : null);

          if (lat === null || lon === null) {
            return null;
          }

          const slug = slugMap.get(el.tags.name);

          if (!slug) {
            return null;
          }

          return {
            name: el.tags.name,
            distance: calculateDistance(
              latitude,
              longitude,
              parseFloat(lat),
              parseFloat(lon)
            ),
            type: el.type,
            slug: slug,
          };
        });

        const filteredList = processedLandmarks
          .filter(landmark => landmark !== null)
          .filter(landmark => landmark.distance <= OVERPASS_RADIUS_KM)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, RESULTS_LIMIT);

        setLandmarks(filteredList);
      } else {
        setLandmarks([]);
      }
    } catch (error) {
      console.error("Error fetching landmarks:", error);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetchLandmarks();
  }, [fetchLandmarks]);

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