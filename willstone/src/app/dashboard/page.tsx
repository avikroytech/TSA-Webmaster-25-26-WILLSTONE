"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/home/Footer";
import SubpageHero from "@/components/layout/SubpageHero";
import { useAuth } from "@/context/AuthContext";

type Submission = {
  id: string;
  title: string;
  category: string;
  custom_category?: string;
  description: string;
  submitted_at: string;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("willstone-submissions");
    setSubmissions(saved ? JSON.parse(saved) : []);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main>
        <SubpageHero
          title="My Submissions"
          eyebrow="Resident dashboard"
          description="Review resource submissions saved from this device and continue contributing to the Willstone directory."
          image="/img/city-home2.jpg"
        />
        <section className="px-6 py-14">
          <div className="mx-auto max-w-5xl">
            {!user && (
              <div className="mb-6 rounded-2xl border border-[var(--brand-medium)]/10 bg-white p-5 shadow-sm">
                <p className="font-bold text-[var(--foreground)]/75">Sign in to personalize this dashboard.</p>
                <Link href="/auth" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-[var(--brand-medium)] px-5 font-black text-white">
                  Login or Signup
                </Link>
              </div>
            )}

            <div className="grid gap-4">
              {submissions.length > 0 ? (
                submissions.map((submission) => (
                  <article key={submission.id} className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="font-display text-3xl text-[var(--brand-medium)]">{submission.title}</h2>
                      <span className="w-fit rounded-full bg-[var(--brand-light)]/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-[var(--brand-dark)]">
                        {new Date(submission.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-black uppercase tracking-widest text-[var(--brand-dark)]">
                      {submission.category === "other" ? submission.custom_category : submission.category}
                    </p>
                    <p className="mt-3 font-bold leading-relaxed text-[var(--foreground)]/70">{submission.description}</p>
                  </article>
                ))
              ) : (
                <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                  <h2 className="font-display text-4xl text-[var(--brand-medium)]">No submissions yet</h2>
                  <p className="mx-auto mt-3 max-w-lg font-bold leading-relaxed text-[var(--foreground)]/65">
                    Submitted resources will appear here after you use the resource request form on this device.
                  </p>
                  <Link href="/request" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[var(--brand-medium)] px-6 font-black text-white">
                    Submit a Resource
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
