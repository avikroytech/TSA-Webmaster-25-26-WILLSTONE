"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SpotlightCarouselGallery, CarouselItem } from "@/components/ui/spotlight-carousel";

const resources: CarouselItem[] = [
  {
    id: 1,
    title: "Your New Public Library",
    description: "A modern hub for learning and connection in the heart of Willstone, featuring over 50,000 titles and creative maker spaces.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop&q=80",
    linkUrl: "#",
    linkText: "Explore the Space",
  },
  {
    id: 2,
    title: "Central Willstone Park",
    description: "Beautiful parks, walking trails, sports facilities, and outdoor recreation programs for the whole family.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80",
    linkUrl: "#",
    linkText: "Explore the Park",
  },
  {
    id: 3,
    title: "Summer Heritage Fest",
    description: "A modern facility offering recreational programs, meeting spaces, and community events for residents of all ages.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&q=80",
    linkUrl: "#",
    linkText: "See the Events",
  },
];

export default function SpotlightCarousel() {
  return (
    <section className="w-full bg-[var(--background)] text-[var(--background)] overflow-hidden relative py-5">
      <div className="max-w-7xl mx-auto px-6 py-3">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
          <h2 className="text-5xl md:text-7xl font-display font-black text-[var(--brand-medium)] leading-none tracking-tighter capitalize py-1">
            City Spotlight
          </h2>
          <Link href="/resource-hub" className="group flex items-center gap-2 text-[var(--foreground)] font-bold mt-4 md:mt-0 relative pb-1 overflow-hidden transition-colors hover:text-white">
            <span className="relative z-10">Explore other Resources</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--background)] transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0 group-hover:bg-white" />
          </Link>
        </div>
      </div>

      <SpotlightCarouselGallery items={resources} />
    </section>
  );
}