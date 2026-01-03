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
    date: new Date(2025, 0, 15),
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop&q=80",
    category: "Government"
  },
  {
    id: 2,
    title: "Community Festival",
    location: "Willstone Central Park",
    description: "Annual community festival featuring local vendors, live music, and family-friendly activities.",
    date: new Date(2025, 1, 20),
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80",
    category: "Social"
  },
  {
    id: 3,
    title: "Public Safety Workshop",
    location: "Fire Station #4",
    description: "Learn about emergency preparedness and public safety measures for your home and neighborhood.",
    date: new Date(2025, 2, 10),
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&q=80",
    category: "Education"
  },
];

const DURATION_MS = 5000;

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
    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-800 pointer-events-none">
      <motion.div style={{ width }} className="h-full bg-blue-500" />
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
    <section className="w-full py-24 bg-slate-950 text-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-slate-800 pb-8">
          <div className="text-left">
            <span className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-3 block">
              City Agenda
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Upcoming Events
            </h2>
          </div>
          <Link
            href="/calendar"
            className="group flex items-center gap-3 mt-6 md:mt-0 px-6 py-3 bg-slate-900 rounded-full border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-all"
          >
            <span className="text-sm font-bold">Full Calendar</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-[550px]">
          
          {/* LEFT: Visual Stage */}
          <div className="lg:col-span-7 relative rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image
                  src={events[activeTab].image}
                  alt={events[activeTab].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full text-left pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="px-3 py-1 rounded-md bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">
                    {events[activeTab].category}
                  </span>
                  <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-none tracking-tighter">
                    {events[activeTab].title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-6 text-slate-300">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-semibold uppercase tracking-wider">
                        {events[activeTab].date.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm">{events[activeTab].location}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: List Controls */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-4">
            {events.map((event, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={event.id}
                  onClick={() => setActiveTab(index)}
                  onMouseEnter={() => isActive && setIsPaused(true)}
                  onMouseLeave={() => isActive && setIsPaused(false)}
                  className={`group relative flex items-start w-full p-6 rounded-2xl transition-all duration-500 overflow-hidden border text-left ${
                    isActive 
                      ? "bg-slate-800/40 border-slate-700 shadow-xl" 
                      : "bg-transparent border-transparent hover:bg-slate-900/50"
                  }`}
                >
                  {isActive && (
                    <ProgressBar 
                      isPaused={isPaused} 
                      onComplete={handleNext} 
                    />
                  )}

                  {/* Date UI */}
                  <div className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-500 ${
                    isActive ? "bg-white text-slate-950 scale-110" : "bg-slate-900 text-slate-500"
                  }`}>
                    <span className="text-[10px] font-black uppercase">{event.date.toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-xl font-bold leading-none">{event.date.getDate()}</span>
                  </div>

                  {/* Content Area */}
                  <div className="ml-6 flex-1 text-left">
                    <h4 className={`text-lg font-bold tracking-tight transition-colors ${
                      isActive ? "text-white" : "text-slate-500"
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
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                                {event.description}
                            </p>
                        </motion.div>
                    </div>
                  </div>

                  {/* Arrow Action Button */}
                  <Link 
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className={`mt-1 p-2 rounded-full transition-all duration-500 bg-slate-900/50 border border-slate-800 hover:bg-blue-600 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] ${
                      isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
                    }`}
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                  </Link>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}