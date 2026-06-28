"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type LeafletMapProps = {
  lat: number;
  lng: number;
  label: string;
};

/**
 * Minimal venue map. Uses a CircleMarker (no external icon assets) and OSM
 * demo tiles. NOTE: OSM public tiles are for MVP/demo only — production should
 * use a proper or self-hosted tile provider.
 */
export function LeafletMap({ lat, lng, label }: LeafletMapProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "224px", width: "100%" }}
      className="z-0 rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={[lat, lng]}
        radius={10}
        pathOptions={{ color: "#4f46e5", fillColor: "#6366f1", fillOpacity: 0.7 }}
      >
        <Popup>{label}</Popup>
      </CircleMarker>
    </MapContainer>
  );
}
