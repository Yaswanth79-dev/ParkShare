"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LocateFixed } from "lucide-react";
import SearchBox from "./SearchBox";

// Fix Leaflet's default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface OSMDraggableMapProps {
  onLocationSelect: (lat: number, lng: number, address: string, city: string) => void;
  initialLat?: number;
  initialLng?: number;
}

const defaultCenter: [number, number] = [20.5937, 78.9629]; // India Center
const defaultZoom = 5;

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5
    });
  }, [center, zoom, map]);

  return null;
}

export default function OSMDraggableMap({ onLocationSelect, initialLat, initialLng }: OSMDraggableMapProps) {
  const [center, setCenter] = useState<[number, number]>(
    initialLat && initialLng ? [initialLat, initialLng] : defaultCenter
  );
  const [zoom, setZoom] = useState(initialLat && initialLng ? 16 : defaultZoom);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );

  const markerRef = useRef<any>(null);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
      const data = await response.json();
      if (data && data.display_name) {
        const address = data.display_name;
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state_district || "";
        onLocationSelect(lat, lng, address, city);
      } else {
        onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`, "");
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`, "");
    }
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const position = marker.getLatLng();
          setMarkerPos([position.lat, position.lng]);
          fetchAddress(position.lat, position.lng);
        }
      },
    }),
    []
  );

  const handleSearchSelect = (lat: number, lng: number, address: string, city?: string) => {
    setCenter([lat, lng]);
    setZoom(16);
    setMarkerPos([lat, lng]);
    onLocationSelect(lat, lng, address, city || "");
  };

  const goToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCenter([lat, lng]);
          setZoom(16);
          setMarkerPos([lat, lng]);
          fetchAddress(lat, lng);
        },
        () => {
          alert("Error: The Geolocation service failed.");
        }
      );
    }
  };

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-gray-200 z-0">
      <div className="absolute top-4 left-4 right-4 z-[1000] max-w-sm">
        <SearchBox onLocationSelect={handleSearchSelect} placeholder="Search to place pin..." />
      </div>
      
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ width: "100%", height: "100%", zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapController center={center} zoom={zoom} />

        {markerPos && (
          <Marker 
            position={markerPos} 
            draggable={true} 
            eventHandlers={eventHandlers}
            ref={markerRef}
          />
        )}
      </MapContainer>

      <button 
        type="button"
        onClick={goToCurrentLocation}
        className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors z-[1000]"
        title="Use My Location"
      >
        <LocateFixed className="w-5 h-5" />
      </button>
    </div>
  );
}
