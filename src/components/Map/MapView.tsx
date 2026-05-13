"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the leaflet component so it only renders on client
const OSMMapView = dynamic(() => import("./OSMMapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  ),
});

export default function MapView(props: any) {
  return <OSMMapView {...props} />;
}
