"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, LayoutGrid, List as ListIcon, FileText, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client";

export default function ResourceDirectory() {
  const [resources, setResources] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // 1. Fetch Resources
      const { data: resourceData, error: resourceError } = await supabase
        .from("community_resources")
        .select("id, title, category, description, images, address, created_at");

      // 2. Extract unique categories from the database records
      if (!resourceError && resourceData) {
        setResources(resourceData);
        
        const uniqueCats = Array.from(
          new Set(resourceData.map((r: any) => r.category))
        ).filter(Boolean) as string[];
        
        setCategories(["All", ...uniqueCats.sort()]);
      }
      
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch = 
        r.title?.toLowerCase().includes(search.toLowerCase()) || 
        r.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === "All" || r.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [search, activeCategory, resources]);

  return (
    <section className="w-full py-24 bg-[#FFF2F2] min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.2] bg-[url('https://www.transparenttextures.com/patterns/asphalt-light.png')] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-[#2D336B] leading-none"
                >
                    Resource <br/> Directory
                </motion.h2>
            </div>
            
            <div className="flex bg-white p-1 border-2 border-[#2D336B] shadow-[4px_4px_0px_#2D336B]">
                <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-all ${viewMode === "grid" ? "bg-[#2D336B] text-white" : "text-[#2D336B] hover:bg-[#2D336B]/10"}`}
                >
                    <LayoutGrid size={20} />
                </button>
                <button 
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-all ${viewMode === "list" ? "bg-[#2D336B] text-white" : "text-[#2D336B] hover:bg-[#2D336B]/10"}`}
                >
                    <ListIcon size={20} />
                </button>
            </div>
        </div>

        {/* Controls Bar */}
        <div className="sticky top-8 z-40 mb-12 flex flex-col lg:flex-row gap-4 p-3 bg-white border-4 border-[#2D336B] shadow-[8px_8px_0px_#2D336B]">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D336B]/40" size={18} />
            <input 
              type="text"
              placeholder="SEARCH DATABASE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FFF2F2]/50 border-2 border-[#2D336B]/10 py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#2D336B] transition-all placeholder-[#2D336B]/30 text-[#2D336B] font-bold uppercase tracking-wider"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 ${
                  activeCategory === cat 
                  ? "bg-[#2D336B] text-white border-[#2D336B]" 
                  : "bg-transparent text-[#2D336B] border-transparent hover:border-[#2D336B]/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#2D336B] mb-4" size={48} />
            <p className="font-black uppercase tracking-widest text-[#2D336B]">Accessing Archives...</p>
          </div>
        ) : (
          <motion.div layout className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            <AnimatePresence mode="popLayout">
              {filteredResources.map((resource) => {
                // Logic to get the first image from the list
                const firstImage = Array.isArray(resource.images) && resource.images.length > 0 
                  ? resource.images[0] 
                  : null;

                return (
                  <motion.div
                    key={resource.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`group bg-white border-4 border-[#2D336B] hover:shadow-[12px_12px_0px_#7886C7] transition-all duration-300 ${
                        viewMode === "list" ? "flex flex-col md:flex-row items-stretch" : "flex flex-col"
                    }`}
                  >
                    {/* Visual Section */}
                    <div className={`relative bg-[#0A0C1A] overflow-hidden ${
                        viewMode === "grid" ? "w-full h-56" : "w-full md:w-64 h-56 md:h-auto shrink-0"
                    }`}>
                        {firstImage ? (
                            <Image 
                                src={firstImage} 
                                alt={resource.title} 
                                fill 
                                className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <FileText size={48} className="text-[#2D336B]/20" />
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-8 flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7886C7] mb-3">
                            {resource.category}
                        </span>

                        <h3 className="font-black text-[#2D336B] text-2xl uppercase tracking-tighter mb-3 leading-none group-hover:text-[#7886C7] transition-colors">
                            {resource.title}
                        </h3>
                        
                        <p className="text-[#2D336B]/70 text-sm leading-relaxed mb-6 font-medium">
                            {resource.description}
                        </p>

                        {resource.address && (
                          <div className="mt-auto pt-4 border-t-2 border-[#2D336B]/5 text-[10px] font-bold text-[#2D336B]/40 uppercase tracking-widest">
                             {resource.address}
                          </div>
                        )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}