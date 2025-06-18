"use client";
import React, { memo, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet"; //
import "leaflet/dist/leaflet.css"; //

// Hapus import L dari 'leaflet' di sini secara global.
// Ini adalah sumber masalah karena L akan dievaluasi di server.
// import L from "leaflet"; // <-- HAPUS BARIS INI

const MapComponent = ({ latitude, longitude, title, dictionary }) => {
  const markerRef = useRef(null); //
  const mapComponentDict = dictionary?.mapComponent || {}; //
  const [customIcon, setCustomIcon] = useState(null); // State untuk menyimpan instance ikon Leaflet

  useEffect(() => { //
    // Pastikan kode ini hanya berjalan di sisi klien
    if (typeof window !== "undefined") { //
      // Import library Leaflet di dalam useEffect.
      // Menggunakan `require` di dalam scope ini menunda eksekusi sampai di klien.
      const L = require("leaflet"); //
      
      const icon = new L.Icon({ //
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", //
        iconSize: [35, 57], // Adjusted to maintain 25:41 aspect ratio (35 / 25 * 41 ≈ 57)
        iconAnchor: [17, 57], // Adjusted: anchor at bottom center (half of width, full height)
        popupAnchor: [0, -57], // Adjusted: popup appears above the marker
      });
      setCustomIcon(icon); // Simpan instance ikon ke state

      if (markerRef.current) { //
        markerRef.current.openPopup(); //
      }
    }
  }, []); // [] agar useEffect hanya berjalan sekali setelah komponen mount di klien

  // Tampilkan loading state atau fallback jika customIcon belum siap (belum diinisialisasi di klien)
  if (!customIcon) { //
    return (
      <div className="container">
        <h2 className="text-center fw-bold mb-3 text-dark" style={{ fontSize: "24px" }}>
          {mapComponentDict.mapTitle?.replace('{title}', title?.toLowerCase()) || `🗺️ Map ${title?.toLowerCase()}`}
        </h2>
        <div style={{ height: "500px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <p>Loading Map...</p>
        </div>
      </div>
    );
  }

  // Setelah customIcon tersedia, render MapContainer
  return (
    <div className="container">
      {/* Teks dari dictionary dengan penggantian placeholder */}
      <h2 className="text-center fw-bold mb-3 text-dark" style={{ fontSize: "24px" }}>
        {mapComponentDict.mapTitle?.replace('{title}', title?.toLowerCase()) || `🗺️ Map ${title?.toLowerCase()}`}
      </h2>
      <div className="row g-2">
        <MapContainer
          center={[latitude, longitude]}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
          scrollWheelZoom={false}
          zoomControl={false}
        >
          <ZoomControl position="topright" />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[latitude, longitude]} icon={customIcon} ref={markerRef}>
            <Popup>{title}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default memo(MapComponent);