"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Footer from "@/components/home/Footer";
import { supabase } from "@/utils/supabase/client";

interface GuideStep {
    title: string;
    content: string;
}

interface Guide {
    slug: string;
    title: string;
    category: string;
    description: string;
    imageUrl: string;
    steps: GuideStep[];
}

export default function IndividualGuidePage() {
    const params = useParams();
    const slug = params.slug as string;

    const [guide, setGuide] = useState<Guide | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGuide() {
            if (!slug) return;

            setLoading(true);
            const { data, error } = await supabase
                .from("guides")
                .select("slug, title, category, description, image, steps")
                .eq("slug", slug)
                .single();

            if (data && !error) {
                setGuide({
                    ...data,
                    imageUrl: Array.isArray(data.image) && data.image.length > 0 ? data.image[0] : "",
                    steps: Array.isArray(data.steps) ? data.steps : [],
                });
            } else {
                console.error("Error fetching guide:", error);
            }
            setLoading(false);
        }
        fetchGuide();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-[#f5f0eb] text-[#1c2b2b]">
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="animate-spin text-[var(--brand-medium)]" size={48} />
                </main>
                <Footer />
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="min-h-screen flex flex-col bg-[#f5f0eb] text-[#1c2b2b]">
                <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-4xl md:text-5xl font-display font-black text-[#1c2b2b] mb-4">Guide Not Found</h1>
                    <p className="text-[#1c2b2b]/60 mb-8 max-w-md">We couldn't find the guide you're looking for. It may have been moved or doesn't exist.</p>
                    <Link href="/guides" className="px-8 py-3 bg-[var(--brand-medium)] text-white rounded-full font-bold hover:bg-[var(--brand-light)] transition-colors">
                        Return to Guides
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f0eb] text-[#1c2b2b]">
            <main className="flex-1 w-full max-w-5xl mx-auto px-6 pt-12 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Back Button */}
                    <Link
                        href="/guides"
                        className="inline-flex mb-6 items-center gap-2 text-asphalt hover:text-road-paint transition-colors font-bold text-md tracking-wide group w-fit"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Guides
                    </Link>

                    {/* Header */}
                    <div className="max-w-4xl">
                        <h1 className="text-5xl md:text-[3.5rem] leading-[1.1] font-display font-black text-[var(--brand-medium)] mb-6">
                            {guide.title}
                        </h1>

                        {guide.description && (
                            <p className="text-xl text-[#1c2b2b]/70 font-sans leading-relaxed max-w-3xl">
                                {guide.description}
                            </p>
                        )}
                    </div>

                    {/* Hero Image */}
                    {guide.imageUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-12 relative w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-sm"
                        >
                            <Image
                                src={guide.imageUrl}
                                alt={guide.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>
                    )}

                    {/* Steps Section */}
                    <div className="mt-20 max-w-4xl">
                        {guide.steps.length > 0 ? (
                            <div className="flex flex-col">
                                {guide.steps.map((step, index) => {
                                    const isLast = index === guide.steps.length - 1;
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                                            className="flex gap-8 relative pb-16"
                                        >
                                            {/* Visual Indicator Column */}
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 rounded-full bg-[var(--brand-dark)] text-white flex items-center justify-center font-display font-black text-xl shrink-0 z-10 shadow-sm">
                                                    {index + 1}
                                                </div>
                                                {/* Connecting Line */}
                                                {!isLast && (
                                                    <div className="absolute top-12 bottom-0 left-6 w-[2px] bg-[var(--brand-medium)]/15 -ml-[1px]" />
                                                )}
                                            </div>

                                            {/* Content Column */}
                                            <div className="pt-2 pb-2">
                                                <h2 className="text-2xl md:text-3xl font-display font-black text-[var(--brand-medium)] mb-4">
                                                    {step.title}
                                                </h2>
                                                <p className="text-[#1c2b2b]/70 text-lg font-sans leading-relaxed">
                                                    {step.content}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-8 bg-white rounded-2xl border border-[#1c2b2b]/5 text-center">
                                <p className="text-[#1c2b2b]/60">This guide doesn't have any specific steps listed yet.</p>
                            </div>
                        )}
                    </div>

                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
