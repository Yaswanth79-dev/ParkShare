"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the leaflet component so it only renders on client
const OSMDraggableMap = dynamic(() => import("./OSMDraggableMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  ),
});

export default function DraggableMap(props: any) {
  return <OSMDraggableMap {...props} />;
}
