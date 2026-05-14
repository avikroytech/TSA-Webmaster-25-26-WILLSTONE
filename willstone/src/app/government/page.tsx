"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, Target, Loader2 } from "lucide-react";
import Footer from "@/components/home/Footer";
import SubpageHero from "@/components/layout/SubpageHero";
import { supabase } from "@/utils/supabase/client";

interface Representative {
    id: string;
    name: string;
    role: string;
    email: string;
    mission: string;
    image: string;
}

export default function GovernmentPage() {
    const [allRepresentatives, setAllRepresentatives] = useState<Representative[]>([]);
    const [selectedRep, setSelectedRep] = useState<Representative | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from("government")
                    .select("*");

                if (error) {
                    console.error("Error fetching government data:", error);
                } else if (data) {
                    setAllRepresentatives(data as Representative[]);
                }
            } catch (err) {
                console.error("Unexpected error fetching government data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (!isMounted) return null;

    // Identify the Mayor and the other representatives
    const mayor = allRepresentatives.find(rep => rep.role.toLowerCase() === 'mayor') || allRepresentatives[0];
    const otherReps = allRepresentatives.filter(rep => rep !== mayor).slice(0, 8);

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f0eb] text-foreground font-sans">
            <main className="flex-1 relative pb-20 overflow-hidden bg-[#f8f4ec]">
                <SubpageHero
                    title="Government"
                    eyebrow="City leadership"
                    description="Meet the elected officials and civic departments serving every island in Willstone."
                    image="/img/city-home.jpg"
                />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px]">
                            <Loader2 className="w-12 h-12 text-brand-medium animate-spin mb-4" />
                            <p className="text-brand-muted font-display tracking-widest uppercase text-sm">Loading Officials...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            {/* Mayor Section - Prominent at the top */}
                            {mayor && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="group city-card flex flex-col items-center mb-12 md:mb-16 cursor-pointer p-6"
                                    onClick={() => setSelectedRep(mayor)}
                                >
                                        <div className="relative w-44 h-44 md:w-64 md:h-64 mb-6 md:mb-8 transition-transform duration-500 group-hover:scale-105">
                                        <div className="absolute inset-0 rounded-full border-4 border-[#d5b08c]/35 group-hover:border-[#d5b08c]/60 transition-colors duration-500 shadow-xl" />
                                        <div className="absolute inset-4 rounded-full overflow-hidden bg-brand-medium/5">
                                            <Image
                                                src={mayor.image}
                                                alt={mayor.name}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h2 className="text-3xl md:text-4xl font-black text-[#173b3f] leading-none mb-2">
                                            {mayor.role}
                                        </h2>
                                        <p className="text-sm md:text-base text-brand-muted uppercase tracking-[0.3em] font-bold">
                                            {mayor.name}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Remaining 8 Officials Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-x-12 lg:gap-y-16 w-full max-w-6xl">
                                {otherReps.map((rep, index) => (
                                    <motion.div
                                        key={rep.id || index}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                                        className="group flex min-h-[260px] flex-col items-center justify-start cursor-pointer rounded-2xl bg-white/45 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white"
                                        onClick={() => setSelectedRep(rep)}
                                    >
                                        <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mb-5 transition-transform duration-500 group-hover:scale-105">
                                            <div className="absolute inset-0 rounded-full border-2 border-brand-muted/10 group-hover:border-brand-muted/30 transition-colors duration-500" />
                                            <div className="absolute inset-3 rounded-full overflow-hidden bg-brand-medium/5">
                                                <Image
                                                    src={rep.image}
                                                    alt={rep.name}
                                                    fill
                                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-display text-xl md:text-2xl text-foreground leading-tight mb-1">
                                                {rep.role}
                                            </h3>
                                            <p className="text-[10px] md:text-xs text-brand-muted uppercase tracking-[0.2em] font-bold">
                                                {rep.name}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {allRepresentatives.length === 0 && !isLoading && (
                                <div className="text-center py-20">
                                    <p className="text-brand-muted font-display tracking-widest uppercase">No government data found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {/* Detail Overlay / Panel */}
            <AnimatePresence>
                {selectedRep && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
                    >
                        {/* Darken Overlay - No Blur */}
                        <motion.div
                            className="absolute inset-0 bg-black/70"
                            onClick={() => setSelectedRep(null)}
                        />

                        <motion.div
                            initial={{ scale: 0.95, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 30, opacity: 0 }}
                            className="relative w-full max-w-5xl bg-[#f5f0eb] rounded-[40px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Enhanced Close Button */}
                            <button
                                onClick={() => setSelectedRep(null)}
                                className="absolute top-8 right-8 p-3 rounded-full bg-brand-medium/5 hover:bg-brand-medium text-brand-medium hover:text-[var(--brand-light)] transition-all duration-300 z-10 group active:scale-90"
                                aria-label="Close details"
                            >
                                <X size={28} className="transition-transform group-hover:rotate-90" />
                            </button>

                            <div className="flex flex-col md:flex-row min-h-[500px]">
                                {/* Left: Image with dramatic reveal */}
                                <div className="w-full md:w-5/12 relative min-h-[400px]">
                                    <Image
                                        src={selectedRep.image}
                                        alt={selectedRep.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-medium/40 to-transparent" />
                                </div>

                                {/* Right: Info */}
                                <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <span className="text-brand-muted font-display uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 block font-bold bg-brand-medium/5 py-1 px-3 rounded-full w-fit">
                                            {selectedRep.role}
                                        </span>
                                        <h2 className="text-3xl md:text-5xl lg:text-7xl font-display text-foreground mb-6 md:mb-10 leading-[0.85]">
                                            {selectedRep.name}
                                        </h2>
                                    </motion.div>

                                    <motion.div
                                        className="space-y-6 md:space-y-10"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="flex items-start gap-4 md:gap-6">
                                            <div className="p-3 md:p-4 bg-brand-light/10 rounded-2xl text-brand-medium shrink-0">
                                                <Target size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-[10px] font-display uppercase tracking-widest text-foreground mb-1 md:mb-2 font-bold">Mission</h3>
                                                <p className="text-lg md:text-xl leading-snug text-foreground italic font-medium">
                                                    "{selectedRep.mission}"
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 md:gap-6">
                                            <div className="p-3 md:p-4 bg-brand-muted/10 rounded-2xl text-brand-muted shrink-0">
                                                <Mail size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-[10px] font-display uppercase tracking-widest text-foreground mb-1 md:mb-2 font-bold">Official Email</h3>
                                                <p className="text-lg md:text-xl font-bold text-foreground tracking-tight break-all">
                                                    {selectedRep.email}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>


                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
