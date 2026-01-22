'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Resource {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
}

const resources: Resource[] = [
  {
    id: 1,
    name: "Community Center",
    description: "A modern facility offering recreational programs, meeting spaces, and community events for residents of all ages.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&q=80",
    color: "#FFD700", 
  },
  {
    id: 2,
    name: "Public Library",
    description: "Access to thousands of books, digital resources, study spaces, and educational programs for lifelong learning.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop&q=80",
    color: "#A9B5DF", 
  },
  {
    id: 3,
    name: "Parks & Recreation",
    description: "Beautiful parks, walking trails, sports facilities, and outdoor recreation programs for the whole family.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80",
    color: "#7886C7", 
  },
];

export default function SpotlightCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlickering, setIsFlickering] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const triggerTransition = (nextIndex: number) => {
    setIsFlickering(true);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsFlickering(false);
    }, 450);
  };

  const navigate = (direction: number) => {
    const next = (currentIndex + direction + resources.length) % resources.length;
    triggerTransition(next);
  };

  useEffect(() => {
    if (isPaused || isFlickering) return;
    const interval = setInterval(() => navigate(1), 6000);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex, isFlickering]);

  const currentResource = resources[currentIndex];

  const lightVariants = {
    on: { opacity: 1, filter: "brightness(1) contrast(1)" },
    off: { 
      opacity: [1, 0, 0.4, 0, 0.2, 0],
      filter: "brightness(0.5) contrast(1.2)",
      transition: { duration: 0.4 }
    }
  };

  return (
    <section className="w-full min-h-screen py-24 bg-[#0A0C1A] overflow-hidden relative flex flex-col justify-center">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/asphalt-dark.png')] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative w-full">
        
        {/* Streetlight Fixture */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
            <div className="w-2 h-32 bg-gradient-to-b from-[#1a1c2e] to-[#2D336B]" />
            <div className="w-24 h-6 bg-[#2D336B] rounded-t-3xl border-b border-white/10" />
            <div className="w-32 h-10 bg-[#2D336B] rounded-b-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative flex items-center justify-center">
                <motion.div 
                    animate={{ 
                        backgroundColor: isFlickering ? "#111" : currentResource.color,
                        boxShadow: isFlickering ? "none" : `0px 0px 50px 15px ${currentResource.color}`
                    }}
                    className="w-20 h-4 rounded-full blur-[4px] transition-all duration-500"
                />
            </div>
        </div>

        <div className="relative w-full flex flex-col items-center pt-20">
          
          {/* Volumetric Light Cone */}
          <AnimatePresence mode="wait">
            {!isFlickering && (
              <motion.div
                key={`volumetric-beam-${currentIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-0"
                style={{ width: '2000px', height: '1200px' }}
              >
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full"
                  style={{
                    background: `conic-gradient(from 135deg at 50% 0%, transparent 0deg, ${currentResource.color}20 30deg, ${currentResource.color}30 45deg, ${currentResource.color}20 60deg, transparent 90deg)`,
                    filter: 'blur(100px)',
                  }}
                />
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-full"
                  style={{
                    background: `conic-gradient(from 155deg at 50% 0%, transparent 0deg, ${currentResource.color}35 20deg, ${currentResource.color}35 25deg, transparent 45deg)`,
                    filter: 'blur(50px)',
                  }}
                />
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Grid */}
          <div className="relative z-10 w-full mt-16 min-h-[500px] flex items-center">
            <motion.div
              variants={lightVariants}
              animate={isFlickering ? "off" : "on"}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full"
            >
              {/* Image Side */}
              <div className="relative order-2 lg:order-1">
                <div 
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[110%] h-32 blur-[80px] opacity-20"
                  style={{ background: `radial-gradient(circle, ${currentResource.color} 0%, transparent 70%)` }}
                />
                
                <div className="absolute inset-0 bg-[#2D336B] transform translate-x-4 translate-y-4 -z-10" />
                <div className="relative aspect-[4/3] border-[3px] border-[#2D336B] overflow-hidden bg-slate-900 shadow-2xl">
                  <Image
                    src={currentResource.image}
                    alt={currentResource.name}
                    fill
                    className="object-cover opacity-90 transition-opacity duration-700"
                  />
                  <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]" />
                </div>
              </div>

              {/* Text Side */}
              <div className="flex flex-col justify-center space-y-6 order-1 lg:order-2">
                <div className="space-y-2">
                    <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                        {currentResource.name}
                    </h2>
                </div>
                
                <p className="text-[#A9B5DF] text-lg md:text-xl font-medium leading-relaxed max-w-lg border-l-4 border-white/10 pl-6">
                  {currentResource.description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Navigation Bar */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 mt-24 z-20">
             {/* Progress Markers */}
             <div className="flex gap-3">
                {resources.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => triggerTransition(i)}
                        className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-20 bg-white shadow-[0_0_15px_#fff]' : 'w-8 bg-[#2D336B]'}`}
                    />
                ))}
             </div>
             
             {/* Nav Buttons */}
             <div className="flex gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border-2 border-[#2D336B] text-white flex items-center justify-center hover:bg-white hover:text-[#2D336B] transition-all font-bold tracking-widest text-sm"
                >
                    PREV
                </button>
                <button 
                    onClick={() => navigate(1)}
                    className="px-6 py-3 bg-[#2D336B] border-2 border-[#2D336B] text-white flex items-center justify-center hover:bg-[#7886C7] transition-all font-bold tracking-widest text-sm"
                >
                    NEXT
                </button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}