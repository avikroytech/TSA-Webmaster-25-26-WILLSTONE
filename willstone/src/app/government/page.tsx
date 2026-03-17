"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, X, Target, User } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

interface Representative {
    id: string;
    name: string;
    role: string;
    email: string;
    mission: string;
    image: string;
    isLeader?: boolean;
}

const leaders: Representative[] = [
    {
        id: "mayor",
        name: "Thomas Willstone",
        role: "Mayor",
        email: "t.willstone@willstone.gov",
        mission: "To lead our community towards a sustainable and prosperous future through innovation and transparency.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
        isLeader: true,
    },
    {
        id: "secretary",
        name: "Elena Rodriguez",
        role: "Secretary",
        email: "e.rodriguez@willstone.gov",
        mission: "Committed to maintaining organized, efficient, and accessible government records for every citizen.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
        isLeader: true,
    },
    {
        id: "assistant-mayor",
        name: "Marcus Chen",
        role: "Assistant Mayor",
        email: "m.chen@willstone.gov",
        mission: "Empowering local initiatives and ensuring the Mayor's vision reaches every corner of Willstone.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
        isLeader: true,
    },
];

const representatives: Representative[] = Array.from({ length: 15 }).map((_, i) => ({
    id: `rep-${i}`,
    name: [`Sarah Jenkins`, `David Miller`, `Linda Wu`, `James Wilson`, `Maria Garcia`, `Robert Taylor`, `Jennifer Lee`, `Michael Brown`, `Patricia Davis`, `Christopher Martinez`, `Barbara Rodriguez`, `Paul Thompson`, `Elizabeth White`, `Joseph Harris`, `Margaret Clark`][i],
    role: ["Council Member", "Treasurer", "Public Works", "Education", "Safety", "Health", "Zoning", "Recreation", "Arts", "Environment", "Transport", "Housing", "Labor", "Finance", "Justice"][i],
    email: `${[`s.jenkins`, `d.miller`, `l.wu`, `j.wilson`, `m.garcia`, `r.taylor`, `j.lee`, `m.brown`, `p.davis`, `c.martinez`, `b.rodriguez`, `p.thompson`, `e.white`, `j.harris`, `m.clark`][i]}@willstone.gov`,
    mission: "Dedicated servant focused on improving city infrastructure and quality of life for all residents.",
    image: `https://i.pravatar.cc/300?u=rep-${i}`,
}));

export default function GovernmentPage() {
    const [selectedRep, setSelectedRep] = useState<Representative | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

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
                        className="text-center mb-8 md:mb-12"
                    >
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-display text-[#264D52] mb-2 tracking-tighter leading-none">
                            Government
                        </h1>
                        <div className="w-24 h-1.5 bg-brand-muted mx-auto rounded-full opacity-50" />
                    </motion.div>

                    {/* Leaders Section - Hierarchical (Secretary - Mayor - Assistant) */}
                    <div className="relative flex flex-col items-center mb-16 md:mb-20">
                        <div className="flex flex-col md:flex-row items-end justify-center gap-10 md:gap-20">
                            <LeaderCircle
                                rep={leaders[1]}
                                delay={0.2}
                                className="order-2 md:order-1"
                                onClick={() => setSelectedRep(leaders[1])}
                            />

                            <LeaderCircle
                                rep={leaders[0]}
                                isMayor
                                delay={0.1}
                                className="order-1 md:order-2"
                                onClick={() => setSelectedRep(leaders[0])}
                            />

                            <LeaderCircle
                                rep={leaders[2]}
                                delay={0.3}
                                className="order-3 md:order-3"
                                onClick={() => setSelectedRep(leaders[2])}
                            />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mt-12 md:mt-16 mb-2"
                    >
                        <h2 className="text-2xl md:text-3xl font-display text-foreground tracking-widest">
                            Other Representatives
                        </h2>
                    </motion.div>

                    {/* Multi-layered Staggered Semicircle (Parliamentary Seating Style) */}
                    <div className="relative -mt-12 md:-mt-20 flex flex-col items-center scale-90 md:scale-100">
                        <div className="relative w-full max-w-5xl h-[300px] md:h-[500px] flex justify-center">
                            {representatives.map((rep, index) => {
                                const totalReps = representatives.length;
                                // Split into two layers: 9 on outer, 6 on inner for better space utilization
                                const isOuter = index < 9;
                                const layerCount = isOuter ? 9 : 6;
                                const layerIndex = isOuter ? index : index - 9;

                                const angleRange = Math.PI * 0.9; // 162 degrees (slightly less than 180 for better fit)
                                const startAngle = Math.PI * 0.95; // Starting offset
                                const angle = startAngle - (layerIndex / (layerCount - 1)) * angleRange;

                                // Radii for outer vs inner layers
                                const rx = isOuter ? 460 : 280;
                                const ry = isOuter ? 340 : 200;

                                return (
                                    <motion.div
                                        key={rep.id}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            x: Math.cos(angle) * rx,
                                            y: -Math.sin(angle) * ry,
                                        }}
                                        transition={{
                                            delay: 0.4 + index * 0.03,
                                            type: "spring",
                                            stiffness: 80,
                                            damping: 15
                                        }}
                                        className="absolute left-1/2 bottom-0"
                                    >
                                        <div className="md:scale-100 scale-[0.6] origin-center -translate-x-1/2 translate-y-1/2">
                                            <RepresentativeCircle
                                                rep={rep}
                                                onClick={() => setSelectedRep(rep)}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
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
                                        <h2 className="text-3xl md:text-5xl lg:text-7xl font-display text-foreground mb-6 md:mb-10 leading-[0.85] tracking-tighter">
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

function LeaderCircle({
    rep,
    isMayor,
    delay,
    className = "",
    onClick
}: {
    rep: Representative;
    isMayor?: boolean;
    delay: number;
    className?: string;
    onClick: () => void;
}) {
    const size = isMayor ? "w-48 h-48 md:w-72 md:h-72" : "w-40 h-40 md:w-56 md:h-56";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`group flex flex-col items-center gap-6 ${className}`}
            onClick={onClick}
        >
            <div className={`relative ${size} transition-transform duration-500 group-hover:scale-105 cursor-pointer`}>
                <div className="absolute inset-0 rounded-full border-2 border-brand-muted/20 group-hover:border-brand-muted transition-colors duration-500" />
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
                <h3 className="font-display text-2xl md:text-3xl text-foreground tracking-tighter leading-none mb-1">
                    {rep.role}
                </h3>
                <p className="text-xs text-brand-muted uppercase tracking-[0.2em] font-bold">
                    {rep.name}
                </p>
            </div>
        </motion.div>
    );
}

function RepresentativeCircle({
    rep,
    onClick
}: {
    rep: Representative;
    onClick: () => void;
}) {
    return (
        <div
            className="group relative"
            onClick={onClick}
        >
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-brand-medium/10 p-1 transition-all duration-500 group-hover:scale-125 group-hover:border-brand-muted cursor-pointer shadow-sm hover:shadow-xl z-10 bg-[#f5f0eb]">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                    <Image
                        src={rep.image}
                        alt={rep.name}
                        fill
                        className="object-cover transition-all duration-1000 group-hover:scale-125 grayscale-[0.5] group-hover:grayscale-0"
                    />
                </div>
            </div>
        </div>
    );
}
