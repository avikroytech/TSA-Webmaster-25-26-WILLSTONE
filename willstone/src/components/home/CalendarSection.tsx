"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/**
 * Event data structure
 * Each event contains an image, date, title, and description
 */
interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  image: string;
}

/**
 * Sample event data
 * In production, this would typically be fetched from a database or API
 */
const events: Event[] = [
  {
    id: 1,
    title: "Town Hall Meeting",
    description: "Join us for the monthly town hall meeting where we discuss community matters and upcoming projects.",
    date: new Date(2025, 0, 15),
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Community Festival",
    description: "Annual community festival featuring local vendors, live music, and family-friendly activities.",
    date: new Date(2025, 1, 20),
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Public Safety Workshop",
    description: "Learn about emergency preparedness and public safety measures for your home and neighborhood.",
    date: new Date(2025, 2, 10),
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&q=80",
  },
];

/**
 * Formats a date object into a readable string format
 * @param date - The date object to format
 * @returns Formatted date string (e.g., "Jan 15")
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats a date object to show the full date
 * @param date - The date object to format
 * @returns Formatted date string (e.g., "January 15, 2025")
 */
function formatFullDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * CalendarSection Component
 * 
 * A two-column layout displaying upcoming events:
 * - Left side: Auto-scrolling image carousel showing event images (maximum 3 events)
 * - Right side: Event cards with date, title, and description, plus a header with link to full calendar
 * 
 * Features:
 * - Automatic image carousel rotation every 4 seconds
 * - Three event cards displayed vertically, each with a prominent date on the left
 * - Professional styling appropriate for a government website
 * - Responsive design that adapts to different screen sizes
 * - Smooth transitions and animations
 */
export default function CalendarSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /**
   * Auto-advance the image carousel every 4 seconds
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % Math.min(events.length, 3));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Limit to maximum 3 events for the carousel
  const carouselEvents = events.slice(0, 3);

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side: Image Carousel */}
          <div className="relative w-full h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
            <AnimatePresence mode="wait">
              {carouselEvents.map(
                (event, index) =>
                  index === currentImageIndex && (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                        <p className="text-white/90">{formatFullDate(event.date)}</p>
                      </div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {carouselEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className="focus:outline-none"
                  aria-label={`Go to image ${index + 1}`}
                >
                  <motion.div
                    animate={{
                      width: index === currentImageIndex ? 24 : 8,
                      backgroundColor:
                        index === currentImageIndex
                          ? "rgba(255, 255, 255, 1)"
                          : "rgba(255, 255, 255, 0.5)",
                    }}
                    className="h-2 rounded-full transition-all duration-300"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Event Cards */}
          <div className="flex flex-col">
            {/* Header with Calendar Link */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-display">
                Events
              </h2>
              <Link
                href="/calendar"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 font-sans"
              >
                View Calendar
              </Link>
            </div>

            {/* Event Cards */}
            <div className="flex flex-col gap-4">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex gap-6">
                    {/* Date Display */}
                    <div className="flex-shrink-0">
                      <div className="flex flex-col items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-lg">
                        <span className="text-2xl font-bold">
                          {event.date.getDate()}
                        </span>
                        <span className="text-xs uppercase tracking-wide">
                          {formatDate(event.date).split(" ")[0]}
                        </span>
                      </div>
                    </div>

                    {/* Event Information */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

