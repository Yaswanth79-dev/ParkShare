"use client";

import { motion } from "framer-motion";
import { MapPin, Search, ShieldCheck, Clock, Car, Star } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b-0 border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-accent">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-primary">
                ParkShare<span className="text-accent">.</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 font-medium">
              <Link href="/dashboard" className="text-foreground/80 hover:text-primary transition-colors">Find Parking</Link>
              <Link href="/dashboard/host" className="text-foreground/80 hover:text-primary transition-colors">Become a Host</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:block text-foreground font-medium hover:text-primary px-4 py-2 transition-colors">
                Log in
              </Link>
              <Link href="/login" className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full mix-blend-multiply" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-multiply" />
        </div>

        <div className="max-w-4xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6 border border-accent/20">
              Launching in Top Indian Cities 🇮🇳
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-heading font-bold text-primary mb-6 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Find Parking Anywhere in <span className="text-accent relative whitespace-nowrap">
              Minutes
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Reserve trusted parking spots nearby, avoid the stress of searching, and start your journey with peace of mind.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95">
              <Search className="w-5 h-5" />
              Find Parking
            </Link>
            <Link href="/dashboard/host" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-50 border border-gray-200 transition-all shadow-sm hover:shadow-md active:scale-95">
              <Car className="w-5 h-5" />
              Earn From Your Space
            </Link>
          </motion.div>
        </div>

        {/* Dashboard/Map Mockup */}
        <motion.div 
          className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-200/60 relative bg-white"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Mac window header */}
          <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          {/* Mockup content */}
          <div className="flex flex-col md:flex-row h-[500px]">
            <div className="w-full md:w-1/3 border-r border-gray-100 p-6 flex flex-col gap-4 overflow-hidden">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Search destinations..." className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" defaultValue="Koramangala, Bengaluru" />
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-accent/10 text-accent font-medium py-2 rounded-lg text-sm border border-accent/20">Now</button>
                <button className="flex-1 bg-gray-50 text-gray-600 font-medium py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-100 transition-colors">Later</button>
              </div>
              <div className="flex-1 overflow-hidden relative flex flex-col gap-3 mt-2">
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none h-full" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all cursor-pointer bg-white group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">Premium Covered Spot</h3>
                      <span className="font-bold text-primary">₹40/hr</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-700">4.8</span>
                      <span>(120 reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md"><Clock className="w-3 h-3"/> 2 min walk</span>
                      <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md"><ShieldCheck className="w-3 h-3"/> Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block w-2/3 bg-blue-50 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative animate-bounce">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-accent shadow-xl shadow-primary/30 border-4 border-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rotate-45 z-[-1]"></div>
                </div>
              </div>
              <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 opacity-70">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-lg border-2 border-white">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute bottom-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2 opacity-70">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-lg border-2 border-white">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Trust Badges */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">Trusted by drivers across India</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
             <div className="text-xl font-bold font-heading">AutoPark</div>
             <div className="text-xl font-bold font-heading">DriveIndia</div>
             <div className="text-xl font-bold font-heading">CityCommute</div>
             <div className="text-xl font-bold font-heading">UrbanMobility</div>
          </div>
        </div>
      </section>
    </div>
  );
}
