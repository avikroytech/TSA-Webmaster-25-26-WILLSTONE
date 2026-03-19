"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Library, Users, TreePine, Stethoscope, Briefcase, Scale, Car, Activity, Globe, Folder, Target, Utensils, Sparkles, ChevronDown, Tag } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";

const getCategoryIcon = (category: string) => {
  if (!category) return <Folder size={22} />;
  const cat = category.toLowerCase();

  if (cat.includes("health") || cat.includes("medical")) return <Stethoscope size={22} />;
  if (cat.includes("library") || cat.includes("book") || cat.includes("education")) return <Library size={22} />;
  if (cat.includes("community") || cat.includes("center")) return <Users size={22} />;
  if (cat.includes("park") || cat.includes("recreation")) return <TreePine size={22} />;
  if (cat.includes("employment") || cat.includes("job") || cat.includes("career")) return <Briefcase size={22} />;
  if (cat.includes("legal") || cat.includes("law")) return <Scale size={22} />;
  if (cat.includes("transport") || cat.includes("transit")) return <Car size={22} />;
  if (cat.includes("sport") || cat.includes("art")) return <Activity size={22} />;
  if (cat.includes("food") || cat.includes("restaurant")) return <Utensils size={22} />;
  if (cat === "all") return <Globe size={22} />;

  return <Folder size={22} />;
};

const islandMapping: Record<string, string> = {
  emerald: "Emerald",
  north: "Coastal",
  central: "Central",
  south: "Talon",
};

const extractIsland = (resource: any) => {
  const text = `${resource.island || ""}`.toLowerCase();
  if (text.includes("emerald")) return "Emerald";
  if (text.includes("coastal")) return "Coastal";
  if (text.includes("talon")) return "Talon";
  if (text.includes("central")) return "Central";
  return "Central"; // Default mapping if none found
};

export default function ResourceDirectory() {
  const [resources, setResources] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All Types");
  const [activeType, setActiveType] = useState<string>("All Categories");
  const [activeIsland, setActiveIsland] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"asc" | "desc" | "default">("default");

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const typeDropdownRef = React.useRef<HTMLDivElement>(null);
  const categoryDropdownRef = React.useRef<HTMLDivElement>(null);
  const sortDropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: resourceData, error: resourceError } = await supabase
        .from("community_resources")
        .select("*");

      if (!resourceError && resourceData) {
        setResources(resourceData);

        // Extract unique categories (displayed as Resource Type)
        const uniqueCats = Array.from(
          new Set(resourceData.map((r: any) => r.category))
        ).filter(Boolean) as string[];

        const standardCats = ["Public Library", "Community Center", "Parks & Rec", "Health Services"];
        const others = uniqueCats.filter(c => !standardCats.includes(c));
        const sortedCats = [...standardCats.filter(c => uniqueCats.includes(c)), ...others];

        setCategories(sortedCats);

        // Extract unique types (displayed as Category)
        const uniqueTypes = Array.from(
          new Set(resourceData.map((r: any) => r.type))
        ).filter(Boolean) as string[];
        setTypes(uniqueTypes.sort());
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredResources = useMemo(() => {
    let filtered = resources.filter((r) => {
      const matchesSearch =
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase()) ||
        r.address?.toLowerCase().includes(search.toLowerCase());

      const matchesCat = activeCategory === "All Types" || r.category === activeCategory;
      const matchesType = activeType === "All Categories" || r.type === activeType;

      let matchesIsland = true;
      if (activeIsland) {
        const targetIsland = islandMapping[activeIsland];
        matchesIsland = extractIsland(r) === targetIsland;
      }

      return matchesSearch && matchesCat && matchesType && matchesIsland;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "default") return 0;
      const valA = a.title || "";
      const valB = b.title || "";
      return sortBy === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [search, activeCategory, activeType, activeIsland, resources, sortBy]);

  const allCategoryOptions = ["All Types", ...categories];

  return (
    <section className="w-full py-16 min-h-screen relative font-sans text-brand-text flex flex-col items-center" style={{ background: "var(--background)" }}>
      <div className="w-full px-6 md:px-12 xl:px-20 relative z-10 w-full max-w-[1800px]">

        {/* Header Title */}
        <div className="flex justify-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[6rem] leading-none font-display text-road-paint text-center max-w-5xl drop-shadow-sm"
          >
            Resource Hub
          </motion.h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

          {/* Left Sidebar */}
          <div className="w-full lg:w-[320px] 2xl:w-[380px] shrink-0 flex flex-col gap-10">

            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-black text-road-paint">Filter Resources</h2>
              <div className="h-px w-full bg-road-paint/20" />
            </div>

            {/* Sort By */}
            <div className="flex flex-col gap-2" ref={sortDropdownRef}>
              <h3 className="text-xl font-black font-display text-asphalt tracking-widest">Sort By</h3>
              <div className="relative">
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="w-full flex justify-between items-center bg-white border-2 border-road-paint/20 py-4 px-5 rounded-2xl text-base font-bold text-asphalt focus:outline-none focus:border-asphalt focus:ring-2 focus:ring-asphalt/20 transition-all cursor-pointer shadow-sm hover:border-asphalt/50"
                >
                  <span className="truncate">
                    {sortBy === "default" ? "Default" :
                      sortBy === "asc" ? "Alphabetical (A to Z)" : "Alphabetical (Z to A)"}
                  </span>
                  <ChevronDown size={20} className={`text-asphalt shrink-0 transition-transform duration-300 ${isSortDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isSortDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-road-paint/10 rounded-2xl overflow-hidden shadow-xl z-[60]"
                    >
                      {[
                        { value: "default", label: "Default" },
                        { value: "asc", label: "Alphabetical (A to Z)" },
                        { value: "desc", label: "Alphabetical (Z to A)" }
                      ].map((option) => (
                        <div
                          key={option.value}
                          onClick={() => { setSortBy(option.value as any); setIsSortDropdownOpen(false); }}
                          className={`px-5 py-4 text-asphalt font-bold transition-colors cursor-pointer border-b border-road-paint/5 last:border-0 ${sortBy === option.value ? "bg-asphalt text-white" : "hover:bg-asphalt/5"}`}
                        >
                          {option.label}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Resource Type */}
            <div className="flex flex-col gap-4 items-start w-full" ref={categoryDropdownRef}>
              <h3 className="text-xl font-black font-display text-asphalt tracking-widest">Resource Type</h3>
              <div className="relative w-full">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full flex justify-between items-center bg-white border-2 border-road-paint/20 py-4 px-5 rounded-2xl text-base font-bold text-asphalt focus:outline-none focus:border-asphalt focus:ring-2 focus:ring-asphalt/20 transition-all cursor-pointer shadow-sm hover:border-asphalt/50"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <motion.div
                      key={activeCategory}
                      initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      className="text-marking shrink-0"
                    >
                      {getCategoryIcon(activeCategory === "All Types" ? "all" : activeCategory)}
                    </motion.div>
                    <span className="truncate">{activeCategory}</span>
                  </div>
                  <ChevronDown size={20} className={`text-asphalt shrink-0 transition-transform duration-300 ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isCategoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-road-paint/10 rounded-2xl overflow-hidden shadow-xl z-50 max-h-80 overflow-y-auto custom-scrollbar"
                    >
                      {allCategoryOptions.map((cat) => (
                        <div
                          key={cat}
                          onClick={() => { setActiveCategory(cat); setIsCategoryDropdownOpen(false); }}
                          className={`px-5 py-4 text-asphalt font-bold transition-colors cursor-pointer border-b border-road-paint/5 last:border-0 flex items-center gap-3 ${activeCategory === cat ? "bg-asphalt text-white" : "hover:bg-asphalt/5"}`}
                        >
                          <div className={`shrink-0 ${activeCategory === cat ? "text-marking" : "text-asphalt/40"}`}>
                            {getCategoryIcon(cat === "All Types" ? "all" : cat)}
                          </div>
                          {cat}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Category (type filter) */}
            <div className="flex flex-col gap-4 items-start w-full" ref={typeDropdownRef}>
              <h3 className="text-xl font-black font-display text-[var(--brand-medium)] tracking-widest">Category</h3>
              <div className="relative w-full">
                <button
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                  className="w-full flex justify-between items-center bg-white border-2 border-[var(--brand-medium)]/20 py-4 px-5 rounded-2xl text-base font-bold text-[var(--brand-medium)] focus:outline-none focus:border-[var(--brand-medium)] focus:ring-2 focus:ring-[var(--brand-medium)]/20 transition-all cursor-pointer shadow-sm hover:border-[var(--brand-medium)]/50"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Tag size={20} className="text-[var(--brand-medium)] shrink-0" />
                    <span className="truncate">{activeType}</span>
                  </div>
                  <ChevronDown size={20} className={`text-[var(--brand-medium)] shrink-0 transition-transform duration-300 ${isTypeDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isTypeDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[var(--brand-medium)]/10 rounded-2xl overflow-hidden shadow-xl z-40 max-h-80 overflow-y-auto custom-scrollbar"
                    >
                      {["All Categories", ...types].map((type) => (
                        <div
                          key={type}
                          onClick={() => { setActiveType(type); setIsTypeDropdownOpen(false); }}
                          className={`px-5 py-4 text-[var(--brand-medium)] font-bold transition-colors cursor-pointer border-b border-[var(--brand-medium)]/5 last:border-0 flex items-center gap-3 ${activeType === type ? "bg-[var(--brand-medium)] text-white" : "hover:bg-[var(--brand-medium)]/5"}`}
                        >
                          {type}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Island Location */}
            <div className="flex flex-col gap-5">
              <h3 className="text-xl font-black font-display text-asphalt tracking-widest">Island Location</h3>

              <div className="bg-road-paint/5 border-l-4 border-asphalt p-4 rounded-r-xl">
                <p className="text-sm font-bold text-asphalt leading-relaxed">
                  Click an island to filter by location.<br />Leave blank to show all resources.
                </p>
              </div>

              <div className="relative w-full aspect-square bg-[var(--brand-medium)] rounded-3xl shadow-sm border border-road-paint/10 overflow-hidden p-8 flex items-center justify-center">
                <IslandImageMap activeIsland={activeIsland} onIslandClick={setActiveIsland} />
              </div>
            </div>

          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Search Bar */}
            <div className="mb-12 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border-2 border-road-paint/10 py-5 pl-8 pr-16 rounded-full text-lg font-bold text-brand-text focus:outline-none focus:ring-4 focus:ring-asphalt/10 focus:border-asphalt/50 transition-all shadow-sm placeholder:text-brand-text/30"
                />
                <Search className="absolute right-8 top-1/2 -translate-y-1/2 text-brand-text/40" size={24} />
              </div>

            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="animate-spin text-road-paint mb-4" size={56} />
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
              >
                <AnimatePresence>
                  {filteredResources.map((resource) => {
                    const resourceIsland = extractIsland(resource);

                    return (
                      <motion.div
                        key={resource.id}
                        initial="hidden"
                        animate="visible"
                        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                        exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                        className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-road-paint/10 flex flex-col group h-full"
                      >
                        <Link href={`/resource-hub/${resource.slug}`} className="flex flex-col h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-asphalt/30 rounded-[2rem]">
                          {/* Img Section */}
                          <div className="relative w-full h-56 bg-gray-100 overflow-hidden shrink-0">
                            {resource.images?.[0] ? (
                              <Image src={resource.images[0]} alt={resource.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                            ) : (
                              <div className="w-full h-full bg-road-paint/5 flex items-center justify-center text-road-paint/20">
                                <Target size={48} />
                              </div>
                            )}
                          </div>

                          {/* Text Section */}
                          <div className="p-8 flex flex-col flex-1">
                            <h3 className="text-2xl leading-tight font-display text-road-paint mb-6">
                              {resource.title}
                            </h3>

                            <div className="flex flex-row gap-4 mt-auto">
                              <div className="flex items-center gap-3">
                                <span className="text-asphalt flex-shrink-0 bg-asphalt/5 p-2 rounded-lg">{getCategoryIcon(resource.category)}</span>
                                <span className="text-sm font-bold text-asphalt tracking-wide truncate">{resource.category}</span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-marking flex-shrink-0 bg-marking/10 p-2 rounded-lg"><Target size={22} /></span>
                                <span className="text-sm font-bold text-marking tracking-wide truncate">{resourceIsland}</span>
                              </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-road-paint/10">
                              <div className="inline-block group-hover:text-road-paint relative font-display text-sm tracking-widest uppercase text-asphalt transition-colors">
                                Learn More
                                <span className="absolute -bottom-1.5 left-0 w-0 h-[3px] bg-marking transition-all duration-300 ease-out group-hover:w-full" />
                              </div>
                            </div>
                          </div>
                        </Link>
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

// ─── Sub-Component: Island Image Map ────────────────────────────────

function IslandImageMap({ activeIsland, onIslandClick }: { activeIsland: string | null, onIslandClick: (id: string | null) => void }) {
  const [hoveredIsland, setHoveredIsland] = useState<string | null>(null);

  const islands = [
    { id: "north", name: "COASTAL", src: "/right.png", classes: "top-[26%] left-[52%] w-[32%]" },
    { id: "emerald", name: "EMERALD", src: "/left.png", classes: "top-[20%] left-[16%] w-[24%]" },
    { id: "central", name: "CENTRAL", src: "/small.png", classes: "top-[45%] left-[28%] w-[17%]" },
    { id: "south", name: "TALON", src: "/bottom.png", classes: "top-[52%] left-[18%] w-[64%]" }
  ];

  const displayedIslandId = hoveredIsland || activeIsland;
  const displayedIsland = islands.find(i => i.id === displayedIslandId);

  return (
    <div
      className="relative w-full h-full min-h-[260px]"
      onMouseLeave={() => setHoveredIsland(null)}
    >
      {/* Top Banner Label */}
      <div className="absolute top-0 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <div className={`px-5 py-2 rounded-full font-black text-xs tracking-[0.15em] uppercase transition-all duration-300 ${displayedIsland ? 'opacity-100 bg-[#f5f0eb] text-[var(--brand-medium)] shadow-xl translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          {displayedIsland ? displayedIsland.name : "MAP"}
        </div>
      </div>

      {islands.map((island) => {
        const isActive = activeIsland === island.id;
        const opacityClass = activeIsland ? (isActive ? "opacity-100 scale-105 z-20" : "opacity-40 grayscale-[0.6] z-10") : "opacity-100 hover:scale-[1.03] hover:z-20";

        return (
          <div
            key={island.id}
            onClick={() => onIslandClick(isActive ? null : island.id)}
            onMouseEnter={() => setHoveredIsland(island.id)}
            className={`absolute cursor-pointer transition-all duration-300 drop-shadow-lg group flex items-center justify-center ${island.classes} ${opacityClass}`}
          >
            <Image
              src={island.src}
              alt={island.name}
              width={200}
              height={200}
              className="w-full h-auto object-contain drop-shadow"
            />
          </div>
        );
      })}
    </div>
  );
}