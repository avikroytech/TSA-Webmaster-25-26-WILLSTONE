"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SpotlightCarouselGallery, CarouselItem } from "@/components/ui/spotlight-carousel";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const defaultResources: CarouselItem[] = [
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
  const [resources, setResources] = useState<CarouselItem[]>(defaultResources);

  useEffect(() => {
    async function fetchSpotlightResources() {
      const { data, error } = await supabase
        .from("community_resources")
        .select("*")
        .limit(3);


      if (!error && data && data.length > 0) {
        setResources(
          data.map((item, index) => ({
            id: item.id || index + 1,
            title: item.title,
            description: item.description.split(".")[0] + ".",
            image: item.images?.[0] || defaultResources[index]?.image || defaultResources[0].image,
            linkUrl: `/resource-hub/${item.slug}`,
            linkText: "Explore the Space",
          }))
        );
      }
    }

    fetchSpotlightResources();
  }, []);

  return (
    <section className="w-full bg-[var(--background)] text-[var(--background)] overflow-hidden relative py-5">
      <div className="max-w-7xl mx-auto px-6 py-3">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
          <h2 className="text-5xl md:text-7xl font-display font-black text-[var(--brand-medium)] leading-none capitalize py-1">
            Spotlight
          </h2>
          <Link href="/resource-hub" className="group flex items-center gap-2 text-[var(--foreground)] font-bold mt-4 md:mt-0 relative pb-1 overflow-hidden transition-colors">
            <span className="relative z-10">Explore More Resources</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--foreground)] transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0" />
          </Link>
        </div>
      </div>

      <SpotlightCarouselGallery items={resources} />
    </section>
  );
}