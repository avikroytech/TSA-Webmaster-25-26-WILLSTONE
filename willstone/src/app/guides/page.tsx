"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ArrowRight, Loader2, Leaf, Bus, Users, Palette, Briefcase, Landmark, Globe } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { supabase } from "@/utils/supabase/client";

const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === "sustainability") return <Leaf size={14} />;
    if (cat === "transit") return <Bus size={14} />;
    if (cat === "community") return <Users size={14} />;
    if (cat === "culture") return <Palette size={14} />;
    if (cat === "business") return <Briefcase size={14} />;
    if (cat === "civic") return <Landmark size={14} />;
    return <Globe size={14} />;
};

const getCategoryStyle = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === "sustainability") return "bg-green-100 text-green-800";
    if (cat === "transit") return "bg-blue-100 text-blue-800";
    if (cat === "community") return "bg-orange-100 text-orange-800";
    if (cat === "culture") return "bg-purple-100 text-purple-800";
    if (cat === "business") return "bg-yellow-100 text-yellow-800";
    if (cat === "civic") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
};

export default function GuidesPage() {
    const [guides, setGuides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoriesList, setCategoriesList] = useState<string[]>(["All Guides"]);
    const [activeCategory, setActiveCategory] = useState("All Guides");

    useEffect(() => {
        async function fetchGuides() {
            setLoading(true);
            const { data, error } = await supabase
                .from("guides")
                .select("slug, title, category, description, image");

            if (data && !error) {
                const processedGuides = data.map((item) => ({
                    ...item,
                    imageUrl: Array.isArray(item.image) && item.image.length > 0 ? item.image[0] : "",
                }));
                setGuides(processedGuides);

                // Extract unique categories
                const uniqueCategories = Array.from(
                    new Set(data.map((item) => item.category).filter(Boolean))
                ).sort() as string[];
                setCategoriesList(["All Guides", ...uniqueCategories]);
            } else {
                console.error("Error fetching guides:", error);
            }
            setLoading(false);
        }
        fetchGuides();
    }, []);

    const filteredGuides = useMemo(() => {
        return guides.filter((guide) => {
            const matchesSearch =
                guide.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                guide.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                guide.category?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCat = activeCategory === "All Guides" || guide.category?.toLowerCase() === activeCategory.toLowerCase();
            return matchesSearch && matchesCat;
        });
    }, [searchQuery, activeCategory, guides]);

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f0eb] text-[#1c2b2b]">
            <Navbar />

            <main className="flex-1 w-full pt-32 pb-24 px-6">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16 mt-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-display font-black text-[var(--brand-medium)] mb-10"
                    >
                        Find a Guide
                    </motion.h1>

                    {/* Search Bar matching image with AI button from Resource Hub */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="w-full max-w-4xl relative flex items-center bg-white rounded-full p-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#1c2b2b]/5 mb-14"
                    >
                        <div className="pl-6 text-[#1c2b2b]/40">
                            <Search size={24} strokeWidth={2} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for neighborhood services, transit, or rules"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent py-4 px-6 text-[#1c2b2b] placeholder:text-[#1c2b2b]/40 focus:outline-none text-lg font-medium"
                        />

                    </motion.div>

                    {/* Category Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-3 w-full max-w-4xl"
                    >
                        {categoriesList.map((cat) => {
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${isActive
                                        ? "bg-[var(--brand-medium)] text-[var(--background)] shadow-md scale-105"
                                        : "bg-white text-[#1c2b2b]/60 hover:bg-white/80 hover:text-[#1c2b2b] shadow-sm hover:shadow"
                                        }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Guides List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-[var(--brand-medium)] mb-4" size={48} />
                    </div>
                ) : filteredGuides.length > 0 ? (
                    <div className="flex flex-col gap-8 w-full mx-auto">
                        <AnimatePresence mode="popLayout">
                            {filteredGuides.map((guide, index) => (
                                <motion.div
                                    key={guide.slug || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#1c2b2b]/10 flex flex-col group h-auto md:h-[300px]"
                                >
                                    <Link href={`/guides/${guide.slug}`} className="flex flex-col md:flex-row h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-medium)]/30">
                                        {/* Left Side: Image */}
                                        <div className="w-full md:w-[38%] h-64 md:h-full relative overflow-hidden bg-gray-100 flex-shrink-0">
                                            {guide.imageUrl ? (
                                                <Image
                                                    src={guide.imageUrl}
                                                    alt={guide.title || "Guide"}
                                                    fill
                                                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[#70AC90]/20 flex items-center justify-center">
                                                    <Search size={32} className="text-[#70AC90]/50" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Side: Content */}
                                        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center relative">
                                            <h2 className="text-2xl md:text-3xl font-display font-black text-[#1c2b2b] mb-4 group-hover:text-[var(--brand-medium)] transition-colors">
                                                {guide.title}
                                            </h2>

                                            <div className={`mb-5 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded w-fit text-[11px] font-black uppercase tracking-widest font-sans ${getCategoryStyle(guide.category || "")}`}>
                                                {getCategoryIcon(guide.category || "")}
                                                {guide.category}
                                            </div>

                                            <p className="text-[#1c2b2b]/60 text-lg font-sans leading-relaxed mb-6 line-clamp-2 md:line-clamp-3">
                                                {guide.description}
                                            </p>

                                            <div className="mt-auto flex justify-end">
                                                <div className="inline-flex items-center group-hover:text-[var(--brand-medium)] relative font-display text-sm tracking-widest uppercase text-[#1c2b2b]/60 transition-colors">
                                                    Read Guide
                                                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--brand-medium)] transition-all duration-300 ease-out group-hover:w-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-display font-black text-[#1c2b2b] mb-2">No guides found</h3>
                        <p className="text-[#1c2b2b]/60">Try adjusting your search or category filter.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
