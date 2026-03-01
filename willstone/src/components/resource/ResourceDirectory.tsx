"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, LayoutGrid, List as ListIcon, FileText, Loader2, Stethoscope, Utensils, Home, BookOpen, Briefcase, Scale, Car, Heart, Shield, Activity, Globe, Folder } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client";

const getCategoryIcon = (category: string) => {
  if (!category) return <Folder size={20} />;
  const cat = category.toLowerCase();

  if (cat.includes("health") || cat.includes("medical")) return <Stethoscope size={20} />;
  if (cat.includes("food") || cat.includes("dining") || cat.includes("meal")) return <Utensils size={20} />;
  if (cat.includes("housing") || cat.includes("shelter")) return <Home size={20} />;
  if (cat.includes("education") || cat.includes("school") || cat.includes("learning")) return <BookOpen size={20} />;
  if (cat.includes("employment") || cat.includes("job") || cat.includes("career") || cat.includes("business")) return <Briefcase size={20} />;
  if (cat.includes("legal") || cat.includes("law")) return <Scale size={20} />;
  if (cat.includes("transport") || cat.includes("transit")) return <Car size={20} />;
  if (cat.includes("community") || cat.includes("family")) return <Heart size={20} />;
  if (cat.includes("safety") || cat.includes("police") || cat.includes("fire") || cat.includes("emergency")) return <Shield size={20} />;
  if (cat.includes("recreation") || cat.includes("park") || cat.includes("sport") || cat.includes("art")) return <Activity size={20} />;
  if (cat === "all") return <Globe size={20} />;

  return <Folder size={20} />;
};

export default function ResourceDirectory() {
  const [resources, setResources] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"asc" | "desc">("asc");

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
    let filtered = resources.filter((r) => {
      const matchesSearch =
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === "All" || r.category === activeCategory;
      return matchesSearch && matchesCat;
    });

    return filtered.sort((a, b) => {
      const titleA = a.title || "";
      const titleB = b.title || "";
      if (sortBy === "asc") return titleA.localeCompare(titleB);
      return titleB.localeCompare(titleA);
    });
  }, [search, activeCategory, resources, sortBy]);

  return (
    <section className="w-full py-24 bg-[#FFF2F2] min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.2] bg-[url('https://www.transparenttextures.com/patterns/asphalt-light.png')] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8 w-full">
          {/* Spacer for precise centering on large screens */}
          <div className="hidden lg:flex lg:flex-1"></div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-[#2D336B] leading-none whitespace-nowrap text-center lg:flex-none"
          >
            Resource Directory
          </motion.h2>

          <div className="flex w-full lg:flex-1 justify-center lg:justify-end">
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
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left Sidebar: Filters */}
          <div className="w-full lg:w-1/4 flex flex-col gap-8">
            <div className="sticky top-8 flex flex-col gap-8">

              {/* Sort By Filter */}
              <div className="bg-white p-6 border-4 border-[#2D336B] shadow-[8px_8px_0px_#2D336B]">
                <h3 className="font-black text-[#2D336B] text-xl uppercase tracking-tighter mb-4">
                  Sort By
                </h3>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "asc" | "desc")}
                    className="w-full appearance-none bg-[#FFF2F2]/50 border-2 border-[#2D336B]/20 py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-[#2D336B] transition-all text-[#2D336B] font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <option value="asc">A - Z (Ascending)</option>
                    <option value="desc">Z - A (Descending)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2D336B]">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Categories Filter */}
              <div className="bg-white p-6 border-4 border-[#2D336B] shadow-[8px_8px_0px_#2D336B]">
                <h3 className="font-black text-[#2D336B] text-xl uppercase tracking-tighter mb-4">
                  Categories
                </h3>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left px-4 py-3 text-sm font-black uppercase tracking-widest transition-all border-2 flex items-center gap-3 ${activeCategory === cat
                        ? "bg-[#2D336B] text-white border-[#2D336B] translate-x-2"
                        : "bg-transparent text-[#2D336B] border-transparent hover:border-[#2D336B]/20 hover:bg-[#FFF2F2]/50"
                        }`}
                    >
                      {getCategoryIcon(cat)}
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Main Content */}
          <div className="w-full lg:w-3/4 flex flex-col">

            {/* Search Bar - Now above cards */}
            <div className="mb-8 p-3 bg-white border-4 border-[#2D336B] shadow-[8px_8px_0px_#2D336B]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D336B]/40" size={20} />
                <input
                  type="text"
                  placeholder="SEARCH DATABASE..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#FFF2F2]/50 border-2 border-[#2D336B]/10 py-4 pl-12 pr-4 text-base focus:outline-none focus:border-[#2D336B] transition-all placeholder-[#2D336B]/30 text-[#2D336B] font-bold uppercase tracking-wider"
                />
              </div>
            </div>

            {/* Content Display */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white border-4 border-[#2D336B] shadow-[8px_8px_0px_#2D336B]">
                <Loader2 className="animate-spin text-[#2D336B] mb-4" size={48} />
                <p className="font-black uppercase tracking-widest text-[#2D336B]">Accessing Archives...</p>
              </div>
            ) : (
              <motion.div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                <AnimatePresence>
                  {filteredResources.map((resource) => {
                    // Logic to get the first image from the list
                    const firstImage = Array.isArray(resource.images) && resource.images.length > 0
                      ? resource.images[0]
                      : null;

                    return (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`group bg-white border-4 border-[#2D336B] hover:shadow-[12px_12px_0px_#7886C7] transition-all duration-300 ${viewMode === "list" ? "flex flex-col md:flex-row items-stretch" : "flex flex-col"
                          }`}
                      >
                        {/* Visual Section */}
                        <div className={`relative bg-[#0A0C1A] overflow-hidden ${viewMode === "grid" ? "w-full h-56" : "w-full md:w-64 h-56 md:h-auto shrink-0"
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
                          <span className="text-[#7886C7] mb-3 flex items-center" title={resource.category}>
                            {getCategoryIcon(resource.category)}
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
        </div>
      </div>
    </section>
  );
}