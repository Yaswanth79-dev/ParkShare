"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { parkingService } from "@/services/parkingService";
import { MapPin, Upload, X, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import DraggableMap from "@/components/Map/DraggableMap";

export default function HostOnboarding() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    price_per_hour: "",
    vehicle_type: "both",
    latitude: 0,
    longitude: 0
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError("");

    try {
      // 1. Create the parking space
      const newSpace = await parkingService.createParkingSpace({
        owner_id: user.id,
        title: formData.title,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        price_per_hour: parseFloat(formData.price_per_hour),
        vehicle_type: formData.vehicle_type,
        latitude: formData.latitude,
        longitude: formData.longitude,
        is_verified: false
      });

      // 2. Upload images if any
      if (images.length > 0 && newSpace) {
        await Promise.all(images.map(img => 
          parkingService.uploadParkingImage(img, newSpace.id, user.id)
        ));
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="bg-primary px-8 py-10 text-white">
            <h1 className="text-3xl font-bold font-heading mb-2">List Your Parking Space</h1>
            <p className="text-primary-foreground/80">Start earning money by sharing your unused parking spot.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Space Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Covered spot near Metro Station"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Describe the parking spot, accessibility, security..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Pin Exact Location</h3>
              <p className="text-sm text-gray-500">Drag the pin to the exact location of your parking space, or search for it.</p>
              <DraggableMap 
                onLocationSelect={(lat, lng, address, city) => {
                  setFormData(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                    address: address || prev.address,
                    city: city || prev.city
                  }));
                }}
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Location & Pricing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                      required
                      type="text" 
                      placeholder="Street address, neighborhood"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Bengaluru"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Hour (₹)</label>
                  <input 
                    required
                    type="number" 
                    min="10"
                    placeholder="e.g. 40"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    value={formData.price_per_hour}
                    onChange={e => setFormData({...formData, price_per_hour: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Suitable For</label>
                <div className="flex gap-4">
                  {['2-wheeler', '4-wheeler', 'both'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, vehicle_type: type})}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                        formData.vehicle_type === type 
                        ? 'bg-accent/10 border-accent text-accent' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {type === 'both' ? 'Any Vehicle' : type === '4-wheeler' ? 'Cars Only' : 'Bikes Only'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Photos</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" 
                  id="image-upload" 
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <span className="text-gray-900 font-medium mb-1">Click to upload photos</span>
                  <span className="text-gray-500 text-sm">PNG, JPG up to 5MB</span>
                </label>
              </div>
              
              {images.length > 0 && (
                <div className="flex gap-4 overflow-x-auto py-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-gray-200">
                      <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setImages(images.filter((_, index) => index !== i))}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</> : 'Publish Listing'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
