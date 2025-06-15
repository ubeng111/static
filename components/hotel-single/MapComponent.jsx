"use client";
import React, { memo, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [35, 57], // Adjusted to maintain 25:41 aspect ratio (35 / 25 * 41 ≈ 57)
  iconAnchor: [17, 57], // Adjusted: anchor at bottom center (half of width, full height)
  popupAnchor: [0, -57], // Adjusted: popup appears above the marker
});

const MapComponent = ({ latitude, longitude, title, dictionary }) => { // Menerima dictionary
  const markerRef = useRef(null);
  const mapComponentDict = dictionary?.mapComponent || {}; // Akses dictionary

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, []);

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