"use client";

import {
  Building2,
  CalendarDays,
  Landmark,
  Loader2,
  Mail,
  MapPin,
  Target,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { type ComponentType, useEffect, useMemo, useState } from "react";
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

const GOVERNMENT_CUES: Array<{
  title: string;
  text: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}> = [
  {
    title: "Public meetings",
    text: "Agendas, hearings, and council sessions stay visible to residents.",
    icon: CalendarDays,
  },
  {
    title: "Island service desks",
    text: "Each district has a clear route back to city departments.",
    icon: MapPin,
  },
  {
    title: "Department accountability",
    text: "Officials are listed by role, mission, and official contact path.",
    icon: Building2,
  },
];

const getRepImage = (representative: Representative) =>
  representative.image || "/logo2.png";

const summarizeMission = (mission: string) => {
  const clean = mission.replace(/\s+/g, " ").trim();
  if (clean.length <= 92) return clean;

  const clipped = clean.slice(0, 89);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 56 ? lastSpace : 89).trim()}...`;
};

export default function GovernmentPage() {
  const [allRepresentatives, setAllRepresentatives] = useState<
    Representative[]
  >([]);
  const [selectedRep, setSelectedRep] = useState<Representative | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("government").select("*");

        if (error) {
          setLoadError("Government data could not be loaded.");
          return;
        }

        if (data) {
          setAllRepresentatives(data as Representative[]);
        }
      } catch {
        setLoadError("Government data could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const mayor = useMemo(
    () =>
      allRepresentatives.find(
        (representative) => representative.role.toLowerCase() === "mayor",
      ) || allRepresentatives[0],
    [allRepresentatives],
  );

  const otherReps = useMemo(
    () =>
      allRepresentatives
        .filter((representative) => representative !== mayor)
        .slice(0, 8),
    [allRepresentatives, mayor],
  );

  useEffect(() => {
    if (!selectedRep) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedRep(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedRep]);

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f4ec] text-[#173b3f]">
      <main className="flex-1 bg-[#f8f4ec]">
        <SubpageHero
          title="Government"
          eyebrow="City leadership"
          description="Meet the elected officials and civic departments serving every island in Willstone."
          image="/img/city-home.jpg"
        />

        <section className="city-section city-section-tight">
          <div className="city-container">
            {isLoading ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] text-center shadow-sm">
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#3f6256]" />
                <p className="city-kicker text-[#48605b]">Loading officials</p>
              </div>
            ) : allRepresentatives.length === 0 ? (
              <div className="rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] p-8 text-center shadow-sm">
                <p className="city-kicker text-[#48605b]">No records found</p>
                <h2 className="mt-2 font-display text-3xl font-black text-[#173b3f]">
                  Government directory unavailable
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-base font-semibold leading-relaxed text-[#48605b]">
                  {loadError ||
                    "The official directory is not available right now. Please check back soon."}
                </p>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                <div className="grid gap-8">
                  {mayor && (
                    <button
                      type="button"
                      onClick={() => setSelectedRep(mayor)}
                      className="group grid overflow-hidden rounded-3xl border border-[#ded6c9] bg-[#fbfaf7] text-left shadow-[0_18px_46px_rgba(23,59,63,0.08)] transition-[border-color,box-shadow,transform] duration-200 ease-out hover:border-[#b98d63]/45 hover:shadow-[0_22px_54px_rgba(23,59,63,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b98d63] motion-safe:hover:-translate-y-0.5 lg:grid-cols-[0.82fr_1fr]"
                    >
                      <div className="relative min-h-[320px] overflow-hidden bg-[#173b3f] sm:min-h-[380px] lg:min-h-full">
                        <Image
                          src={getRepImage(mayor)}
                          alt={mayor.name}
                          fill
                          priority
                          sizes="(min-width: 1024px) 42vw, 100vw"
                          className="object-cover grayscale-[0.18] transition-transform duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-[#173b3f]/20" />
                        <div className="absolute bottom-5 left-5 rounded-xl border border-[#d5b08c]/35 bg-[#173b3f]/88 px-4 py-3 text-[#f8f4ec] shadow-[0_18px_45px_rgba(20,35,35,0.24)]">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#d5b08c]">
                            Office of the Mayor
                          </p>
                          <p className="mt-1 text-sm font-bold">
                            Citywide executive office
                          </p>
                        </div>
                      </div>

                      <div className="flex min-h-[360px] flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
                        <div>
                          <p className="city-kicker text-[#48605b]">
                            Lead official
                          </p>
                          <h2 className="mt-3 font-display text-4xl font-black leading-none text-[#173b3f] sm:text-5xl">
                            {mayor.role}
                          </h2>
                          <p className="mt-3 text-lg font-black uppercase tracking-[0.18em] text-[#3f6256]">
                            {mayor.name}
                          </p>
                        </div>

                        <p className="max-w-2xl text-lg font-semibold leading-relaxed text-[#48605b]">
                          {mayor.mission}
                        </p>

                        <div className="grid gap-3 border-t border-[#ded6c9] pt-5 sm:grid-cols-2">
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#48605b]">
                              Contact
                            </p>
                            <p className="mt-1 break-all text-sm font-bold text-[#173b3f]">
                              {mayor.email}
                            </p>
                          </div>
                          <div className="flex items-end justify-start sm:justify-end">
                            <span className="inline-flex min-h-11 items-center rounded-md bg-[#b98d63] px-4 text-sm font-black text-[#fbfaf7]">
                              View profile
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )}

                  <section
                    aria-labelledby="council-roster"
                    className="grid gap-5"
                  >
                    <div className="flex flex-col gap-3 border-b border-[#ded6c9] pb-5 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="city-kicker text-[#48605b]">
                          Council roster
                        </p>
                        <h2
                          id="council-roster"
                          className="mt-2 font-display text-3xl font-black text-[#173b3f] md:text-4xl"
                        >
                          Representatives
                        </h2>
                      </div>
                      <p className="max-w-xl text-sm font-semibold leading-relaxed text-[#48605b]">
                        Officials are grouped as a working directory, with quick
                        context before opening a full civic profile.
                      </p>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5">
                      {otherReps.map((representative) => (
                        <button
                          type="button"
                          key={representative.id || representative.email}
                          onClick={() => setSelectedRep(representative)}
                          className="group relative flex min-h-[292px] flex-col overflow-hidden rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] text-left shadow-sm transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out hover:border-[#b98d63]/70 hover:bg-[#fdfbf6] hover:shadow-[0_24px_52px_rgba(23,59,63,0.16)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#b98d63] motion-safe:hover:-translate-y-2"
                        >
                          <div className="relative h-36 w-full shrink-0 overflow-hidden bg-[#173b3f]/10">
                            <Image
                              src={getRepImage(representative)}
                              alt={representative.name}
                              fill
                              sizes="(min-width: 1280px) 19vw, (min-width: 768px) 42vw, 100vw"
                              className="object-cover grayscale-[0.25] transition-transform duration-700 ease-out group-hover:scale-[1.08] group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-[#173b3f]/10 transition-colors duration-300 group-hover:bg-[#173b3f]/0" />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col p-5">
                            <p className="break-words text-[11px] font-black uppercase tracking-[0.14em] text-[#3f6256]">
                              {representative.role}
                            </p>
                            <h3 className="mt-2 break-words font-display text-[1.35rem] font-black leading-tight text-[#173b3f]">
                              {representative.name}
                            </h3>
                            <p className="mt-3 text-sm font-semibold leading-relaxed text-[#48605b]">
                              {summarizeMission(representative.mission)}
                            </p>
                            <span className="mt-auto inline-flex translate-y-1 items-center pt-5 text-sm font-black text-[#b98d63] opacity-75 transition-[color,opacity,transform] duration-300 group-hover:translate-y-0 group-hover:text-[#173b3f] group-hover:opacity-100">
                              View civic profile
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                <aside className="grid gap-4 lg:sticky lg:top-[128px]">
                  <div className="rounded-2xl bg-[#173b3f] p-5 text-[#f8f4ec] shadow-[0_18px_45px_rgba(23,59,63,0.16)]">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#d5b08c]">
                      Government at a glance
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-black leading-tight">
                      Public service, organized by office.
                    </h2>
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#d5b08c]/20 pt-5">
                      <div>
                        <p className="font-display text-3xl font-black">
                          {allRepresentatives.length}
                        </p>
                        <p className="mt-1 text-xs font-bold text-[#f8f4ec]/75">
                          listed officials
                        </p>
                      </div>
                      <div>
                        <p className="font-display text-3xl font-black">4</p>
                        <p className="mt-1 text-xs font-bold text-[#f8f4ec]/75">
                          island districts
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {GOVERNMENT_CUES.map((cue) => {
                      const Icon = cue.icon;
                      return (
                        <div
                          key={cue.title}
                          className="rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] p-4 shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f8f4ec] text-[#b98d63]">
                              <Icon size={19} />
                            </span>
                            <div>
                              <h3 className="font-display text-xl font-black leading-tight text-[#173b3f]">
                                {cue.title}
                              </h3>
                              <p className="mt-2 text-sm font-semibold leading-relaxed text-[#48605b]">
                                {cue.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {selectedRep && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-[#142323]/72 p-4 md:p-8">
          <button
            type="button"
            aria-label="Close representative profile"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setSelectedRep(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="representative-profile-title"
            className="relative z-10 grid max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-hidden rounded-3xl border border-[#ded6c9] bg-[#fbfaf7] shadow-[0_30px_70px_rgba(20,35,35,0.35)] md:grid-cols-[340px_minmax(0,1fr)]"
          >
            <button
              type="button"
              onClick={() => setSelectedRep(null)}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-lg bg-[#fbfaf7] text-[#173b3f] shadow-sm transition hover:bg-[#f8f4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] active:scale-95"
              aria-label="Close representative profile"
            >
              <X size={22} />
            </button>

            <div className="relative min-h-[260px] bg-[#173b3f] md:min-h-[560px]">
              <Image
                src={getRepImage(selectedRep)}
                alt={selectedRep.name}
                fill
                sizes="(min-width: 768px) 340px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[#173b3f]/20" />
            </div>

            <div className="min-h-0 overflow-y-auto p-6 sm:p-8 md:p-10">
              <p className="city-kicker text-[#48605b]">Official profile</p>
              <h2
                id="representative-profile-title"
                className="mt-3 font-display text-4xl font-black leading-none text-[#173b3f] md:text-5xl"
              >
                {selectedRep.name}
              </h2>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-[#3f6256]">
                {selectedRep.role}
              </p>

              <div className="mt-8 grid gap-5">
                <section className="rounded-2xl border border-[#ded6c9] bg-[#f8f4ec] p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#173b3f] text-[#f8f4ec]">
                      <Target size={21} />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-black text-[#173b3f]">
                        Mission
                      </h3>
                      <p className="mt-2 text-base font-semibold leading-relaxed text-[#48605b]">
                        {selectedRep.mission}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#b98d63] text-[#fbfaf7]">
                      <Mail size={21} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-xl font-black text-[#173b3f]">
                        Official email
                      </h3>
                      <a
                        href={`mailto:${selectedRep.email}`}
                        className="mt-2 inline-flex break-all text-base font-black text-[#173b3f] underline decoration-[#b98d63]/45 underline-offset-4 transition hover:text-[#3f6256] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63]"
                      >
                        {selectedRep.email}
                      </a>
                    </div>
                  </div>
                </section>

                <div className="grid gap-3 border-t border-[#ded6c9] pt-5 sm:grid-cols-2">
                  <div className="flex items-center gap-3 text-sm font-bold text-[#48605b]">
                    <Landmark size={18} className="text-[#b98d63]" />
                    City of Willstone
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-[#48605b]">
                    <Users size={18} className="text-[#b98d63]" />
                    Resident service office
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
