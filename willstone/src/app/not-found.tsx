"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search, Map as MapIcon } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden px-6">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-blue-500 font-black tracking-[0.3em] uppercase text-sm mb-4 block">
            Error 404
          </span>
          <h1 className="text-[12rem] md:text-[16rem] font-black text-white leading-none tracking-tighter italic select-none opacity-20">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div 
          className="-mt-12 md:-mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Lost in Willstone?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            The page you are looking for has been moved, deleted, or never existed in the city archives.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] group"
            >
              <Home size={20} />
              Return Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-2xl font-bold transition-all"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Quick Help Links */}
        <motion.div 
          className="mt-16 pt-10 border-t border-slate-900 grid grid-cols-2 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/map" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors">
            <MapIcon size={14} /> City Map
          </Link>
          <Link href="/resource-hub" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors">
            <Search size={14} /> Resource Hub
          </Link>
          <Link href="/calendar" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors">
             Calendar
          </Link>
        </motion.div>
      </div>
    </main>
  );
}