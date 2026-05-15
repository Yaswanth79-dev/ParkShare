"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { LocateFixed, Loader2 } from "lucide-react";

const libraries: ("places")[] = ["places"];

interface GoogleMapViewProps {
  spaces: any[];
  onMarkerClick?: (space: any) => void;
  selectedSpaceId?: string | null;
  onBoundsChanged?: (bounds: any) => void;
}

const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India Center
const defaultZoom = 5;

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function GoogleMapView({ spaces, onMarkerClick, selectedSpaceId, onBoundsChanged }: GoogleMapViewProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const goToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          if (map) {
            map.panTo(pos);
            map.setZoom(14);
          }
        },
        () => {
          alert("Error: The Geolocation service failed. Please allow location permissions.");
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    if (spaces.length > 0) {
      // Auto center to spaces if needed
      const bounds = new window.google.maps.LatLngBounds();
      let hasValidCoords = false;
      spaces.forEach(space => {
        if (space.latitude && space.longitude) {
          bounds.extend({ lat: space.latitude, lng: space.longitude });
          hasValidCoords = true;
        }
      });
      if (hasValidCoords) {
        map.fitBounds(bounds);
      }
    }
  }, [spaces]);

  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (loadError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-blue-50/50 p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Map Integration Complete</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Please add your actual Google Maps API Key to the <code className="bg-gray-100 px-2 py-1 rounded text-primary">.env.local</code> file and restart the server to view the live map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full z-0">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={defaultZoom}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        onBoundsChanged={() => {
           if (map && onBoundsChanged) {
              const bounds = map.getBounds();
              if (bounds) {
                 onBoundsChanged({
                   north: bounds.getNorthEast().lat(),
                   east: bounds.getNorthEast().lng(),
                   south: bounds.getSouthWest().lat(),
                   west: bounds.getSouthWest().lng(),
                 });
              }
           }
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }]
            }
          ]
        }}
      >
        {spaces.map((space) => {
          const isSelected = selectedSpaceId === space.id;
          return (
            <Marker
              key={space.id}
              position={{ lat: space.latitude, lng: space.longitude }}
              onClick={() => onMarkerClick && onMarkerClick(space)}
              label={{
                text: `₹${space.price_per_hour}`,
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
                className: "mt-8 bg-gray-900 px-2 py-1 rounded-md shadow-lg"
              }}
              icon={{
                url: isSelected
                    ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#000000"/><path d="M16 8C11.58 8 8 11.58 8 16C8 20.42 11.58 24 16 24C20.42 24 24 20.42 24 16C24 11.58 20.42 8 16 8ZM16 22C12.69 22 10 19.31 10 16C10 12.69 12.69 10 16 10C19.31 10 22 12.69 22 16C22 19.31 19.31 22 16 22Z" fill="white"/><circle cx="16" cy="16" r="4" fill="white"/></svg>')
                    : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#1e40af"/><path d="M16 8C11.58 8 8 11.58 8 16C8 20.42 11.58 24 16 24C20.42 24 24 20.42 24 16C24 11.58 20.42 8 16 8ZM16 22C12.69 22 10 19.31 10 16C10 12.69 12.69 10 16 10C19.31 10 22 12.69 22 16C22 19.31 19.31 22 16 22Z" fill="white"/><circle cx="16" cy="16" r="4" fill="white"/></svg>'),
                scaledSize: isSelected ? new window.google.maps.Size(36, 36) : new window.google.maps.Size(32, 32),
              }}
            />
          );
        })}
      </GoogleMap>

      {/* Floating Controls */}
      <button 
        onClick={goToCurrentLocation}
        className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors z-[1000]"
        title="Use My Location"
      >
        <LocateFixed className="w-5 h-5" />
      </button>
    </div>
  );
}
