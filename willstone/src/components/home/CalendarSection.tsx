"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calendar as CalendarIcon, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

type CalendarEvent = {
  id: string | number;
  title: string;
  location: string;
  description: string;
  date: Date;
  image: string;
  category: string;
  color: string;
};

// --- Data ---
const defaultEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Annual Willstone City Gala",
    location: "Town Square",
    description:
      "Celebrate our heritage and future at the historic Town Square. Live music, local dining, and community awards.",
    date: new Date(2026, 0, 15), // June 15
    image: "https://images.unsplash.com/photo-1611843467160-25afb8df1074",
    category: "Featured Event",
    color: "bg-[#264D52]", // Dark Teal
  },
  {
    id: 2,
    title: "Winter Farmers Market",
    location: "Community Pavilion",
    description:
      "Local produce, handmade crafts, and hot beverages inside the Community Pavilion.",
    date: new Date(2026, 1, 15), // Jan 15
    image: "https://images.unsplash.com/photo-1606230749281-a3305ca0feac",
    category: "Market",
    color: "bg-[#264D52]", // Dark Teal
  },
  {
    id: 3,
    title: "Town Hall: Green Energy",
    location: "City Council Chambers",
    description:
      "Join the Mayor to discuss the new solar initiatives for public buildings and residential...",
    date: new Date(2026, 1, 20), // Feb 20
    image: "https://images.unsplash.com/photo-1589996448606-27d38c70f3bc",
    category: "Town Hall",
    color: "bg-[#496A49]", // Green
  },
  {
    id: 4,
    title: "Spring Youth Art Fair",
    location: "Central Library Annex",
    description:
      "Showcasing the creative talents of Willstone's K-12 students at the Central Library Annex.",
    date: new Date(2026, 2, 10), // Mar 10
    image:
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&h=600&fit=crop&q=80",
    category: "Art Fair",
    color: "bg-[#C59F82]", // Brown
  },
];

type EventRow = {
  id: string | number;
  title: string;
  address?: string | null;
  description: string;
  date?: string | null;
  image?: string | null;
  type?: string | null;
};

export default function CalendarSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);
  const prefersReducedMotion = useReducedMotion();

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
        const mappedEvents = (data as EventRow[]).map((item, index) => {
          let eventDate = new Date();
          if (item.date) {
            const [year, month, day] = item.date.split("-").map(Number);
            eventDate = new Date(year, month - 1, day);
          }
          return {
            id: item.id,
            title: item.title,
            location:
              item.address ||
              defaultEvents[index % defaultEvents.length].location,
            description: item.description,
            date: eventDate,
            image:
              item.image || defaultEvents[index % defaultEvents.length].image,
            category:
              item.type || defaultEvents[index % defaultEvents.length].category,
            color: defaultEvents[index % defaultEvents.length].color,
          };
        });
        setEvents(mappedEvents);
      }
    }
    fetchEvents();
  }, []);

  return (
    <section className="city-section city-section-deep bg-[#173b3f] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 pb-4 md:flex-row md:items-end md:justify-between">
          <div className="text-left">
            <h2 className="mt-2 font-display text-4xl md:text-5xl font-black text-white leading-none capitalize py-1">
              Upcoming Events
            </h2>
          </div>
          <Link
            href="/calendar"
            className="group flex items-center gap-2 text-white font-semibold mt-4 md:mt-0 relative pb-1 overflow-hidden"
          >
            <span className="relative z-10">View Full Calendar</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute bottom-[-1] left-[-1] w-full h-[2px] bg-[var(--background)] transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)] lg:gap-5">
          {/* LEFT: Visual Stage (Active Item) */}
          <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-[#f5f0eb] shadow-sm lg:min-h-[560px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.45 }}
                className="absolute inset-0"
              >
                <Image
                  src={events[activeTab].image}
                  alt={events[activeTab].title}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#264D52]/90 via-[#264D52]/40 to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 z-20 w-full p-6 text-left md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                >
                  <h3 className="text-3xl md:text-4xl font-black mb-4 text-white leading-[1.1] capitalize tracking-tight drop-shadow-sm">
                    {events[activeTab].title}
                  </h3>

                  <p className="text-white/90 text-base mb-6 max-w-xl font-medium leading-relaxed drop-shadow-sm opacity-90 pr-4">
                    {events[activeTab].description}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-white text-sm font-semibold drop-shadow-sm opacity-90">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-[18px] h-[18px] flex-shrink-0" />
                      <span>
                        {events[activeTab].date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-[18px] h-[18px] flex-shrink-0" />
                      <span className="capitalize normal-case">
                        {events[activeTab].location}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: List Controls */}
          <div className="flex h-full flex-col gap-3 lg:py-1">
            {events.map((event, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  type="button"
                  key={event.id}
                  onClick={() => setActiveTab(index)}
                  aria-pressed={isActive}
                  className={`relative flex w-full cursor-pointer items-center overflow-hidden rounded-xl p-4 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d5b08c] ${isActive
                      ? "bg-[#fbfaf7] shadow-sm"
                      : "bg-white/95 hover:bg-[#fbfaf7]"
                    }`}
                >
                  <div
                    className={`flex h-[76px] w-[68px] flex-shrink-0 flex-col items-center justify-center rounded-lg text-white shadow-sm ${event.color}`}
                  >
                    <span className="text-xs font-bold uppercase tracking-[0.08em] mt-1 opacity-90">
                      {event.date.toLocaleString("default", { month: "short" })}
                    </span>
                    <span className="text-[32px] font-display font-black leading-none mt-0.5">
                      {event.date.getDate()}
                    </span>
                  </div>

                  <div className="ml-5 flex-1 pr-2">
                    <h4 className="font-display text-xl font-black text-[#264D52] mb-1.5 leading-tight">
                      {event.title}
                    </h4>

                    <p className="city-meta text-[#496A49]/80">
                      {event.category} | {event.location}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
