"use client";

import { Search, MapPin, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBoxProps {
  onLocationSelect: (lat: number, lng: number, address: string, city?: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBox({ onLocationSelect, placeholder = "Search destination...", className = "" }: SearchBoxProps) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (value.trim().length > 2) {
        searchPlaces(value);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  const searchPlaces = async (query: string) => {
    setIsLoading(true);
    try {
      // Free Nominatim API by OpenStreetMap
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=5`);
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (place: any) => {
    setValue(place.display_name);
    setShowSuggestions(false);
    
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    
    // Extract city
    const city = place.address?.city || place.address?.town || place.address?.village || place.address?.state_district || "";
    
    onLocationSelect(lat, lng, place.display_name, city);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
        />
        {isLoading && <Loader2 className="absolute right-3 top-3 text-gray-400 w-5 h-5 animate-spin" />}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 border-b border-gray-50 last:border-0"
            >
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700">{place.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
