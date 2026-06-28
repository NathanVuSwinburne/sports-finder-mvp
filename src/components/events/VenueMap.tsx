"use client";

import dynamic from "next/dynamic";
import type { LeafletMapProps } from "./LeafletMap";

// Leaflet touches `window`, so it must never render on the server.
const LeafletMap = dynamic(
  () => import("./LeafletMap").then((m) => m.LeafletMap),
  {
    ssr: false,
    loading: () => <div className="h-56 animate-pulse rounded-xl bg-slate-100" />,
  },
);

export function VenueMap(props: LeafletMapProps) {
  return <LeafletMap {...props} />;
}
