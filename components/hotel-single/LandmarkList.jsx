import React, { memo, useEffect, useState } from "react";

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

const LandmarkList = ({ latitude, longitude }) => {
  const [landmarks, setLandmarks] = useState([]);
  const OVERPASS_RADIUS_KM = 50; // Radius tetap 50 km untuk pencarian
  const RESULTS_LIMIT = 15; // Batasan jumlah hasil yang ditampilkan

  useEffect(() => {
    if (!latitude || !longitude) {
      console.error("Latitude or Longitude is invalid.");
      return;
    }

    const fetchLandmarks = async () => {
      try {
        const overpassUrl = "https://overpass-api.de/api/interpreter";
        const radiusInMeters = OVERPASS_RADIUS_KM * 1000; // Konversi ke meter

        // Overpass Query tetap sama, fokus pada kategori yang diminta dan mengecualikan 'place'
        const overpassQuery = `
          [out:json];
          (
            // Rumah Sakit (kita akan filter lebih lanjut di klien)
            node(around:${radiusInMeters},${latitude},${longitude})[amenity=hospital][!"place"];
            way(around:${radiusInMeters},${latitude},${longitude})[amenity=hospital][!"place"];

            // Bandara
            node(around:${radiusInMeters},${latitude},${longitude})[aeroway=aerodrome][!"place"];
            way(around:${radiusInMeters},${latitude},${longitude})[aeroway=aerodrome][!"place"];

            // Stasiun Kereta Api
            node(around:${radiusInMeters},${latitude},${longitude})[railway=station][!"place"];
            way(around:${radiusInMeters},${latitude},${longitude})[railway=station][!"place"];

            // Tempat Wisata Umum
            node(around:${radiusInMeters},${latitude},${longitude})[tourism~"^(attraction|museum|theme_park|zoo|monument|artwork|memorial|viewpoint|castle|ruins)$"][!"place"];
            way(around:${radiusInMeters},${latitude},${longitude})[tourism~"^(attraction|museum|theme_park|zoo|monument|artwork|memorial|viewpoint|castle|ruins)$"][!"place"];
            rel(around:${radiusInMeters},${latitude},${longitude})[tourism~"^(attraction|museum|theme_park|zoo|monument|artwork|memorial|viewpoint|castle|ruins)$"][!"place"];

            // Universitas
            node(around:${radiusInMeters},${latitude},${longitude})[amenity=university][!"place"];
            way(around:${radiusInMeters},${latitude},${longitude})[amenity=university][!"place"];

            // Terminal Bus
            node(around:${radiusInMeters},${latitude},${longitude})[amenity=bus_station][!"place"];
            way(around:${radiusInMeters},${latitude},${longitude})[amenity=bus_station][!"place"];

            // Mall / Pusat Perbelanjaan
            node(around:${radiusInMeters},${latitude},${longitude})[shop=mall][!"place"];
            way(around:${radiusInMeters},${latitude},${longitude})[shop=mall][!"place"];

          );
          out center;
        `;

        const response = await fetch(overpassUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data=${encodeURIComponent(overpassQuery)}`,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.elements) {
          const fetchedList = data.elements
            .filter(el => el.tags && el.tags.name) // Pastikan ada nama
            .filter(el => !el.tags.place) // Memastikan bukan nama tempat administratif
            .filter(el => {
              const name = el.tags.name.trim();
              return name.includes(' ') && name.split(' ').length > 1; // Pastikan nama lebih dari satu kata
            })
            // --- FILTER BARU UNTUK RUMAH SAKIT: Hindari puskesmas/klinik kecil ---
            .filter(el => {
                // Jika amenity adalah hospital, cek tag healthcare
                if (el.tags.amenity === 'hospital') {
                    // Kecualikan jika secara eksplisit ditandai sebagai clinic atau community_healthcare
                    if (el.tags.healthcare === 'clinic' || el.tags.healthcare === 'community_healthcare') {
                        return false; // Ini adalah puskesmas/klinik, buang
                    }
                    // Jika tidak ada tag healthcare atau tagnya adalah hospital, anggap ini rumah sakit besar
                    // atau tidak ada informasi yang cukup untuk menolaknya sebagai RS besar
                    return true; 
                }
                // Untuk semua kategori lain, tidak ada perubahan filter
                return true;
            })
            .map((el) => {
              const lat = el.lat || (el.center ? el.center.lat : null);
              const lon = el.lon || (el.center ? el.center.lon : null);

              if (lat === null || lon === null) {
                console.warn("Element has no valid coordinates or center:", el);
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
                // Untuk debugging, bisa lihat tag lengkapnya
                // tags: el.tags,
              };
            })
            .filter(landmark => landmark !== null)
            .filter(landmark => landmark.distance <= OVERPASS_RADIUS_KM)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, RESULTS_LIMIT);

          setLandmarks(fetchedList);
        } else {
          setLandmarks([]);
          console.warn("No 'elements' array found in the Overpass response or data is empty:", data);
        }
      } catch (error) {
        console.error("Error fetching landmarks from Overpass API:", error);
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
            🗺️ Nearby Essential & Tourist Spots
          </h2>
        </div>
      </div>

      <div className="row y-gap-10">
        {landmarks.length === 0 ? (
          <div className="col-12 text-center">
            <div className="text-14 fw-500">
              Tidak ada tempat penting terdekat yang ditemukan dalam radius {OVERPASS_RADIUS_KM} km.
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