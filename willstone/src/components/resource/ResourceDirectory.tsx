"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Library, Users, TreePine, Stethoscope, Briefcase, Scale, Car, Activity, Globe, Folder, Target, SlidersHorizontal, Sparkles } from "lucide-react";
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
  if (cat === "all") return <Globe size={22} />;

  return <Folder size={22} />;
};

const islandMapping: Record<string, string> = {
  emerald: "Emerald",
  north: "Coral",
  central: "Central",
  south: "Talon",
};

const extractIsland = (resource: any) => {
  const text = `${resource.address || ""} ${resource.description || ""} ${resource.title || ""}`.toLowerCase();
  if (text.includes("emerald")) return "Emerald";
  if (text.includes("north")) return "Coral";
  if (text.includes("south")) return "Talon";
  if (text.includes("central")) return "Central";
  return "Central"; // Default mapping if none found
};

export default function ResourceDirectory() {
  const [resources, setResources] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All Types");
  const [activeIsland, setActiveIsland] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"asc" | "desc" | "recommended">("recommended");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: resourceData, error: resourceError } = await supabase
        .from("community_resources")
        .select("*");

      if (!resourceError && resourceData) {
        setResources(resourceData);
        const uniqueCats = Array.from(
          new Set(resourceData.map((r: any) => r.category))
        ).filter(Boolean) as string[];

        const standardCats = ["Public Library", "Community Center", "Parks & Rec", "Health Services"];
        const others = uniqueCats.filter(c => !standardCats.includes(c));
        const sortedCats = [...standardCats.filter(c => uniqueCats.includes(c)), ...others];

        setCategories(sortedCats);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredResources = useMemo(() => {
    let filtered = resources.filter((r) => {
      const matchesSearch =
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase()) ||
        r.address?.toLowerCase().includes(search.toLowerCase());

      const matchesCat = activeCategory === "All Types" || r.category === activeCategory;

      let matchesIsland = true;
      if (activeIsland) {
        const targetIsland = islandMapping[activeIsland];
        matchesIsland = extractIsland(r) === targetIsland;
      }

      console.log(matchesSearch, matchesCat, matchesIsland);
      return matchesSearch && matchesCat && matchesIsland;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "recommended") return 0;
      const valA = a.title || "";
      const valB = b.title || "";
      return sortBy === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [search, activeCategory, activeIsland, resources, sortBy]);

  const allCategoryOptions = ["All Types", ...categories];

  return (
    <section className="w-full py-16 min-h-screen relative font-sans text-brand-text flex flex-col items-center" style={{ background: "var(--background)" }}>
      <div className="w-full px-6 md:px-12 xl:px-20 relative z-10 w-full max-w-[1800px]">

        {/* Header Title */}
        <div className="flex justify-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[6rem] leading-none font-display text-road-paint tracking-tighter text-center max-w-5xl drop-shadow-sm"
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
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-black font-display text-asphalt tracking-widest">Sort By</h3>
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full appearance-none bg-white border-2 border-road-paint/20 py-4 px-5 rounded-2xl text-base font-bold text-asphalt focus:outline-none focus:border-asphalt focus:ring-2 focus:ring-asphalt/20 transition-all cursor-pointer shadow-sm hover:border-asphalt/50"
                >
                  <option value="recommended">Recommended</option>
                  <option value="asc">Alphabetical (A to Z)</option>
                  <option value="desc">Alphabetical (Z to A)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-asphalt">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            {/* Resource Type */}
            <div className="flex flex-col gap-4 items-start">
              <h3 className="text-xl font-black font-display text-asphalt tracking-widest">Resource Type</h3>
              <div className="flex flex-col gap-2 w-full">
                {allCategoryOptions.map((cat) => {
                  const isActive = activeCategory === cat;

                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`group flex items-center gap-4 px-5 py-3.5 rounded-2xl border-2 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#C59F82] w-full text-left
                        ${isActive
                          ? "bg-asphalt text-[#f5f0eb] border-asphalt shadow-md"
                          : "bg-transparent border-transparent text-brand-text hover:bg-highlight/15 hover:border-asphalt hover:scale-[1.02] hover:shadow-sm"
                        }
                      `}
                    >
                      <div className={`shrink-0 transition-all duration-200 group-hover:scale-110 ${isActive ? "text-marking" : "text-asphalt group-hover:text-road-paint"}`}>
                        {getCategoryIcon(cat === "All Types" ? "all" : cat)}
                      </div>
                      <span className={`font-semibold tracking-wide transition-all duration-200 ${isActive ? "text-[16px] text-[#f5f0eb]" : "text-[15px] group-hover:text-[16px]"}`}>
                        {cat}
                      </span>
                    </button>
                  );
                })}
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
              <button className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-[var(--brand-medium)] hover:bg-[var(--brand-light)] active:bg-[var(--brand-dark)] text-[var(--background)] rounded-full transition-all duration-300 shadow-sm cursor-pointer group hover:scale-[1.03] hover:shadow-md shrink-0 border border-transparent">
                <Sparkles size={22} className="group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-bold tracking-wide">Search with AI</span>
              </button>
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
    { id: "north", name: "CORAL", src: "/right.png", classes: "top-[26%] left-[52%] w-[32%]" },
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