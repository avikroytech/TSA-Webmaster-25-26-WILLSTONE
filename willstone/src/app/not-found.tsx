"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search, Map as MapIcon, Construction } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-[#FFF2F2] flex items-center justify-center overflow-hidden px-6">
      {/* Background Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: `radial-gradient(#2D336B 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
      />

      {/* Decorative "Road Lines" */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-[#2D336B]/10 to-transparent flex flex-col justify-around items-center">
         {[...Array(10)].map((_, i) => (
           <div key={i} className="w-1 h-20 bg-[#FFF2F2]" />
         ))}
      </div>

      <div className="relative z-10 max-w-3xl w-full">
        <div className="flex flex-col items-center text-center">
          
          {/* Error Code: Large Signpost style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-[#A9B5DF] transform translate-x-3 translate-y-3 border-2 border-[#2D336B]" />
            <div className="relative bg-[#2D336B] text-[#FFF2F2] px-12 py-6 border-2 border-[#2D336B]">
              <h1 className="text-8xl md:text-[10rem] font-display font-black leading-none tracking-tighter">
                404
              </h1>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#7886C7] text-white px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] border-2 border-[#2D336B] whitespace-nowrap">
                Road Closed
              </div>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-6xl font-display font-black text-[#2D336B] uppercase tracking-tighter leading-none">
              Nothing to <span className="text-[#7886C7]">See Here</span>
            </h2>
            <p className="text-[#2D336B]/70 font-bold text-sm md:text-base max-w-md mx-auto uppercase tracking-wide leading-relaxed">
              You have tried to access a page that does not exist!
            </p>
          </motion.div>

          {/* Action Buttons: Skewed Highway Style */}
          <motion.div 
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/"
              className="group relative w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-[#7886C7] transform -skew-x-12 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
              <div className="relative flex items-center justify-center gap-3 px-10 py-4 bg-[#2D336B] text-white transform -skew-x-12 font-black uppercase tracking-widest text-sm transition-all border-2 border-[#2D336B]">
                <Home size={18} className="skew-x-12" />
                <span className="skew-x-12">Return Home</span>
              </div>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="group relative w-full sm:w-auto"
            >
              <div className="relative flex items-center justify-center gap-3 px-10 py-4 bg-white text-[#2D336B] transform -skew-x-12 font-black uppercase tracking-widest text-sm transition-all border-2 border-[#2D336B] hover:bg-[#FFF2F2]">
                <ArrowLeft size={18} className="skew-x-12" />
                <span className="skew-x-12">Backtrack</span>
              </div>
            </button>
          </motion.div>

          {/* Navigation Directory */}
          <motion.div 
            className="mt-20 w-full pt-10 border-t-4 border-[#2D336B]/10 grid grid-cols-2 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/map" className="flex flex-col items-center gap-2 group">
              <div className="p-3 bg-[#2D336B] border-2 border-[#7886C7] group-hover:bg-[#7886C7] group-hover:text-white transition-colors">
                <MapIcon size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D336B]">City Map</span>
            </Link>
            
            <Link href="/request" className="flex flex-col items-center gap-2 group">
              <div className="p-3 bg-[#2D336B] border-2 border-[#7886C7] group-hover:bg-[#7886C7] group-hover:text-white transition-colors">
                <Construction size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D336B]">Request Hub</span>
            </Link>

            <Link href="/resource-hub" className="hidden md:flex flex-col items-center gap-2 group">
              <div className="p-3 bg-[#2D336B] border-2 border-[#7886C7] group-hover:bg-[#7886C7] group-hover:text-white transition-colors">
                <Search size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D336B]">Search Resource</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}