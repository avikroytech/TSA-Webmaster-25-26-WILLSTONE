"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, LayoutGrid, List as ListIcon, ExternalLink, ShieldCheck, Globe, Zap, BookOpen, Download, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// --- Data ---
const categories = ["All", "Legal", "Infrastructure", "Safety", "Digital"];

const resources = [
  {
    id: 1,
    title: "City Charter & Bylaws",
    desc: "The foundational legal framework and governing documents for Willstone.",
    category: "Legal",
    date: "Jan 12, 2025",
    size: "12MB",
    icon: <ShieldCheck className="text-blue-400" />,
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&h=600&fit=crop&q=80",
    link: "#"
  },
  {
    id: 2,
    title: "Zoning Map 2026",
    desc: "Interactive high-res mapping for urban development boundaries.",
    category: "Infrastructure",
    date: "Feb 04, 2025",
    size: "Interactive",
    icon: <Globe className="text-emerald-400" />,
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop&q=80",
    link: "#"
  },
  {
    id: 3,
    title: "Emergency Protocols",
    desc: "Procedures for city-wide safety events and evacuation routes.",
    category: "Safety",
    date: "Mar 10, 2025",
    size: "4.5MB",
    icon: <Zap className="text-amber-400" />,
    link: "#" // No image for this one to test fallback
  },
  {
    id: 4,
    title: "Transparency Portal",
    desc: "Real-time city spending, budget allocations, and project tracking.",
    category: "Digital",
    date: "Live Data",
    size: "N/A",
    icon: <BookOpen className="text-purple-400" />,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80",
    link: "#"
  },
  {
    id: 5,
    title: "Public Works Request",
    desc: "Report infrastructure issues directly to engineering teams.",
    category: "Infrastructure",
    date: "Form",
    size: "Online",
    icon: <Download className="text-blue-400" />,
    link: "#"
  },
  {
    id: 6,
    title: "Cyber-Security Guide",
    desc: "Best practices for residents and local businesses.",
    category: "Digital",
    date: "Dec 01, 2024",
    size: "2.1MB",
    icon: <ShieldCheck className="text-pink-400" />,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop&q=80",
    link: "#"
  }
];

export default function ResourceDirectory() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                            r.desc.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === "All" || r.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [search, activeCategory]);

  return (
    <section className="w-full py-24 bg-slate-950 text-white min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
                <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-blue-400 font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
                >
                    System Archives
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase text-white"
                >
                    Resource Directory
                </motion.h2>
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mt-6 md:mt-0">
                <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-lg transition-all ${viewMode === "grid" ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                    <LayoutGrid size={20} />
                </button>
                <button 
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-lg transition-all ${viewMode === "list" ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                    <ListIcon size={20} />
                </button>
            </div>
        </div>

        {/* Controls Bar */}
        <div className="sticky top-24 z-40 mb-12 flex flex-col md:flex-row gap-4 p-2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search database..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800/50 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder-slate-600 text-slate-200"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto px-2 scrollbar-hide">
            <Filter size={16} className="text-slate-500 mr-2 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid/List */}
        <motion.div 
            layout 
            className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`group relative bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(37,99,235,0.15)] rounded-2xl overflow-hidden transition-all duration-300 ${
                    viewMode === "list" ? "flex flex-col md:flex-row items-center p-4 gap-6" : "flex flex-col"
                }`}
              >
                {/* Visual Section (Image/Icon) */}
                <div className={`relative overflow-hidden ${
                    viewMode === "grid" 
                        ? "w-full h-48 border-b border-slate-800" 
                        : "w-full md:w-48 h-48 md:h-32 rounded-xl shrink-0"
                }`}>
                    {resource.image ? (
                        <Image 
                            src={resource.image} 
                            alt={resource.title} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-950 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent" />
                            <FileText size={48} className="text-slate-800" />
                        </div>
                    )}
                    
                    {/* Icon overlay */}
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 flex items-center justify-center shadow-lg z-10">
                        {resource.icon}
                    </div>
                </div>

                {/* Content Section */}
                <div className={`flex-1 min-w-0 ${viewMode === "grid" ? "p-6" : "text-left w-full"}`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                            {resource.category}
                        </span>
                        {viewMode === "list" && (
                            <span className="hidden md:inline-block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                Updated: {resource.date}
                            </span>
                        )}
                    </div>

                    <h3 className={`font-bold text-white mb-2 truncate ${viewMode === "grid" ? "text-xl" : "text-2xl"}`}>
                        {resource.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6">
                        {resource.desc}
                    </p>

                    {/* Meta/Action Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 mt-auto">
                         <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <span>{resource.size}</span>
                            {viewMode === "grid" && <span>{resource.date}</span>}
                         </div>

                         <Link 
                            href={resource.link}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-blue-400 transition-colors group/link"
                         >
                            Access
                            <ExternalLink size={14} className="group-hover/link:translate-x-1 transition-transform" />
                         </Link>
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}