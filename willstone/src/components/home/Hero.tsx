"use client";

import {
  ArrowRight,
  CalendarDays,
  Landmark,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const quickLinks = [
  { label: "Find Services", href: "/resource-hub", icon: Search },
  { label: "City Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Explore Map", href: "/map", icon: MapPin },
  { label: "City Government", href: "/government", icon: Landmark },
];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    window.dispatchEvent(
      new CustomEvent("willstone-ai-search", { detail: searchQuery.trim() }),
    );
    setSearchQuery("");
  };

  return (
    <section className="relative overflow-hidden bg-[#173b3f] text-white">
      <Image
        src="/img/city-home.jpg"
        alt="Willstone civic district waterfront and skyline"
        fill
        priority
        className="object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,59,63,0.96),rgba(23,59,63,0.72)_46%,rgba(23,59,63,0.28))]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-112px)] max-w-7xl content-end gap-8 px-5 pb-8 pt-24 sm:px-6 md:gap-12 lg:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.72fr)] lg:items-end lg:pb-14">
        <div className="max-w-4xl">
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(3rem,7vw,6.8rem)] font-black leading-[0.92] tracking-normal">
            Willstone Community Hub
          </h1>
          <p className="city-copy mt-6 max-w-2xl text-white/84 md:text-lg">
            The community hub connects residents across Emerald, Coastal, Central, and
            Talon with local resources, events, guides, transit, and civic
            information.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/resource-hub"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#d5b08c] px-5 font-black text-[#173b3f] transition hover:bg-white"
            >
              Search Services <ArrowRight size={18} />
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/35 px-5 font-bold text-white transition hover:bg-white/10"
            >
              Learn About Willstone
            </Link>
          </div>
        </div>

        <div className="city-card border-white/18 bg-[#fbfaf7]/95 p-4 text-[#173b3f] shadow-2xl md:p-5 lg:mb-2">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#ded6c9] pb-4">
            <div>
              <p className="city-kicker">Ask Beacon</p>
              <h2 className="mt-1 font-display text-2xl font-black">
                What do you need today?
              </h2>
            </div>
            <Sparkles className="text-[#b98d63]" size={26} />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search health clinics, library programs..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearch();
              }}
              className="min-h-13 w-full rounded-lg border border-[#cfc7ba] bg-white py-4 pl-4 pr-14 text-base font-semibold text-[#173b3f] outline-none transition placeholder:text-[#173b3f]/45 focus:border-[#173b3f] focus:ring-4 focus:ring-[#d5b08c]/25"
            />
            <button
              type="button"
              onClick={handleSearch}
              aria-label="Ask Beacon"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-[#173b3f] text-white transition hover:bg-[#3f6256]"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex min-h-20 flex-col justify-between rounded-lg border border-[#ded6c9] bg-[#f8f4ec] p-3 text-sm font-bold leading-snug transition hover:border-[#173b3f] hover:bg-white"
                >
                  <Icon size={18} className="text-[#3f6256]" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
