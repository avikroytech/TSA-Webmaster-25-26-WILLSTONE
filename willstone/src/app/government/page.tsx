"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, X, Target, User, Loader2 } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
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
            {/* Navbar with explicit z-index to stay above modal overlay if needed */}
            <div className="relative z-[110]">
                <Navbar />
            </div>

            <main className="flex-1 relative pt-24 pb-32 overflow-hidden">
                {/* Decorative Background Elements - Subtle */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-brand-light/5 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-muted/5 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8 md:mb-16"
                    >
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-display text-[#264D52] mb-2 leading-none">
                            Government
                        </h1>
                        <div className="w-24 h-1.5 bg-brand-muted mx-auto rounded-full opacity-50" />
                    </motion.div>

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
                                    className="group flex flex-col items-center mb-20 md:mb-24 cursor-pointer"
                                    onClick={() => setSelectedRep(mayor)}
                                >
                                    <div className="relative w-56 h-56 md:w-80 md:h-80 mb-6 md:mb-8 transition-transform duration-500 group-hover:scale-105">
                                        <div className="absolute inset-0 rounded-full border-4 border-brand-muted/20 group-hover:border-brand-muted/40 transition-colors duration-500 shadow-xl" />
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
                                        <h2 className="font-display text-3xl md:text-5xl text-foreground leading-none mb-2">
                                            {mayor.role}
                                        </h2>
                                        <p className="text-sm md:text-base text-brand-muted uppercase tracking-[0.3em] font-bold">
                                            {mayor.name}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Remaining 8 Officials Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-x-16 md:gap-y-20 w-full max-w-6xl">
                                {otherReps.map((rep, index) => (
                                    <motion.div
                                        key={rep.id || index}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                                        className="group flex flex-col items-center cursor-pointer"
                                        onClick={() => setSelectedRep(rep)}
                                    >
                                        <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6 transition-transform duration-500 group-hover:scale-110">
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

                                    <motion.div
                                        className="mt-10 md:mt-14"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <button className="group relative flex items-center gap-4 px-8 md:px-10 py-4 md:py-5 bg-road-paint hover:bg-brand-dark text-[#f5f0eb] rounded-full transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-brand-medium/30 active:scale-95 border border-white/10">
                                            <Sparkles size={20} className="transition-transform duration-700 group-hover:rotate-[360deg] text-white" />
                                            <span className="font-display tracking-tight text-lg md:text-xl transition-transform duration-300 group-hover:scale-105">What do you want to say?</span>
                                        </button>
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

