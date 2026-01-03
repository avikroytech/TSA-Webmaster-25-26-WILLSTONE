"use client";
import React, { useRef, useEffect } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue,
  animate
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// --- Sub-Component: Number Counter ---
const Counter = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate(v) {
        // Update the text content directly for performance
        node.textContent = v.toFixed(0) + suffix;
      },
    });

    return () => controls.stop();
  }, [value, suffix]);

  return <span ref={ref} />;
};

// --- Main Hero Component ---
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. Mouse Tracking Logic (Kept from previous version)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const springConfig = { stiffness: 300, damping: 30 };
  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], ["-2%", "2%"]), springConfig);
  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], ["-2%", "2%"]), springConfig);

  const { scrollY } = useScroll();

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-slate-950 flex items-center"
    >
      {/* 2. Dynamic Background Layer */}
      <motion.div 
        style={{ x, y: useTransform(scrollY, [0, 500], [0, 150]) }} 
        className="absolute inset-[-5%] w-[110%] h-[110%] z-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80"
          alt="Willstone Cityscape"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/40 to-transparent" />
      </motion.div>

      {/* 3. Main Content Stage */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 pointer-events-none">
        <div className="max-w-4xl pointer-events-auto">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-sm font-medium mb-6 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Official City Portal
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight"
          >
            Building the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Future of Willstone.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed"
          >
            A more connected, transparent, and resilient community starts here. 
            Access public records, engage in civic planning, and explore local initiatives.
          </motion.p>

          {/* 4. Action Bar: Buttons + Stats Aligned Horizontally */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col lg:flex-row items-start lg:items-center gap-8"
          >
            {/* Button Group */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/resource-hub"
                className="group relative px-8 py-4 bg-white text-slate-950 font-bold rounded-xl overflow-hidden transition-all hover:pr-12 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <span className="relative z-10">Explore Resources</span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-5 transition-all duration-300">
                  →
                </span>
              </Link>

              <Link
                href="/calendar"
                className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-md text-white font-bold rounded-xl border border-slate-700 transition-all hover:border-slate-500"
              >
                View Events
              </Link>
            </div>

            {/* Vertical Divider (Hidden on mobile) */}
            <div className="hidden lg:block w-px h-12 bg-slate-800/80" />

            {/* Stats Group (Counts Up) */}
            <div className="flex gap-10">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white tabular-nums">
                  <Counter value={45} suffix="k+" />
                </span>
                <span className="text-xs uppercase tracking-widest text-slate-400">Residents</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white tabular-nums">
                  <Counter value={12} />
                </span>
                <span className="text-xs uppercase tracking-widest text-slate-400">Projects</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* 5. Bottom Mask - Lowered & Non-Blocking */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-950 to-transparent z-20 pointer-events-none" />
    </section>
  );
}