"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { bookingService } from "@/services/bookingService";
import { MapPin, Calendar, Clock, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function BookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success");
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchBookings() {
      try {
        const data = await bookingService.getUserBookings(user!.id);
        setBookings(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <span className="font-heading font-bold text-xl text-primary">Your Bookings</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl mb-8 flex items-center gap-3 shadow-sm"
          >
            <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
            <div>
              <h4 className="font-bold">Booking Confirmed!</h4>
              <p className="text-sm">Your parking space has been successfully reserved.</p>
            </div>
          </motion.div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm mt-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Calendar className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h2>
            <p className="text-gray-500 mb-6">When you book a parking space, it will appear here.</p>
            <Link href="/dashboard" className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-md">
              Find Parking
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, i) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                        booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.booking_status === 'completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.booking_status.toUpperCase()}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">{booking.parking_spaces?.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-primary">₹{booking.total_price}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0"/>
                      <span className="text-sm">{booking.parking_spaces?.address}, {booking.parking_spaces?.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400 shrink-0"/>
                      <span className="text-sm">
                        {new Date(booking.booking_start).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
