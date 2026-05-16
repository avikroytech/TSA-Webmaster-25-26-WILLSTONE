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
        supabase
          .from("community_resources")
          .select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("guides").select("id", { count: "exact", head: true }),
        supabase
          .from("resource_submissions")
          .select("id", { count: "exact", head: true }),
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
      {
        label: "Resident Submissions",
        value: stats.submissions,
        icon: UsersRound,
      },
    ],
    [stats],
  );

  return (
    <section
      ref={ref}
      className="city-section city-section-tight border-b border-[#ded6c9] bg-[#f8f4ec]"
    >
      <div className="city-container grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:items-end">
        <div className="max-w-2xl">
          <h2 className="city-heading mt-2">A working hub for every island.</h2>
          <p className="mt-5 max-w-xl text-sm font-semibold leading-6 text-[#48605b]">
            Live directory counts make the site feel accountable, current, and
            civic rather than decorative.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isPrimary = index === 0;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ delay: index * 0.08 }}
                className={`city-card flex min-h-[126px] items-center gap-4 p-5 ${
                  isPrimary ? "sm:col-span-3 sm:min-h-[150px] sm:p-6" : ""
                }`}
              >
                <div
                  className={`flex shrink-0 items-center justify-center rounded-lg bg-[#173b3f] text-white ${
                    isPrimary ? "h-14 w-14" : "h-11 w-11"
                  }`}
                >
                  <Icon size={isPrimary ? 28 : 23} />
                </div>
                <div>
                  <p
                    className={`font-black text-[#173b3f] ${
                      isPrimary ? "text-5xl md:text-6xl" : "text-3xl"
                    }`}
                  >
                    {isInView ? item.value : 0}
                  </p>
                  <p className="city-label mt-1 text-[#3f6256]">{item.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
