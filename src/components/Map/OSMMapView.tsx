"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LocateFixed } from "lucide-react";

// Fix Leaflet's default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface OSMMapViewProps {
  spaces: any[];
  onMarkerClick?: (space: any) => void;
  selectedSpaceId?: string | null;
  onBoundsChanged?: (bounds: any) => void;
}

const defaultCenter: [number, number] = [20.5937, 78.9629]; // India Center
const defaultZoom = 5;

// Custom HTML icon for price tag
const createPriceIcon = (price: number, isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div class="transform -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer z-10 ${isSelected ? 'scale-110 z-50' : 'hover:scale-105'}">
        <div class="font-bold px-3 py-1.5 rounded-full shadow-lg border-2 flex items-center gap-1 transition-colors ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-200'}">
          ₹${price}
        </div>
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 15]
  });
};

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [center, zoom, map]);

  return null;
}

export default function OSMMapView({ spaces, onMarkerClick, selectedSpaceId, onBoundsChanged }: OSMMapViewProps) {
  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);

  const goToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setZoom(14);
        },
        () => {
          alert("Error: The Geolocation service failed. Please allow location permissions.");
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  return (
    <div className="relative w-full h-full z-0">
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

        {spaces.map((space) => {
          const isSelected = selectedSpaceId === space.id;
          return (
            <Marker
              key={space.id}
              position={[space.latitude, space.longitude]}
              icon={createPriceIcon(space.price_per_hour, isSelected)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(space)
              }}
            >
            </Marker>
          );
        })}
      </MapContainer>

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
