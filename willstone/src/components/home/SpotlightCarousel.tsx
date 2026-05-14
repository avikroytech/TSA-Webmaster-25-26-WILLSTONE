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
    linkText: "Learn More",
  },
  {
    id: 2,
    title: "Central Willstone Park",
    description: "Beautiful parks, walking trails, sports facilities, and outdoor recreation programs for the whole family.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80",
    linkUrl: "#",
    linkText: "Learn More",
  },
  {
    id: 3,
    title: "Summer Heritage Fest",
    description: "A modern facility offering recreational programs, meeting spaces, and community events for residents of all ages.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&q=80",
    linkUrl: "#",
    linkText: "Learn More",
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
            linkText: "Learn More",
          }))
        );
      }
    }

    fetchSpotlightResources();
  }, []);

  return (
    <section className="city-section bg-[#fbfaf7] text-[#173b3f]">
      <div className="city-container">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="city-kicker">Featured services</p>
            <h2 className="city-heading mt-2 text-4xl md:text-5xl">Resource Spotlight</h2>
          </div>
          <Link href="/resource-hub" className="group inline-flex items-center gap-2 font-black text-[#173b3f]">
            <span>Explore all services</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <SpotlightCarouselGallery items={resources} />
    </section>
  );
}
