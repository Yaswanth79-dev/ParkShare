"use client";

import { useAuth } from "@/contexts/AuthContext";
import { parkingService } from "@/services/parkingService";
import { useEffect, useState } from "react";
import { MapPin, LogOut, Search, Clock, ShieldCheck, Star, Car } from "lucide-react";
import { Database } from "@/types/database.types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import MapView from "@/components/Map/MapView";
import SearchBox from "@/components/Map/SearchBox";

type ParkingSpace = Database['public']['Tables']['parking_spaces']['Row'];

export default function Dashboard() {
  const { user, profile, isLoading: authLoading, signOut } = useAuth();
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    
    if (!authLoading && !user) {
       router.push('/login');
       return;
    }
    
    if (authLoading || !user) return;
    
    async function fetchSpaces() {
      // Safety timeout: if the network request hangs, unlock the UI after 5 seconds
      const timeoutId = setTimeout(() => {
        if (isMounted) setLoading(false);
      }, 5000);

      try {
        setLoading(true);
        const data = await parkingService.getParkingSpaces();
        if (isMounted) setSpaces(data || []);
      } catch (err) {
        console.error("Failed to fetch spaces:", err);
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) setLoading(false);
      }
    }

    fetchSpaces();
    
    return () => {
      isMounted = false;
    };
  }, [user, router, authLoading]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!user || loading || authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-accent mb-4">
          <MapPin className="w-6 h-6" />
        </div>
        <div className="text-primary font-medium mb-2">Loading your spaces...</div>
        <div className="text-xs text-gray-400 font-mono">
          [DEBUG] User: {user ? 'Found' : 'Null'} | authLoading: {authLoading ? 'True' : 'False'} | loading: {loading ? 'True' : 'False'}
        </div>
      </div>
    </div>;
  }

  const handleLocationSelect = async (lat: number, lng: number, address: string) => {
    // For MVP, simply log. In production, center map here.
    console.log("Selected location:", lat, lng, address);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 z-10 shrink-0">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-accent">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xl text-primary">ParkShare</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard/bookings" className="hidden md:block text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              My Bookings
            </Link>
            <Link href="/dashboard/host" className="hidden sm:flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium hover:bg-accent/20 transition-colors">
              <Car className="w-4 h-4" />
              List Your Space
            </Link>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-gray-900">{profile?.full_name || "User"}</span>
                <span className="text-xs text-gray-500">{user.email || user.phone}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary font-bold">
                {(profile?.full_name || user.email || "U")[0].toUpperCase()}
              </div>
              <button onClick={handleSignOut} className="text-gray-400 hover:text-red-500 transition-colors ml-2" title="Sign Out">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Split Screen */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Column - List view */}
        <div className="w-full md:w-[400px] lg:w-[450px] bg-white border-r border-gray-200 flex flex-col h-full z-10 shrink-0 shadow-xl">
          <div className="p-4 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-bold text-primary mb-4">Find Parking</h2>
            <SearchBox onLocationSelect={handleLocationSelect} className="mb-3" />
            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-white font-medium py-2 rounded-lg text-sm shadow-sm">Available Now</button>
              <button className="flex-1 bg-gray-50 text-gray-600 font-medium py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-100 transition-colors">Schedule</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">{spaces.length} Spaces Nearby</h3>
            
            <div className="flex flex-col gap-4">
              {spaces.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center shadow-sm">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <MapPin className="w-8 h-8 text-gray-400" />
                   </div>
                   <h3 className="text-lg font-medium text-gray-900">No spaces available yet</h3>
                   <p className="text-gray-500 text-sm mt-1">Be the first to list a parking space in your area!</p>
                   <button className="mt-4 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 w-full">
                     Add a Space
                   </button>
                </div>
              ) : (
                spaces.map((space, i) => (
                  <Link href={`/space/${space.id}`} key={space.id}>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onMouseEnter={() => setSelectedSpaceId(space.id)}
                      onMouseLeave={() => setSelectedSpaceId(null)}
                      className={`bg-white p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${
                        selectedSpaceId === space.id ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-gray-200 hover:border-accent/50 hover:shadow-md'
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent/10 to-transparent -z-10 rounded-tr-xl"></div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 group-hover:text-accent transition-colors leading-tight">{space.title}</h3>
                      <div className="bg-primary/5 text-primary px-2 py-1 rounded font-bold text-sm border border-primary/10 shrink-0">
                        ₹{space.price_per_hour}/hr
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-1">{space.address}, {space.city}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        <Car className="w-3.5 h-3.5 text-gray-400"/> 
                        {space.vehicle_type === 'both' ? 'All Vehicles' : space.vehicle_type === '4-wheeler' ? 'Cars Only' : 'Bikes Only'}
                      </span>
                      {space.is_verified && (
                        <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100">
                          <ShieldCheck className="w-3.5 h-3.5"/> Verified
                        </span>
                      )}
                    </div>
                  </motion.div>
                </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Map View */}
        <div className="hidden md:block flex-1 bg-gray-100 relative overflow-hidden">
          <MapView 
            spaces={spaces} 
            selectedSpaceId={selectedSpaceId}
            onMarkerClick={(space: ParkingSpace) => router.push(`/space/${space.id}`)}
          />
        </div>
      </main>
    </div>
  );
}
