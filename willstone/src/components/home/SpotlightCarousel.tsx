"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/**
 * Resource data structure
 * Each resource contains an image URL, name, description, and theme color
 */
interface Resource {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string; // Theme color for the resource
}

/**
 * Sample resource data with theme colors
 * In production, this would typically be fetched from a database or API
 */
const resources: Resource[] = [
  {
    id: 1,
    name: "Community Center",
    description: "A modern facility offering recreational programs, meeting spaces, and community events for residents of all ages.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&q=80",
    color: "#3b82f6", // Blue
  },
  {
    id: 2,
    name: "Public Library",
    description: "Access to thousands of books, digital resources, study spaces, and educational programs for lifelong learning.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop&q=80",
    color: "#8b5cf6", // Purple
  },
  {
    id: 3,
    name: "Parks & Recreation",
    description: "Beautiful parks, walking trails, sports facilities, and outdoor recreation programs for the whole family.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80",
    color: "#10b981", // Green
  },
];

/**
 * SpotlightCarousel Component
 * 
 * A unique and visually appealing carousel with advanced animations:
 * - Liquid Circle Mask: Circular clip-path expands from center to fill background
 * - Character Staggering: Each letter pops up with back-out spring effect
 * - Skew & Directional Motion: Content skews in the direction of movement
 * - Vertical Navigation: Minimalist vertical lines that grow/shrink on hover
 * - Glow & Depth: Title has text shadow matching theme color
 * 
 * Features:
 * - Displays one main resource at a time with smooth transitions
 * - Each resource card includes an image, name, and description
 * - Auto-advance functionality that cycles through resources every 5 seconds
 * - Pause on hover for better user experience
 * - Professional styling suitable for a government website
 */
export default function SpotlightCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isPaused, setIsPaused] = useState(false);

  /**
   * Navigate to a specific resource index
   * @param newDirection - Direction of navigation (-1 for previous, 1 for next)
   */
  const navigate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(
      (prev) => (prev + newDirection + resources.length) % resources.length
    );
  };

  /**
   * Navigate directly to a specific resource
   * @param index - The index of the resource to navigate to
   */
  const goToResource = (index: number) => {
    const newDirection = index > currentIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentIndex(index);
  };

  /**
   * Auto-advance carousel every 5 seconds
   * Pauses when user hovers over the carousel
   */
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      navigate(1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

  const currentResource = resources[currentIndex];

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative w-full h-[600px] bg-[#050505] rounded-3xl overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Liquid Circle Mask Background - Expands from center */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`liquid-${currentIndex}`}
              custom={direction}
              initial={{ clipPath: "circle(0% at 50% 50%)" }}
              animate={{ clipPath: "circle(150% at 50% 50%)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 opacity-20"
              style={{ backgroundColor: currentResource.color }}
            />
          </AnimatePresence>

          {/* Main content area */}
          <div className="relative z-10 h-full flex items-center justify-center px-8 md:px-16">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ 
                  x: direction * 100, 
                  opacity: 0, 
                  skewX: direction * 10 
                }}
                animate={{ 
                  x: 0, 
                  opacity: 1, 
                  skewX: 0 
                }}
                exit={{ 
                  x: direction * -100, 
                  opacity: 0, 
                  skewX: direction * -10 
                }}
                transition={{ 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 120 
                }}
                className="flex flex-col md:flex-row items-center gap-8 w-full max-w-5xl"
              >
                {/* Resource Image */}
                <div className="flex-shrink-0 w-full md:w-1/2">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image
                      src={currentResource.image}
                      alt={currentResource.name}
                      fill
                      className="object-cover"
                      priority={currentIndex === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.div>
                </div>

                {/* Resource Information */}
                <div className="flex-1 text-center md:text-left">
                  {/* Title with Character Staggering and Glow Effect */}
                  <motion.h2 
                    key={`title-${currentIndex}`}
                    className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 leading-[1.1]"
                    style={{ 
                      textShadow: `0px 0px 40px ${currentResource.color}66`
                    }}
                  >
                    {currentResource.name.split(" ").map((word, wordIndex, words) => {
                      // Calculate the starting character index for this word
                      const startIndex = words.slice(0, wordIndex).reduce((acc, w) => acc + w.length + 1, 0);
                      
                      return (
                        <span key={`word-${wordIndex}`} className="inline-block mr-2">
                          {word.split("").map((char, charIndex) => {
                            const globalIndex = startIndex + charIndex;
                            return (
                              <motion.span
                                key={`${currentIndex}-${wordIndex}-${charIndex}`}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ 
                                  delay: globalIndex * 0.05, 
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20
                                }}
                                className="inline-block"
                              >
                                {char}
                              </motion.span>
                            );
                          })}
                        </span>
                      );
                    })}
                  </motion.h2>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 text-xl max-w-lg leading-relaxed font-sans"
                  >
                    {currentResource.description}
                  </motion.p>

                  {/* Interactive Button with hover "Pulse" */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.1, 
                      boxShadow: `0px 0px 20px ${currentResource.color}` 
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-10 px-10 py-4 border-2 rounded-full font-bold transition-colors font-sans"
                    style={{ 
                      borderColor: currentResource.color, 
                      color: currentResource.color 
                    }}
                  >
                    EXPLORE RESOURCE
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Vertical Navigation - Left Side */}
          <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-center z-20">
            <button 
              onClick={() => navigate(-1)}
              className="group flex flex-col items-center gap-4 text-white/30 hover:text-white transition-all font-sans"
              aria-label="Previous resource"
            >
              <span className="text-xs uppercase tracking-[0.3em] -rotate-90 mb-8">
                Previous
              </span>
              <motion.div 
                className="w-[2px] bg-white/10 group-hover:bg-white transition-all duration-500"
                initial={{ height: 96 }}
                whileHover={{ height: 128 }}
              />
            </button>
          </div>

          {/* Vertical Navigation - Right Side */}
          <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-center z-20">
            <button 
              onClick={() => navigate(1)}
              className="group flex flex-col items-center gap-4 text-white/30 hover:text-white transition-all font-sans"
              aria-label="Next resource"
            >
              <motion.div 
                className="w-[2px] bg-white/10 group-hover:bg-white transition-all duration-500"
                initial={{ height: 96 }}
                whileHover={{ height: 128 }}
              />
              <span className="text-xs uppercase tracking-[0.3em] rotate-90 mt-8">
                Next
              </span>
            </button>
          </div>

          {/* Indicator Dots */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
            {resources.map((_, index) => (
              <button
                key={index}
                onClick={() => goToResource(index)}
                className="focus:outline-none"
                aria-label={`Go to resource ${index + 1}`}
              >
                <motion.div
                  animate={{ 
                    width: index === currentIndex ? 40 : 12,
                    backgroundColor: index === currentIndex 
                      ? resources[index].color 
                      : "#333" 
                  }}
                  className="h-1.5 rounded-full cursor-pointer transition-all duration-300"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
