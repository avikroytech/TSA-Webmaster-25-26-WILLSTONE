"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useAnimationFrame, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar as CalendarIcon, MapPin } from "lucide-react";

// --- Data ---
const events = [
  {
    id: 1,
    title: "Town Hall Meeting",
    location: "City Council Chambers",
    description: "Join us for the monthly town hall meeting where we discuss community matters and upcoming projects.",
    date: new Date(2026, 0, 15),
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop&q=80",
    category: "Government"
  },
  {
    id: 2,
    title: "Community Festival",
    location: "Willstone Central Park",
    description: "Annual community festival featuring local vendors, live music, and family-friendly activities.",
    date: new Date(2026, 1, 20),
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80",
    category: "Social"
  },
  {
    id: 3,
    title: "Public Safety Workshop",
    location: "Fire Station #4",
    description: "Learn about emergency preparedness and public safety measures for your home and neighborhood.",
    date: new Date(2026, 2, 10),
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&q=80",
    category: "Education"
  },
];

const DURATION_MS = 5000;

// --- ProgressBar Component (Darker for Light Mode) ---
const ProgressBar = ({ isPaused, onComplete }: { isPaused: boolean, onComplete: () => void }) => {
  const progress = useMotionValue(0);
  const width = useTransform(progress, [0, DURATION_MS], ["0%", "100%"]);

  useAnimationFrame((time, delta) => {
    if (isPaused) return;
    const nextValue = progress.get() + delta;
    if (nextValue >= DURATION_MS) {
      progress.set(DURATION_MS);
      onComplete();
    } else {
      progress.set(nextValue);
    }
  });

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#A9B5DF]/30 pointer-events-none">
      <motion.div 
        style={{ width }} 
        className="h-full bg-[#2D336B]" 
      />
    </div>
  );
};

export default function CalendarSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = () => {
    setActiveTab((prev) => (prev + 1) % events.length);
  };

  return (
    <section className="w-full py-24 bg-[#FFF2F2] text-[#2D336B] overflow-hidden relative">
      {/* Background Texture Overlay (Subtle) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-12">
          <div className="text-left">
            <h2 className="text-5xl md:text-7xl font-display font-black text-[#2D336B] leading-none uppercase tracking-tighter">
              Upcoming <span className="text-[#7886C7]">Events</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 min-h-[600px]">
          
          {/* LEFT: Visual Stage */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden shadow-2xl bg-[#2D336B] border-4 border-[#2D336B]/5 transform -rotate-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <Image
                  src={events[activeTab].image}
                  alt={events[activeTab].title}
                  fill
                  className="object-cover brightness-90 contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D336B]/80 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="px-4 py-1.5 bg-[#2D336B] text-[#FFF2F2] text-[10px] font-black uppercase tracking-[0.25em] mb-6 inline-block transform -skew-x-12">
                    <span className="inline-block transform skew-x-12">{events[activeTab].category}</span>
                  </span>
                  <h3 className="text-4xl md:text-6xl font-display font-black mb-8 text-white leading-[0.9] uppercase tracking-tighter drop-shadow-md">
                    {events[activeTab].title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-8 text-white/90">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-6 h-6 text-[#A9B5DF]" />
                      <span className="text-sm font-black uppercase tracking-widest">
                        {events[activeTab].date.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-[#A9B5DF]" />
                      <span className="text-sm font-bold">{events[activeTab].location}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: List Controls */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-5">
            {events.map((event, index) => {
              const isActive = activeTab === index;
              return (
                <div
                  key={event.id}
                  onClick={() => setActiveTab(index)}
                  onMouseEnter={() => isActive && setIsPaused(true)}
                  onMouseLeave={() => isActive && setIsPaused(false)}
                  className={`group relative flex items-start w-full p-6 transition-all duration-500 overflow-hidden cursor-pointer transform -skew-x-6 border-l-8 ${
                    isActive 
                      ? "bg-[#2D336B] border-[#7886C7] shadow-[10px_10px_0px_#A9B5DF]" 
                      : "bg-white border-transparent hover:border-[#7886C7]/30 shadow-sm hover:shadow-md"
                  }`}
                >
                  {isActive && (
                    <ProgressBar 
                      isPaused={isPaused} 
                      onComplete={handleNext} 
                    />
                  )}

                  <div className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 transition-all duration-500 transform skew-x-6 ${
                    isActive ? "bg-[#FFF2F2] text-[#2D336B] scale-110" : "bg-[#A9B5DF]/20 text-[#2D336B]"
                  }`}>
                    <span className="text-[10px] font-black uppercase">{event.date.toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-2xl font-black leading-none">{event.date.getDate()}</span>
                  </div>

                  <div className="ml-8 flex-1 transform skew-x-6">
                    <h4 className={`text-xl font-black uppercase tracking-tight transition-colors ${
                      isActive ? "text-[#FFF2F2]" : "text-[#2D336B]"
                    }`}>
                      {event.title}
                    </h4>
                    
                    <div className="relative overflow-hidden">
                      <motion.div
                        initial={false}
                        animate={{ 
                          height: isActive ? "auto" : 0, 
                          opacity: isActive ? 1 : 0 
                        }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                      >
                        <p className="text-sm text-[#A9B5DF] mt-3 leading-relaxed font-medium">
                          {event.description}
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  <div className={`mt-1 transform skew-x-6 transition-all duration-500 ${
                    isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}>
                    <ArrowRight className="w-6 h-6 text-[#7886C7]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}