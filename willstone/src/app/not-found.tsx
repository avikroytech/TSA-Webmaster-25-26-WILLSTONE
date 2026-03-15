"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f5f0eb] flex flex-col items-center justify-center px-6 font-sans text-center">

        {/* 404 Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-center gap-2 mb-8 select-none"
        >
          <span className="text-[10rem] sm:text-[14rem] font-black text-[#E1DBD0] leading-none font-display">
            4
          </span>

          {/* Map "0" */}
          <div className="w-28 sm:w-40 h-32 sm:h-48 relative flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
              {/* Left flap */}
              <path d="M10 40 L40 20 L40 90 L10 110 Z" fill="#9BAC9F" />
              {/* Center flap */}
              <path d="M40 20 L80 32 L80 102 L40 90 Z" fill="#A8BCAE" />
              {/* Right flap */}
              <path d="M80 32 L110 22 L110 92 L80 102 Z" fill="#9BAC9F" />
              {/* Center cutout */}
              <path d="M52 35.6 L68 40.4 L68 88.4 L52 81.6 Z" fill="#f5f0eb" />
            </svg>
          </div>

          <span className="text-[10rem] sm:text-[14rem] font-black text-[#E1DBD0] leading-none font-display">
            4
          </span>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl font-display text-[#1c2b2b] mb-4 tracking-wide">
            Lost in Willstone?
          </h1>
          <p className="text-[#6C7A73] max-w-[28rem] mx-auto text-[0.95rem] sm:text-[1.05rem] mb-10 leading-[1.7] font-sans">
            We can't seem to find the page you're looking for. It might have been moved, deleted, or perhaps it took a scenic detour through the Town Square.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
        >
          <Link
            href="/"
            className="w-full sm:w-[10rem] py-3.5 bg-[#264D52] text-[#f5f0eb] rounded-full font-bold text-[0.95rem] tracking-wide hover:bg-[#1a3539] transition-colors font-sans flex items-center justify-center shadow-sm"
          >
            Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-[10rem] py-3.5 bg-transparent border-[1.5px] border-[#9BAC9F] text-[#264D52] rounded-full font-bold text-[0.95rem] tracking-wide hover:bg-[#E1DBD0]/30 transition-colors font-sans flex items-center justify-center"
          >
            Go Back
          </button>
        </motion.div>

      </main>
      <Footer />
    </>
  );
}