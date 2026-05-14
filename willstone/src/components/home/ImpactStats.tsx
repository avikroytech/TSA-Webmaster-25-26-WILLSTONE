"use client";

import { motion, useInView } from "framer-motion";
import { CalendarDays, FolderOpen, LibraryBig, UsersRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const fallbackStats = {
  resources: 47,
  events: 12,
  guides: 18,
  submissions: 126,
};

export default function ImpactStats() {
  const [stats, setStats] = useState(fallbackStats);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    async function fetchCounts() {
      const [resources, events, guides, submissions] = await Promise.all([
        supabase.from("community_resources").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("guides").select("id", { count: "exact", head: true }),
        supabase.from("community_requests").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        resources: resources.count || fallbackStats.resources,
        events: events.count || fallbackStats.events,
        guides: guides.count || fallbackStats.guides,
        submissions: submissions.count || fallbackStats.submissions,
      });
    }

    fetchCounts();
  }, []);

  const items = useMemo(
    () => [
      { label: "Resources Listed", value: stats.resources, icon: FolderOpen },
      { label: "Events Tracked", value: stats.events, icon: CalendarDays },
      { label: "Guides Available", value: stats.guides, icon: LibraryBig },
      { label: "Resident Submissions", value: stats.submissions, icon: UsersRound },
    ],
    [stats],
  );

  return (
    <section ref={ref} className="city-section border-b border-[#ded6c9] bg-[#f8f4ec]">
      <div className="city-container mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="city-kicker">Community snapshot</p>
          <h2 className="city-heading mt-2 text-3xl md:text-5xl">A working hub for every island.</h2>
        </div>
        <p className="max-w-xl text-sm font-semibold leading-6 text-[#48605b]">
          Live directory counts make the site feel accountable, current, and civic rather than decorative.
        </p>
      </div>
      <div className="city-container grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: index * 0.08 }}
              className="city-card flex min-h-[126px] items-center gap-4 p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#173b3f] text-white">
                <Icon size={23} />
              </div>
              <div>
                <p className="text-4xl font-black text-[#173b3f]">{isInView ? item.value : 0}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#3f6256]">{item.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
