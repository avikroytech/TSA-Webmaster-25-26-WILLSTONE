"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowDown } from "lucide-react";

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window !== "undefined") {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    }
  };

  const handleAISearch = () => {
    if (!searchQuery.trim()) return;
    window.dispatchEvent(
      new CustomEvent("willstone-ai-search", { detail: searchQuery.trim() })
    );
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAISearch();
    }
  };

  return (
    <section
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* --- BACKGROUND LAYER --- */}
      <div
        className="absolute inset-[-5%] z-0 transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${mousePos.x * -2}%, ${mousePos.y * -2}%)`
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000"
          alt="City Skyline"
          fill
          className="object-cover brightness-[0.35] contrast-[1.1]"
          priority
        />
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#264D52]" />
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 w-full px-6 flex flex-col items-center justify-center mt-12">
        <h1
          className={`text-5xl md:text-6xl lg:text-9xl font-display font-medium text-[#f5f0eb] text-center transition-all duration-1000 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
        >
          Willstone
        </h1>
        <h3
          className={`text-2xl md:text-3xl lg:text-4xl mt-15 font-display font-medium text-[#f5f0eb] text-center transition-all duration-1000 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
        >
          Find What You Need with <span className="text-[var(--brand-light)]">Beacon</span>
        </h3>

        <div
          className={`mt-6 relative w-full max-w-lg transition-opacity duration-1000 delay-500 flex flex-col items-center ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Find nonprofits focused on Health & Safety"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-6 pr-14 py-4 rounded-full bg-[#f5f0eb] border-2 border-[#496A49] text-[#1c2b2b] placeholder-[#1c2b2b]/60 focus:outline-none focus:ring-4 focus:ring-[#70AC90]/50 text-lg transition-all"
            />
            <button
              onClick={handleAISearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#264D52] hover:bg-[#70AC90] active:bg-[#496A49] text-[#f5f0eb] rounded-full transition-colors shadow-sm cursor-pointer group"
            >
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          <Link
            href="/resource-hub"
            className="mt-6 group relative font-display text-sm tracking-widest uppercase text-[#f5f0eb] hover:text-white transition-colors"
          >
            Explore Resources
            <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-[#C59F82] transition-all duration-300 ease-out group-hover:w-full" />
          </Link>
        </div>
      </div>

      {/* --- EXPLORE BOTTOM --- */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-[#f5f0eb] transition-opacity duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <div
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="animate-bounce flex flex-col items-center cursor-pointer hover:text-white/80 transition-colors"
        >
          <span className="text-sm tracking-[0.1em] mb-2">Highlights</span>
          <ArrowDown size={24} />
        </div>
      </div>
    </section>
  );
}