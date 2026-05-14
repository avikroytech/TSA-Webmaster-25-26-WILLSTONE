"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Briefcase,
  Car,
  ChevronDown,
  Folder,
  Globe,
  Library,
  Loader2,
  Scale,
  Search,
  Stethoscope,
  Tag,
  Target,
  TreePine,
  Users,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const getCategoryIcon = (category: string) => {
  if (!category) return <Folder size={22} />;
  const cat = category.toLowerCase();

  if (cat.includes("health") || cat.includes("medical"))
    return <Stethoscope size={22} />;
  if (
    cat.includes("library") ||
    cat.includes("book") ||
    cat.includes("education")
  )
    return <Library size={22} />;
  if (cat.includes("community") || cat.includes("center"))
    return <Users size={22} />;
  if (cat.includes("park") || cat.includes("recreation"))
    return <TreePine size={22} />;
  if (
    cat.includes("employment") ||
    cat.includes("job") ||
    cat.includes("career")
  )
    return <Briefcase size={22} />;
  if (cat.includes("legal") || cat.includes("law")) return <Scale size={22} />;
  if (cat.includes("transport") || cat.includes("transit"))
    return <Car size={22} />;
  if (cat.includes("sport") || cat.includes("art"))
    return <Activity size={22} />;
  if (cat.includes("food") || cat.includes("restaurant"))
    return <Utensils size={22} />;
  if (cat === "all") return <Globe size={22} />;

  return <Folder size={22} />;
};

const islandMapping: Record<string, string> = {
  emerald: "Emerald",
  north: "Coastal",
  central: "Central",
  south: "Talon",
};

type ResourceItem = {
  id: string | number;
  title?: string;
  description?: string;
  address?: string;
  category?: string;
  type?: string;
  island?: string;
  images?: string[];
  slug?: string;
};

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "asc", label: "Alphabetical (A to Z)" },
  { value: "desc", label: "Alphabetical (Z to A)" },
] as const;

const extractIsland = (resource: ResourceItem) => {
  const text = `${resource.island || ""}`.toLowerCase();
  if (text.includes("emerald")) return "Emerald";
  if (text.includes("coastal")) return "Coastal";
  if (text.includes("talon")) return "Talon";
  if (text.includes("central")) return "Central";
  return "Central"; // Default mapping if none found
};

export default function ResourceDirectory() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<string>("All Categories");
  const [activeType, setActiveType] = useState<string>("All Resource Types");
  const [activeIsland, setActiveIsland] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"asc" | "desc" | "default">("default");

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const typeDropdownRef = React.useRef<HTMLDivElement>(null);
  const categoryDropdownRef = React.useRef<HTMLDivElement>(null);
  const sortDropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error: resourceError } = await supabase
        .from("community_resources")
        .select("*");

      const resourceData = (data || []) as ResourceItem[];

      if (!resourceError && resourceData) {
        setResources(resourceData);

        const uniqueCats = Array.from(
          new Set(resourceData.map((r) => r.category)),
        ).filter(Boolean) as string[];

        const standardCats = [
          "Public Library",
          "Community Center",
          "Parks & Rec",
          "Health Services",
        ];
        const others = uniqueCats.filter((c) => !standardCats.includes(c));
        const sortedCats = [
          ...standardCats.filter((c) => uniqueCats.includes(c)),
          ...others,
        ];

        setCategories(sortedCats);

        const uniqueTypes = Array.from(
          new Set(resourceData.map((r) => r.type)),
        ).filter(Boolean) as string[];
        setTypes(uniqueTypes.sort());
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTypeDropdownOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredResources = useMemo(() => {
    const filtered = resources.filter((r) => {
      const matchesSearch =
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase()) ||
        r.address?.toLowerCase().includes(search.toLowerCase());

      const matchesCat =
        activeCategory === "All Categories" || r.category === activeCategory;
      const matchesType =
        activeType === "All Resource Types" || r.type === activeType;

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
      return sortBy === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }, [search, activeCategory, activeType, activeIsland, resources, sortBy]);

  const allCategoryOptions = ["All Categories", ...categories];

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("All Categories");
    setActiveType("All Resource Types");
    setActiveIsland(null);
    setSortBy("default");
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent,
    selectOption: () => void,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption();
    }
  };

  const summarize = (text: string | undefined) => {
    if (!text) return "Explore this community resource and its local services.";
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean.length <= 118) return clean;
    return `${clean.slice(0, 115).trim()}...`;
  };

  const renderFilters = (isMobile = false) => (
    <div className={`${isMobile ? "p-8 space-y-10" : "flex flex-col gap-10"}`}>
      <div className="flex flex-col gap-4">
        <h2
          className={`text-3xl font-black ${isMobile ? "text-asphalt" : "text-road-paint"}`}
        >
          {isMobile ? "Filter Resources" : "Filter Resources"}
        </h2>
        <div className="h-px w-full bg-road-paint/20" />
      </div>

      {/* Sort By */}
      <div
        className="flex flex-col gap-2"
        ref={isMobile ? null : sortDropdownRef}
      >
        <h3 className="text-xl font-black font-display text-asphalt tracking-widest uppercase text-xs">
          Sort By
        </h3>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="w-full flex justify-between items-center bg-white border-2 border-road-paint/20 py-4 px-5 rounded-2xl text-base font-bold text-asphalt focus:outline-none transition-all cursor-pointer shadow-sm hover:border-asphalt/50"
          >
            <span className="truncate">
              {sortBy === "default"
                ? "Default"
                : sortBy === "asc"
                  ? "Alphabetical (A to Z)"
                  : "Alphabetical (Z to A)"}
            </span>
            <ChevronDown
              size={20}
              className={`text-asphalt shrink-0 transition-transform duration-300 ${isSortDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {isSortDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                role="listbox"
                aria-label="Sort resources"
                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-road-paint/10 rounded-2xl overflow-hidden shadow-xl z-[60]"
              >
                {sortOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    role="option"
                    aria-selected={sortBy === option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsSortDropdownOpen(false);
                    }}
                    onKeyDown={(event) =>
                      handleOptionKeyDown(event, () => {
                        setSortBy(option.value);
                        setIsSortDropdownOpen(false);
                      })
                    }
                    className={`block w-full px-5 py-4 text-left font-bold transition-colors cursor-pointer border-b border-road-paint/5 last:border-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#d5b08c] ${sortBy === option.value ? "bg-asphalt text-white" : "text-asphalt hover:bg-asphalt/5"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Category */}
      <div
        className="flex flex-col gap-2 items-start w-full"
        ref={isMobile ? null : categoryDropdownRef}
      >
        <h3 className="text-xl font-black font-display text-asphalt tracking-widest uppercase text-xs">
          Category
        </h3>
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded={isCategoryDropdownOpen}
            className="w-full flex justify-between items-center bg-white border-2 border-road-paint/20 py-4 px-5 rounded-2xl text-base font-bold text-asphalt focus:outline-none transition-all cursor-pointer shadow-sm hover:border-asphalt/50"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <motion.div
                key={activeCategory}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-marking shrink-0"
              >
                {getCategoryIcon(
                  activeCategory === "All Categories" ? "all" : activeCategory,
                )}
              </motion.div>
              <span className="truncate">{activeCategory}</span>
            </div>
            <ChevronDown
              size={20}
              className={`text-asphalt shrink-0 transition-transform duration-300 ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {isCategoryDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                role="listbox"
                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-road-paint/10 rounded-2xl overflow-hidden shadow-xl z-50 max-h-80 overflow-y-auto custom-scrollbar"
              >
                {allCategoryOptions.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    role="option"
                    aria-selected={activeCategory === cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsCategoryDropdownOpen(false);
                    }}
                    onKeyDown={(event) =>
                      handleOptionKeyDown(event, () => {
                        setActiveCategory(cat);
                        setIsCategoryDropdownOpen(false);
                      })
                    }
                    className={`flex w-full items-center gap-3 px-5 py-4 text-left font-bold transition-colors cursor-pointer border-b border-road-paint/5 last:border-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#d5b08c] ${activeCategory === cat ? "bg-asphalt text-white" : "text-asphalt hover:bg-asphalt/5"}`}
                  >
                    <div
                      className={`shrink-0 ${activeCategory === cat ? "text-marking" : "text-asphalt/40"}`}
                    >
                      {getCategoryIcon(cat === "All Categories" ? "all" : cat)}
                    </div>
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Resource Type Filter */}
      <div
        className="flex flex-col gap-2 items-start w-full"
        ref={isMobile ? null : typeDropdownRef}
      >
        <h3 className="text-xl font-black font-display text-[var(--brand-medium)] tracking-widest uppercase text-xs">
          Resource Type
        </h3>
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded={isTypeDropdownOpen}
            className="w-full flex justify-between items-center bg-white border-2 border-[var(--brand-medium)]/20 py-4 px-5 rounded-2xl text-base font-bold text-[var(--brand-medium)] focus:outline-none transition-all cursor-pointer shadow-sm hover:border-[var(--brand-medium)]/50"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Tag size={20} className="text-[var(--brand-medium)] shrink-0" />
              <span className="truncate">{activeType}</span>
            </div>
            <ChevronDown
              size={20}
              className={`text-[var(--brand-medium)] shrink-0 transition-transform duration-300 ${isTypeDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {isTypeDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                role="listbox"
                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[var(--brand-medium)]/10 rounded-2xl overflow-hidden shadow-xl z-40 max-h-80 overflow-y-auto custom-scrollbar"
              >
                {["All Resource Types", ...types].map((type) => (
                  <button
                    type="button"
                    key={type}
                    role="option"
                    aria-selected={activeType === type}
                    onClick={() => {
                      setActiveType(type);
                      setIsTypeDropdownOpen(false);
                    }}
                    onKeyDown={(event) =>
                      handleOptionKeyDown(event, () => {
                        setActiveType(type);
                        setIsTypeDropdownOpen(false);
                      })
                    }
                    className={`flex w-full items-center gap-3 px-5 py-4 text-left font-bold transition-colors cursor-pointer border-b border-[var(--brand-medium)]/5 last:border-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#d5b08c] ${activeType === type ? "bg-[var(--brand-medium)] text-white" : "text-[var(--brand-medium)] hover:bg-[var(--brand-medium)]/5"}`}
                  >
                    {type}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Island Location */}
      <div className="flex flex-col gap-5">
        <h3 className="text-xl font-black font-display text-asphalt tracking-widest uppercase text-xs">
          Island Location
        </h3>
        <div className="rounded-xl border border-road-paint/15 bg-road-paint/5 p-4">
          <p className="text-[11px] font-bold text-asphalt uppercase leading-relaxed tracking-wider">
            Click an island to filter by location.
          </p>
        </div>
        <div className="relative w-full aspect-square bg-[var(--brand-medium)] rounded-3xl shadow-sm border border-road-paint/10 overflow-hidden p-6 flex items-center justify-center">
          <IslandImageMap
            activeIsland={activeIsland}
            onIslandClick={setActiveIsland}
          />
        </div>
        {activeIsland && (
          <button
            type="button"
            onClick={() => setActiveIsland(null)}
            className="w-full py-3 bg-marking/10 text-marking rounded-xl text-xs font-black uppercase tracking-widest hover:bg-marking/20 transition-colors"
          >
            Clear Location Filter
          </button>
        )}
      </div>
    </div>
  );

  return (
    <section className="w-full py-12 md:py-16 min-h-screen relative font-sans text-brand-text flex flex-col items-center bg-[#f8f4ec]">
      {/* Mobile Sticky Filter Toggle */}
      <div className="lg:hidden sticky top-[90px] w-full z-[80] px-6 mb-12">
        <motion.button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          layoutId="mobileFilterBar"
          className="w-full bg-white border border-road-paint/10 rounded-2xl p-4 flex items-center justify-between shadow-lg text-asphalt"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-asphalt text-white rounded-lg">
              <Tag size={18} />
            </div>
            <div className="flex flex-col items-start translate-y-[-1px]">
              <span className="text-sm font-bold">Filters</span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isMobileFiltersOpen ? 180 : 0 }}
            className="text-marking"
          >
            <ChevronDown size={24} />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isMobileFiltersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 bg-white border border-road-paint/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[70vh]"
            >
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {renderFilters(true)}
              </div>
              <div className="p-4 bg-asphalt/5 border-t border-road-paint/10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="px-8 py-3 bg-asphalt text-white rounded-full text-sm font-bold tracking-widest hover:scale-105 transition-transform"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full px-6 md:px-12 xl:px-20 relative z-10 w-full max-w-[1800px]">
        {/* Header Title */}
        <div className="flex justify-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="city-heading text-3xl md:text-5xl text-center max-w-5xl"
          >
            Explore Resources
          </motion.h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          {/* Desktop Sidebar (hidden on mobile) */}
          <div className="hidden lg:flex w-full lg:w-[320px] 2xl:w-[380px] shrink-0 flex-col gap-10">
            {renderFilters()}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Search Bar */}
            <div className="mb-12 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Search by name, service, or address"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-[#cfc7ba] py-4 pl-6 pr-14 rounded-lg text-base font-semibold text-[#173b3f] focus:outline-none focus:ring-4 focus:ring-[#d5b08c]/25 focus:border-[#173b3f] transition-all shadow-sm placeholder:text-[#173b3f]/40"
                />
                <Search
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-brand-text/40"
                  size={24}
                />
              </div>
            </div>

            {!loading && (
              <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-road-paint/10 bg-white/70 p-4 text-asphalt shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-black uppercase tracking-[0.1em] text-[#173b3f]">
                  Showing {filteredResources.length} of {resources.length}{" "}
                  resources
                </p>
                {(search ||
                  activeCategory !== "All Categories" ||
                  activeType !== "All Resource Types" ||
                  activeIsland ||
                  sortBy !== "default") && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="min-h-11 rounded-md bg-[#173b3f] px-5 text-sm font-black text-white"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2
                  className="animate-spin text-road-paint mb-4"
                  size={56}
                />
              </div>
            ) : filteredResources.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 md:gap-8"
              >
                <AnimatePresence>
                  {filteredResources.map((resource) => {
                    const resourceIsland = extractIsland(resource);
                    const resourceTitle =
                      resource.title || "Community resource";
                    const resourceSlug = resource.slug || String(resource.id);
                    const resourceCategory =
                      resource.category || "Community Resource";

                    return (
                      <motion.div
                        key={resource.id}
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        exit={{
                          opacity: 0,
                          y: 20,
                          transition: { duration: 0.2 },
                        }}
                        className="city-card overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col group h-full"
                      >
                        <Link
                          href={`/resource-hub/${resourceSlug}`}
                          className="flex flex-col h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-asphalt/30 rounded-[2rem]"
                        >
                          {/* Img Section */}
                          <div className="relative w-full h-40 sm:h-48 md:h-56 bg-gray-100 overflow-hidden shrink-0">
                            {resource.images?.[0] ? (
                              <Image
                                src={resource.images[0]}
                                alt={resourceTitle}
                                fill
                                className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                              />
                            ) : (
                              <div className="w-full h-full bg-road-paint/5 flex items-center justify-center text-road-paint/20">
                                <Target size={48} />
                              </div>
                            )}
                          </div>

                          {/* Text Section */}
                          <div className="p-5 md:p-8 flex flex-col flex-1">
                            <h3 className="text-xl md:text-2xl leading-tight font-black text-[#173b3f] mb-3">
                              {resourceTitle}
                            </h3>
                            <p className="mb-6 text-sm font-bold leading-relaxed text-asphalt/70">
                              {summarize(resource.description)}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto">
                              <div className="flex items-center gap-3">
                                <span className="text-asphalt flex-shrink-0 bg-asphalt/5 p-2 rounded-lg">
                                  {getCategoryIcon(resourceCategory)}
                                </span>
                                <span className="text-sm font-bold text-asphalt tracking-wide truncate">
                                  {resourceCategory}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-marking flex-shrink-0 bg-marking/10 p-2 rounded-lg">
                                  <Target size={22} />
                                </span>
                                <span className="text-sm font-bold text-marking tracking-wide truncate">
                                  {resourceIsland}
                                </span>
                              </div>
                            </div>

                            <div className="mt-6 pt-5 border-t border-[#ded6c9]">
                              <div className="inline-block group-hover:text-[#173b3f] relative text-sm font-black uppercase tracking-[0.1em] text-[#3f6256] transition-colors">
                                Learn More
                                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-[#b98d63] transition-all duration-300 ease-out group-hover:w-full" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="rounded-3xl border border-road-paint/10 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-asphalt/5 text-asphalt">
                  <Search size={28} />
                </div>
                <h3 className="font-display text-3xl text-road-paint">
                  No Resources Found
                </h3>
                <p className="mx-auto mt-3 max-w-lg text-sm font-bold leading-relaxed text-asphalt/70">
                  Try a broader search term, clear the island filter, or submit
                  a new resource for review.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 min-h-11 rounded-full bg-asphalt px-6 text-sm font-black text-white"
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Sub-Component: Island Image Map ────────────────────────────────

function IslandImageMap({
  activeIsland,
  onIslandClick,
}: {
  activeIsland: string | null;
  onIslandClick: (id: string | null) => void;
}) {
  const [hoveredIsland, setHoveredIsland] = useState<string | null>(null);

  const islands = [
    {
      id: "north",
      name: "COASTAL",
      src: "/right.png",
      classes: "top-[26%] left-[52%] w-[32%]",
    },
    {
      id: "emerald",
      name: "EMERALD",
      src: "/left.png",
      classes: "top-[20%] left-[16%] w-[24%]",
    },
    {
      id: "central",
      name: "CENTRAL",
      src: "/small.png",
      classes: "top-[45%] left-[28%] w-[17%]",
    },
    {
      id: "south",
      name: "TALON",
      src: "/bottom.png",
      classes: "top-[52%] left-[18%] w-[64%]",
    },
  ];

  const displayedIslandId = hoveredIsland || activeIsland;
  const displayedIsland = islands.find((i) => i.id === displayedIslandId);

  return (
    <fieldset
      className="relative w-full h-full min-h-[260px] border-0 p-0"
      onMouseLeave={() => setHoveredIsland(null)}
    >
      <legend className="sr-only">Island location filters</legend>
      {/* Top Banner Label */}
      <div className="absolute top-0 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <div
          className={`px-5 py-2 rounded-full font-black text-xs tracking-[0.15em] uppercase transition-all duration-300 ${displayedIsland ? "opacity-100 bg-[#f5f0eb] text-[var(--brand-medium)] shadow-xl translate-y-0" : "opacity-0 -translate-y-2"}`}
        >
          {displayedIsland ? displayedIsland.name : "MAP"}
        </div>
      </div>

      {islands.map((island) => {
        const isActive = activeIsland === island.id;
        const opacityClass = activeIsland
          ? isActive
            ? "opacity-100 scale-105 z-20"
            : "opacity-40 grayscale-[0.6] z-10"
          : "opacity-100 hover:scale-[1.03] hover:z-20";

        return (
          <button
            type="button"
            key={island.id}
            onClick={() => onIslandClick(isActive ? null : island.id)}
            onMouseEnter={() => setHoveredIsland(island.id)}
            aria-label={`Filter by ${island.name} island`}
            aria-pressed={isActive}
            className={`absolute cursor-pointer transition-all duration-300 drop-shadow-lg group flex items-center justify-center ${island.classes} ${opacityClass}`}
          >
            <Image
              src={island.src}
              alt={island.name}
              width={200}
              height={200}
              className="w-full h-auto object-contain drop-shadow"
            />
          </button>
        );
      })}
    </fieldset>
  );
}
