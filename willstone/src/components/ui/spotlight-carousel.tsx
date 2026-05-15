"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface CarouselItem {
  id: string | number;
  title?: string;
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

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [items.length, autoPlayInterval]);

  if (!items || items.length === 0) return null;

  const getSlotItem = (offset: number) => {
    return items[(currentIndex + offset) % items.length];
  };

  const mainItem = getSlotItem(0);
  const topItem = items.length > 1 ? getSlotItem(1) : null;
  const bottomItem = items.length > 2 ? getSlotItem(2) : topItem; // Fallback if only 2 items

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-4 lg:h-[560px] lg:flex-row lg:gap-5">
        {/* Main Slot */}
        <div
          className={`relative h-[420px] w-full ${items.length > 1 ? "lg:w-[68%]" : "lg:w-full"} lg:h-full`}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`main-${mainItem.id}`}
              layoutId={`card-${mainItem.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 overflow-hidden rounded-2xl shadow-lg group"
            >
              <Image
                src={mainItem.image}
                alt={mainItem.title || "Carousel Image"}
                fill
                className="object-cover"
              />

              {(mainItem.title || mainItem.description || mainItem.linkUrl) && (
                <>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute bottom-0 left-0 w-full p-6 text-white md:p-10"
                  >
                    {mainItem.title && (
                      <h3 className="font-display text-4xl md:text-5xl lg:text-5xl tracking-tight mb-4 drop-shadow-md">
                        {mainItem.title}
                      </h3>
                    )}
                    {mainItem.description && (
                      <p className="mb-6 max-w-2xl font-sans text-lg text-brand-muted md:text-xl">
                        {mainItem.description}
                      </p>
                    )}
                    {mainItem.linkUrl && (
                      <Link
                        href={mainItem.linkUrl}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#264D52] px-5 py-3 font-bold text-white transition-transform hover:-translate-y-1 hover:bg-[#1a383c]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {mainItem.linkText || "Learn More"}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </motion.div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Side Stack */}
        {items.length > 1 && (
          <div className="flex h-[360px] w-full flex-col gap-4 lg:h-full lg:w-[32%] lg:gap-5">
            {/* Top Right Slot */}
            <button
              type="button"
              className="relative h-1/2 w-full cursor-pointer overflow-hidden rounded-2xl text-left"
              onClick={() => setCurrentIndex((currentIndex + 1) % items.length)}
              aria-label={`Show ${topItem?.title || "next spotlight"}`}
            >
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
                      alt={topItem.title || "Carousel Image"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {topItem.title && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="pointer-events-none absolute bottom-0 left-0 p-5"
                        >
                          <h3 className="font-display text-2xl text-white tracking-wide drop-shadow-md group-hover:text-brand-light transition-colors">
                            {topItem.title}
                          </h3>
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Bottom Right Slot */}
            <button
              type="button"
              className="relative h-1/2 w-full cursor-pointer overflow-hidden rounded-2xl text-left"
              onClick={() => setCurrentIndex((currentIndex + 2) % items.length)}
              aria-label={`Show ${bottomItem?.title || "next spotlight"}`}
            >
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
                      alt={bottomItem.title || "Carousel Image"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {bottomItem.title && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="pointer-events-none absolute bottom-0 left-0 p-5"
                        >
                          <h3 className="font-display text-2xl text-white tracking-wide drop-shadow-md group-hover:text-brand-light transition-colors">
                            {bottomItem.title}
                          </h3>
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        )}
      </div>

      {/* Progress Dots */}
      {items.length > 1 && (
        <div className="mt-6 flex w-full items-center justify-center gap-3">
          {items.map((item, i) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 transition-all duration-500 rounded-full ${
                i === currentIndex
                  ? "w-12 bg-[var(--brand-dark)]"
                  : "w-2 bg-[var(--brand-dark)]/50 hover:bg-[var(--brand-dark)]"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
