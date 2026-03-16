"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useAnimationFrame, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

// --- Data ---
const defaultEvents = [
  {
    id: 1,
    title: "Annual Willstone City Gala",
    location: "Town Square",
    description: "Celebrate our heritage and future at the historic Town Square. Live music, local dining, and community awards.",
    date: new Date(2026, 0, 15), // June 15
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop&q=80",
    category: "Featured Event",
    color: "bg-[#264D52]" // Dark Teal
  },
  {
    id: 2,
    title: "Winter Farmers Market",
    location: "Community Pavilion",
    description: "Local produce, handmade crafts, and hot beverages inside the Community Pavilion.",
    date: new Date(2026, 1, 15), // Jan 15
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80",
    category: "Market",
    color: "bg-[#264D52]" // Dark Teal
  },
  {
    id: 3,
    title: "Town Hall: Green Energy",
    location: "City Council Chambers",
    description: "Join the Mayor to discuss the new solar initiatives for public buildings and residential...",
    date: new Date(2026, 1, 20), // Feb 20
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&q=80",
    category: "Town Hall",
    color: "bg-[#496A49]" // Green
  },
  {
    id: 4,
    title: "Spring Youth Art Fair",
    location: "Central Library Annex",
    description: "Showcasing the creative talents of Willstone's K-12 students at the Central Library Annex.",
    date: new Date(2026, 2, 10), // Mar 10
    image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&h=600&fit=crop&q=80",
    category: "Art Fair",
    color: "bg-[#C59F82]" // Brown
  },
];

const DURATION_MS = 10000;

// --- ProgressBar Component ---
const ProgressBar = ({ isPaused, onComplete, color }: { isPaused: boolean, onComplete: () => void, color: string }) => {
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
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100/50 pointer-events-none rounded-b-3xl overflow-hidden">
      <motion.div
        style={{ width }}
        className={`h-full ${color}`}
      />
    </div>
  );
};

export default function CalendarSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [events, setEvents] = useState(defaultEvents);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("date", "2026-03-01")
        .lte("date", "2026-03-31")
        .order("date", { ascending: true })
        .limit(4);

      if (!error && data && data.length > 0) {
        const mappedEvents = data.map((item: any, index: number) => {
          let eventDate = new Date();
          if (item.date) {
             const [year, month, day] = item.date.split("-").map(Number);
             eventDate = new Date(year, month - 1, day);
          }
          return {
            id: item.id,
            title: item.title,
            location: item.address || defaultEvents[index % defaultEvents.length].location,
            description: item.description,
            date: eventDate,
            image: item.image || defaultEvents[index % defaultEvents.length].image,
            category: item.type,
            color: defaultEvents[index % defaultEvents.length].color
          };
        });
        setEvents(mappedEvents);
      }
    }
    fetchEvents();
  }, []);

  const handleNext = () => {
    setActiveTab((prev) => (prev + 1) % events.length);
  };

  return (
    <section className="w-full py-12 bg-[var(--foreground)] text-[var(--background)] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4">
          <div className="text-left">
            <h2 className="text-5xl md:text-7xl font-display font-black text-[var(--background)] leading-none tracking-tighter capitalize py-1">
              Upcoming Events
            </h2>
          </div>
          <Link href="/calendar" className="group flex items-center gap-2 text-[var(--background)] font-bold mt-4 md:mt-0 relative pb-1 overflow-hidden">
            <span className="relative z-10">View Full Calendar</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute bottom-[-1] left-[-1] w-full h-[2px] bg-[var(--background)] transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 min-h-[600px]">

          {/* LEFT: Visual Stage (Active Item) */}
          <div className="lg:col-span-7 relative rounded-[2rem] overflow-hidden shadow-sm bg-[#f5f0eb] min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <Image
                  src={events[activeTab].image}
                  alt={events[activeTab].title}
                  fill
                  className="object-cover"
                />
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#264D52]/90 via-[#264D52]/40 to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white leading-[1.1] capitalize tracking-tight drop-shadow-sm">
                    {events[activeTab].title}
                  </h3>

                  <p className="text-white/90 text-[15px] md:text-base mb-6 max-w-xl font-medium leading-relaxed drop-shadow-sm opacity-90 pr-4">
                    {events[activeTab].description}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-white text-sm font-bold tracking-wide drop-shadow-sm uppercase opacity-90">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-[18px] h-[18px] flex-shrink-0" />
                      <span>
                        {events[activeTab].date.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-[18px] h-[18px] flex-shrink-0" />
                      <span className="capitalize normal-case">{events[activeTab].location}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: List Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 h-full pr-1">
            {events.map((event, index) => {
              const isActive = activeTab === index;
              return (
                <div
                  key={event.id}
                  onClick={() => setActiveTab(index)}
                  onMouseEnter={() => isActive && setIsPaused(true)}
                  onMouseLeave={() => isActive && setIsPaused(false)}
                  className={`relative flex items-center w-full p-[22px] transition-all duration-300 cursor-pointer rounded-3xl overflow-hidden  ${isActive
                    ? "bg-white shadow-md transform scale-[1.01]"
                    : "bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    }`}
                >
                  {isActive && (
                    <ProgressBar
                      isPaused={isPaused}
                      onComplete={handleNext}
                      color={event.color}
                    />
                  )}

                  <div className={`flex-shrink-0 flex flex-col items-center justify-center w-[76px] h-[84px] rounded-xl text-white shadow-sm ${event.color}`}>
                    <span className="text-[11px] font-black uppercase tracking-widest mt-1 opacity-90">{event.date.toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-[32px] font-display font-black leading-none mt-0.5 tracking-tighter">{event.date.getDate()}</span>
                  </div>

                  <div className="ml-6 flex-1 pr-2">
                    <h4 className="text-[20px] font-display font-bold text-[#264D52] mb-1.5 leading-tight">
                      {event.title}
                    </h4>

                    <p className="text-[13px] text-[#496A49]/80 leading-[1.6] font-medium line-clamp-2">
                      {event.description}
                    </p>
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