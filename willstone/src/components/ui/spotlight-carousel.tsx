"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface CarouselItem {
  id: string | number;
  title: string;
  description?: string;
  image: string;
  linkUrl?: string;
  linkText?: string;
}

interface SpotlightCarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
}

export function SpotlightCarouselGallery({
  items,
  autoPlayInterval = 6000,
}: SpotlightCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPaused, items.length, autoPlayInterval]);

  if (!items || items.length === 0) return null;

  const getSlotItem = (offset: number) => {
    return items[(currentIndex + offset) % items.length];
  };

  const mainItem = getSlotItem(0);
  const topItem = items.length > 1 ? getSlotItem(1) : null;
  const bottomItem = items.length > 2 ? getSlotItem(2) : topItem; // Fallback if only 2 items

  return (
    <section className="w-full bg-background mt-4 mb-4">
      <div className="max-w-7xl mx-auto">
        {/* Carousel Grid */}
        <div
          className="flex flex-col lg:flex-row gap-6 w-full lg:h-[600px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Slot */}
          <div className="w-full lg:w-[65%] h-[400px] lg:h-full relative">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`main-${mainItem.id}`}
                layoutId={`card-${mainItem.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-2xl overflow-hidden group shadow-lg cursor-pointer"
                onClick={() => setCurrentIndex((currentIndex + 1) % items.length)}
              >
                <Image
                  src={mainItem.image}
                  alt={mainItem.title}
                  fill
                  className="object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute bottom-0 left-0 p-8 md:p-12 w-full text-white"
                >
                  <h3 className="font-display text-4xl md:text-5xl lg:text-5xl tracking-tight mb-4 drop-shadow-md">
                    {mainItem.title}
                  </h3>
                  {mainItem.description && (
                    <p className="font-sans text-lg md:text-xl text-brand-muted max-w-2xl mb-6">
                      {mainItem.description}
                    </p>
                  )}
                  {mainItem.linkUrl && (
                    <Link
                      href={mainItem.linkUrl}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#264D52] hover:bg-[#1a383c] text-white font-bold transition-transform hover:-translate-y-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side Stack */}
          {items.length > 1 && (
            <div className="w-full lg:w-[35%] flex flex-col gap-6 h-[400px] lg:h-full">
              {/* Top Right Slot */}
              <div className="relative w-full h-1/2 rounded-2xl overflow-hidden cursor-pointer" onClick={() => setCurrentIndex((currentIndex + 1) % items.length)}>
                <AnimatePresence mode="popLayout">
                  {topItem && (
                    <motion.div
                      key={`top-${topItem.id}`}
                      layoutId={`card-${topItem.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 group shadow-md"
                    >
                      <Image
                        src={topItem.image}
                        alt={topItem.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute bottom-0 left-0 p-6 pointer-events-none"
                      >
                        <h3 className="font-display text-2xl text-white tracking-wide drop-shadow-md group-hover:text-brand-light transition-colors">
                          {topItem.title}
                        </h3>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Right Slot */}
              <div className="relative w-full h-1/2 rounded-2xl overflow-hidden cursor-pointer" onClick={() => setCurrentIndex((currentIndex + 2) % items.length)}>
                <AnimatePresence mode="popLayout">
                  {bottomItem && (
                    <motion.div
                      key={`bottom-${bottomItem.id}`}
                      layoutId={`card-${bottomItem.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 group shadow-md"
                    >
                      <Image
                        src={bottomItem.image}
                        alt={bottomItem.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute bottom-0 left-0 p-6 pointer-events-none"
                      >
                        <h3 className="font-display text-2xl text-white tracking-wide drop-shadow-md group-hover:text-brand-light transition-colors">
                          {bottomItem.title}
                        </h3>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Progress Dots */}
        {items.length > 1 && (
          <div className="w-full flex justify-center items-center gap-3 mt-8">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 transition-all duration-500 rounded-full ${i === currentIndex
                  ? "w-12 bg-[var(--brand-dark)]"
                  : "w-2 bg-[var(--brand-dark)]/50 hover:bg-[var(--brand-dark)]"
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
