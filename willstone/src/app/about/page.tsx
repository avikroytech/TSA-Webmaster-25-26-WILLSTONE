"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Anchor, Compass, Mountain, Trees, Waves } from "lucide-react";
import Footer from "@/components/home/Footer";
import SubpageHero from "@/components/layout/SubpageHero";

const islands = [
  {
    name: "Emerald",
    icon: Trees,
    image: "/left.png",
    summary: "A green civic district with libraries, trails, schools, and neighborhood commons.",
  },
  {
    name: "Coastal",
    icon: Waves,
    image: "/right.png",
    summary: "A shoreline district shaped by transit, public markets, and maritime culture.",
  },
  {
    name: "Central",
    icon: Compass,
    image: "/small.png",
    summary: "The civic heart of Willstone, home to city hall, services, and public gathering spaces.",
  },
  {
    name: "Talon",
    icon: Mountain,
    image: "/bottom.png",
    summary: "A southern island of parks, clinics, recreation programs, and community resilience hubs.",
  },
];

const timeline = [
  { year: "1889", title: "Harbor Settlements Unite", text: "Fishing villages and upland farms form the first Willstone council." },
  { year: "1934", title: "Island Bridge Compact", text: "The four islands agree to a shared transit and emergency services plan." },
  { year: "1978", title: "Community Resource Charter", text: "Public departments and nonprofits begin coordinating resident support." },
  { year: "2026", title: "Beacon Hub Launch", text: "Willstone opens a unified directory for services, events, guides, and civic help." },
];

const stats = [
  { label: "Residents", value: "82K" },
  { label: "Islands", value: "4" },
  { label: "Founded", value: "1889" },
  { label: "Public Districts", value: "12" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main>
        <SubpageHero
          title="About Willstone"
          eyebrow="Island community"
          description="Willstone is a fictional four-island archipelago built around public access, civic trust, and neighbor-to-neighbor support."
          image="/img/full_map.png"
        />

        <section className="px-6 py-14">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <p className="font-display text-5xl text-[var(--brand-medium)]">{stat.value}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--brand-dark)]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--brand-dark)]">Explore the archipelago</p>
              <h2 className="mt-3 font-display text-4xl text-[var(--brand-medium)] md:text-6xl">Four Islands, One Community</h2>
              <p className="mt-5 text-lg leading-relaxed text-[var(--foreground)]/75">
                Each island carries its own character, but residents move through one shared support network. The Resource Hub, guides, map, calendar, and Beacon assistant all reinforce that civic system.
              </p>
            </div>

            <div className="relative min-h-[360px] rounded-3xl bg-[var(--brand-medium)] p-6 shadow-lg md:min-h-[520px]">
              {islands.map((island, index) => (
                <motion.div
                  key={island.name}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className={`absolute rounded-2xl p-3 transition hover:z-20 hover:scale-105 ${
                    island.name === "Emerald"
                      ? "left-[8%] top-[18%] w-[28%]"
                      : island.name === "Coastal"
                        ? "right-[7%] top-[18%] w-[38%]"
                        : island.name === "Central"
                          ? "left-[32%] top-[45%] w-[20%]"
                          : "bottom-[10%] left-[15%] w-[68%]"
                  }`}
                >
                  <Image src={island.image} alt={`${island.name} island`} width={360} height={220} className="h-auto w-full drop-shadow-xl" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
            {islands.map((island, index) => {
              const Icon = island.icon;
              return (
                <motion.article
                  key={island.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-medium)] text-[var(--background)]">
                    <Icon size={23} />
                  </div>
                  <h3 className="font-display text-3xl text-[var(--brand-medium)]">{island.name}</h3>
                  <p className="mt-3 text-sm font-bold leading-relaxed text-[var(--foreground)]/70">{island.summary}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 flex items-center gap-3">
              <Anchor className="text-[var(--brand-dark)]" />
              <h2 className="font-display text-4xl text-[var(--brand-medium)] md:text-5xl">Willstone Timeline</h2>
            </div>
            <div className="space-y-5">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="grid gap-4 rounded-2xl border border-[var(--brand-medium)]/10 bg-white p-6 shadow-sm md:grid-cols-[120px_1fr]"
                >
                  <div className="font-display text-3xl text-[var(--brand-dark)]">{item.year}</div>
                  <div>
                    <h3 className="font-display text-2xl text-[var(--brand-medium)]">{item.title}</h3>
                    <p className="mt-2 font-bold leading-relaxed text-[var(--foreground)]/70">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
