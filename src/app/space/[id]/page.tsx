"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { parkingService } from "@/services/parkingService";
import { bookingService } from "@/services/bookingService";
import { MapPin, ArrowLeft, Star, Clock, ShieldCheck, Car, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Script from "next/script";

export default function SpaceDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Basic booking state for UI
  const [hours, setHours] = useState(1);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchSpace() {
      try {
        const data = await parkingService.getParkingSpaceById(resolvedParams.id);
        setSpace(data);
      } catch (err: any) {
        setError("Failed to load parking space details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSpace();
  }, [resolvedParams.id, user, authLoading, router]);

  const handleBooking = async () => {
    if (!user || !space) return;
    
    setBookingLoading(true);
    setError("");

    try {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);
      const totalAmount = (space.price_per_hour * hours) + 10; // +10 platform fee

      // 1. Create Razorpay Order
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment');
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummykey",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ParkShare India",
        description: `Booking: ${space.title}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Payment Successful -> Create Booking in Database
          try {
            await bookingService.createBooking({
              parking_id: space.id,
              user_id: user.id,
              booking_start: startTime.toISOString(),
              booking_end: endTime.toISOString(),
              total_price: totalAmount,
              booking_status: 'confirmed'
            });

            router.push('/dashboard/bookings?success=true');
          } catch (err: any) {
             console.error("Booking creation failed:", err);
             // Note: In production, you would handle edge cases where payment succeeds but DB insert fails
             alert("Payment successful but failed to save booking. Please contact support.");
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || "User",
          email: user.email || "",
        },
        theme: {
          color: "#0f172a", // primary color
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any){
         setError("Payment failed: " + response.error.description);
      });

      rzp.open();
      
    } catch (err: any) {
      setError(err.message || "Failed to initiate booking");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background flex-col gap-4">
        <p className="text-xl font-medium text-gray-500">Parking space not found.</p>
        <Link href="/dashboard" className="text-primary hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{space.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400"/> 4.8 (120 reviews)</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {space.city}</span>
                {space.is_verified && <span className="flex items-center gap-1 text-green-600 font-medium"><ShieldCheck className="w-4 h-4"/> Verified Space</span>}
              </div>
            </div>

            {/* Images */}
            <div className="rounded-2xl overflow-hidden aspect-video bg-gray-100 border border-gray-200">
              {space.parking_images && space.parking_images.length > 0 ? (
                <img src={space.parking_images[0].image_url} alt="Parking space" className="w-full h-full object-cover" />
              ) : (
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" alt="Default parking space" className="w-full h-full object-cover" />
              )}
            </div>

            {/* Info Sections */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 py-6 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary font-bold text-lg">
                  {space.profiles?.full_name ? space.profiles.full_name[0].toUpperCase() : 'H'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Hosted by {space.profiles?.full_name || 'Anonymous'}</h3>
                  <p className="text-sm text-gray-500">Joined in 2023</p>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {space.address}, {space.city}
                  </p>
                </div>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${space.latitude},${space.longitude}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl font-medium transition-colors"
                >
                  Get Directions
                </a>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">About this space</h3>
                <p className="text-gray-600 leading-relaxed">{space.description || "A safe and convenient parking spot."}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Car className="w-5 h-5 text-gray-400"/>
                    <span>{space.vehicle_type === 'both' ? 'All Vehicles' : space.vehicle_type === '4-wheeler' ? 'Cars Only' : 'Bikes Only'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-5 h-5 text-gray-400"/>
                    <span>Instant Booking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24"
            >
              <div className="mb-6 border-b border-gray-100 pb-4">
                <span className="text-2xl font-bold text-gray-900">₹{space.price_per_hour}</span>
                <span className="text-gray-500"> / hour</span>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Hours)</label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setHours(Math.max(1, hours - 1))} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">-</button>
                    <div className="flex-1 text-center font-medium text-gray-900">{hours}</div>
                    <button onClick={() => setHours(hours + 1)} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">+</button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>₹{space.price_per_hour} x {hours} hours</span>
                    <span>₹{space.price_per_hour * hours}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Platform fee</span>
                    <span>₹10</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg text-gray-900 mt-4 pt-4 border-t border-gray-100">
                    <span>Total</span>
                    <span>₹{(space.price_per_hour * hours) + 10}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {bookingLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : 'Confirm Booking'}
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-4">You won't be charged yet</p>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
