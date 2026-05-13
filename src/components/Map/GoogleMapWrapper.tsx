"use client";

import { useJsApiLoader } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

export default function GoogleMapWrapper({ children }: { children: React.ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-blue-50/50 p-6 text-center">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 max-w-sm">
          <p className="text-red-600 font-medium mb-2">Failed to load Google Maps.</p>
          <p className="text-sm text-gray-500">Please check your internet connection or API Key.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-blue-50/20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Fallback if API key is not yet set by user
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-blue-50/50 p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Map Integration Complete</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            The Google Maps codebase is completely integrated and ready! To view the live map, please add your actual Google Maps API Key to the <code className="bg-gray-100 px-2 py-1 rounded text-primary">.env.local</code> file and restart the development server.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
