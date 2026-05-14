"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Calendar,
  ArrowDown,
  Loader2
} from "lucide-react";
import Footer from "@/components/home/Footer";
import { supabase } from "@/utils/supabase/client";

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });

      if (data && !error) {
        const processedNews = data.map(item => ({
          ...item,
          imageUrl: Array.isArray(item.image) && item.image.length > 0 ? item.image[0] : ""
        }));
        setArticles(processedNews);
      } else {
        console.error("Error fetching news:", error);
      }
      setLoading(false);
    }
    fetchNews();
  }, []);

  const featuredArticle = useMemo(() => articles.length > 0 ? articles[0] : null, [articles]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window !== "undefined") {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    }
  };

  const filteredArticles = useMemo(() => {
    if (articles.length === 0) return [];
    const restArticles = articles.slice(1);
    return restArticles.filter(article => {
      const matchesSearch = article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, articles]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0eb] text-[#1c2b2b]">
      <main className="flex-1">
        {/* Full-Viewport Hero Section with Mouse Tracking */}
        {featuredArticle && (
          <section
            className="w-full relative min-h-[620px] overflow-hidden group bg-[#173b3f]"
            onMouseMove={handleMouseMove}
          >
            <div
              className="absolute inset-[-5%] transition-transform duration-200 ease-out"
              style={{
                transform: `translate(${mousePos.x * -2}%, ${mousePos.y * -2}%)`
              }}
            >
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {featuredArticle.imageUrl ? (
                  <Image
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover brightness-[0.7] group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-300 brightness-[0.7] group-hover:scale-105 transition-transform duration-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c2b2b]/95 via-[#1c2b2b]/40 to-[#1c2b2b]/20" />
              </motion.div>
            </div>

            <div className="relative min-h-[620px] container mx-auto px-6 flex flex-col justify-end pb-24 md:pb-28">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="w-full"
              >
                <p className="city-kicker text-[#d5b08c] mb-3">City news</p>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-[1.02] max-w-5xl">
                  {featuredArticle.title}
                </h1>
                <p className="text-white/80 text-lg font-bold uppercase tracking-widest mb-6">
                  {formatDate(featuredArticle.date)}
                </p>
                <p className="text-lg md:text-xl text-white/88 mb-8 font-sans leading-relaxed line-clamp-3 max-w-4xl">
                  {featuredArticle.description}
                </p>
                <Link
                  href={`/news/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#d5b08c] hover:bg-white text-[#173b3f] font-black rounded-md transition-all group/btn shadow-xl"
                >
                  Read Full Story
                  <ArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Scroll Down Label */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/80 z-20">
              <div
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="animate-bounce flex flex-col items-center cursor-pointer hover:text-white transition-colors"
              >
                <span className="text-sm tracking-[0.1em] mb-3">More News</span>
                <ArrowDown size={20} strokeWidth={3} />
              </div>
            </div>
          </section>
        )}

        {/* Content Section */}
        <div className="w-full flex flex-col items-center">

          {/* Curved Full-Width Search Bar */}
          <div className="w-full px-6 py-8 bg-[#fbfaf7] border-b border-[#ded6c9]">
            <div className="relative w-full group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#264D52]/60 z-10">
                <Search size={24} strokeWidth={2} />
              </div>
              <input
                type="text"
                placeholder="Search news, updates, and announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#cfc7ba] rounded-lg py-4 pl-16 pr-8 focus:outline-none focus:border-[#173b3f] focus:ring-4 focus:ring-[#d5b08c]/25 transition-all text-[#173b3f] placeholder:text-[#173b3f]/40 text-base font-semibold shadow-sm"
              />
            </div>
          </div>

          <div className="container mx-auto px-6">
            {/* News Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="animate-spin text-[#70AC90] mb-4" size={56} />
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnimatePresence mode="popLayout">
                  {filteredArticles.map((article) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="city-card overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
                    >
                      <Link href={`/news/${article.slug}`} className="flex flex-col h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-asphalt/30 rounded-[2rem]">
                        {/* Img Section */}
                        <div className="relative h-60 overflow-hidden bg-gray-100 shrink-0">
                          {article.imageUrl ? (
                            <Image
                              src={article.imageUrl}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                            />
                          ) : (
                            <div className="w-full h-full bg-road-paint/5 flex items-center justify-center text-road-paint/20">
                              <Search size={32} />
                            </div>
                          )}
                        </div>

                        {/* Text Section */}
                        <div className="p-8 flex flex-col flex-1">
                          <h3 className="text-2xl leading-tight font-display text-road-paint mb-4 group-hover:text-road-paint transition-colors line-clamp-2">
                            {article.title}
                          </h3>

                          <div className="flex items-center gap-2 text-asphalt/60 mb-6">
                            <Calendar size={16} className="text-marking" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                              {formatDate(article.date)}
                            </span>
                          </div>

                          <p className="text-base text-asphalt/70 font-sans leading-relaxed mb-8 line-clamp-3">
                            {article.description}
                          </p>

                          <div className="mt-auto pt-6 border-t border-road-paint/10">
                            <div className="inline-block group-hover:text-road-paint relative font-display text-sm tracking-widest uppercase text-asphalt transition-colors">
                              Read More
                              <span className="absolute -bottom-1.5 left-0 w-0 h-[3px] bg-marking transition-all duration-300 ease-out group-hover:w-full" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-24 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#70AC90]/10 text-[#70AC90] mb-6">
                  <Search size={32} />
                </div>
                <h3 className="text-2xl font-display font-black text-[#1c2b2b] mb-2">No Articles Found</h3>
                <p className="text-[#1c2b2b]/60 max-w-md mx-auto">
                  We couldn't find any news articles matching your current search. Try a different term.
                </p>
              </div>
            )}
          </div>
          {/* Substantial Margin at Bottom */}
          <div className="h-32 w-full" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
