"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, Briefcase, Compass } from "lucide-react";

// Helper component for the counting animation
const Counter = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window !== "undefined") {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    }
  };

  return (
    <section
      className="relative w-full min-h-[85vh] flex flex-col justify-center overflow-hidden"
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2D336B]" />
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 w-full px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">

          {/* STACKED TITLE */}
          <div className="w-full mb-8 flex flex-col">
            <h1 className="text-[#FFF2F2] font-display font-black text-5xl md:text-7xl lg:text-9xl leading-[0.9] uppercase tracking-tighter">
              Building Together
            </h1>
            <h2 className="text-[#7886C7] font-display font-black text-3xl md:text-5xl lg:text-7xl leading-[0.9] uppercase tracking-tighter mt-2">
              <span className="text-[#FFF2F2]">the </span> Future of Willstone
            </h2>
          </div>

          {/* SUBTEXT & RESOURCE HUB CTA */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
            <Link href="/resource-hub" className="group flex items-center gap-4">
              <div className="px-10 py-5 bg-[#FFF2F2] text-[#2D336B] font-black uppercase tracking-widest text-sm transform -skew-x-12 group-hover:bg-[#A9B5DF] transition-all shadow-[8px_8px_0px_#7886C7]">
                <div className="transform skew-x-12 flex items-center gap-3">
                  Explore Resource Hub <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* --- ENLARGED TICKERS WITH ANIMATION --- */}
      <div className="relative z-10 w-full mt-20 bg-[#2D336B]/90 backdrop-blur-md border-y-4 border-[#7886C7]">
        <div className="flex flex-wrap justify-center md:justify-around py-10 gap-12 px-4">

          {/* Ticker 1: Residents */}
          <div className="flex items-center gap-6 min-w-[280px]">
            <div className="p-4 bg-[#7886C7]/20 rounded-xl transform -rotate-3">
              <Home className="text-[#FFF2F2]" size={44} />
            </div>
            <div>
              <div className="text-[#FFF2F2] font-black text-5xl leading-none uppercase">
                <Counter end={45} />k
              </div>
              <div className="text-[#A9B5DF] uppercase text-[10px] tracking-[0.4em] font-bold mt-2">Residents</div>
            </div>
          </div>

          {/* Ticker 2: Projects */}
          <div className="flex items-center gap-6 min-w-[280px]">
            <div className="p-4 bg-[#7886C7]/20 rounded-xl transform rotate-3">
              <Briefcase className="text-[#FFF2F2]" size={44} />
            </div>
            <div>
              <div className="text-[#FFF2F2] font-black text-5xl leading-none uppercase">
                <Counter end={13} />
              </div>
              <div className="text-[#A9B5DF] uppercase text-[10px] tracking-[0.4em] font-bold mt-2">Active Projects</div>
            </div>
          </div>

          {/* Ticker 3: Area */}
          <div className="flex items-center gap-6 min-w-[280px]">
            <div className="p-4 bg-[#7886C7]/20 rounded-xl transform -rotate-2">
              <Compass className="text-[#FFF2F2]" size={44} />
            </div>
            <div>
              <div className="text-[#FFF2F2] font-black text-5xl leading-none uppercase">
                <Counter end={18} />
              </div>
              <div className="text-[#A9B5DF] uppercase text-[10px] tracking-[0.4em] font-bold mt-2">Square Miles</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}