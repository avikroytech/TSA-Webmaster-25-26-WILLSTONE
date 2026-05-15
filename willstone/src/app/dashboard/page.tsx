"use client";

import {
  Bookmark,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FilePlus2,
  FolderSearch,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import Footer from "@/components/home/Footer";
import SubpageHero from "@/components/layout/SubpageHero";
import { useAuth } from "@/context/AuthContext";

type Submission = {
  id: string;
  title: string;
  category: string;
  custom_category?: string;
  description: string;
  status?: "reviewing" | "approved" | "needs_info";
  submitted_at: string;
};

const statusDetails = {
  reviewing: {
    label: "Reviewing",
    description:
      "City staff are checking details before it enters the directory.",
    icon: Clock3,
    className: "border-[#d5b08c]/50 bg-[#d5b08c]/18 text-[#173b3f]",
  },
  approved: {
    label: "Approved",
    description: "This resource has been cleared for the public directory.",
    icon: CheckCircle2,
    className: "border-[#496A49]/35 bg-[#496A49]/12 text-[#173b3f]",
  },
  needs_info: {
    label: "Needs info",
    description: "The review team needs more detail before publishing.",
    icon: FolderSearch,
    className: "border-[#b98d63]/40 bg-[#b98d63]/12 text-[#173b3f]",
  },
} satisfies Record<
  NonNullable<Submission["status"]>,
  {
    label: string;
    description: string;
    icon: typeof Clock3;
    className: string;
  }
>;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function DashboardPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (!user) return;
    const saved =
      window.localStorage.getItem(`willstone-submissions-${user.id}`) ||
      window.localStorage.getItem("willstone-submissions");
    try {
      setSubmissions(saved ? JSON.parse(saved) : []);
    } catch {
      setSubmissions([]);
    }
  }, [user]);

  const reviewingCount = submissions.filter(
    (submission) => (submission.status ?? "reviewing") === "reviewing",
  ).length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main>
        <SubpageHero
          title="My Submissions"
          eyebrow="Resident dashboard"
          description="Review resource submissions and continue contributing to the Willstone directory."
          image="/img/city-home2.jpg"
        />
        <section className="px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <RequireAuth redirectTo="/dashboard">
              <div className="mb-8 overflow-hidden rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] shadow-[0_12px_36px_rgba(23,59,63,0.07)]">
                <div className="flex flex-col gap-6 border-b border-[#ded6c9] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="city-kicker text-[#48605b]">
                      Resident account
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-black text-[#173b3f] sm:text-4xl">
                      {user?.name}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm font-bold leading-6 text-[#48605b]">
                      Track submitted resources, return to saved places, and
                      keep community directory suggestions in one civic record.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                    <Link
                      href="/request"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#173b3f] px-5 text-sm font-black text-[#f8f4ec] transition-colors hover:bg-[#3f6256] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d5b08c]"
                    >
                      <FilePlus2 size={17} aria-hidden="true" />
                      Submit Resource
                    </Link>
                    <Link
                      href="/saved"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#cfc7ba] bg-[#fbfaf7] px-5 text-sm font-black text-[#173b3f] transition-colors hover:bg-[#f8f4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d5b08c]"
                    >
                      <Bookmark size={17} aria-hidden="true" />
                      Saved Resources
                    </Link>
                  </div>
                </div>

                <div className="grid border-[#ded6c9] sm:grid-cols-3 sm:divide-x sm:divide-[#ded6c9]">
                  <div className="border-b border-[#ded6c9] p-5 sm:border-b-0">
                    <p className="city-kicker text-[#48605b]">Submissions</p>
                    <p className="mt-2 font-display text-4xl font-black text-[#173b3f]">
                      {submissions.length}
                    </p>
                  </div>
                  <div className="border-b border-[#ded6c9] p-5 sm:border-b-0">
                    <p className="city-kicker text-[#48605b]">Reviewing</p>
                    <p className="mt-2 font-display text-4xl font-black text-[#173b3f]">
                      {reviewingCount}
                    </p>
                  </div>
                  <div className="p-5">
                    <p className="city-kicker text-[#48605b]">Account email</p>
                    <p className="mt-3 break-words text-sm font-black text-[#173b3f]">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="city-kicker text-[#48605b]">Resource queue</p>
                  <h2 className="mt-1 font-display text-3xl font-black text-[#173b3f]">
                    Submitted resources
                  </h2>
                </div>
                <p className="text-sm font-bold text-[#48605b]">
                  Default status: Reviewing
                </p>
              </div>

              <div className="grid gap-4">
                {submissions.length > 0 ? (
                  submissions.map((submission) => {
                    const status =
                      statusDetails[submission.status ?? "reviewing"];
                    const StatusIcon = status.icon;

                    return (
                      <article
                        key={submission.id}
                        className="rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] p-5 shadow-[0_12px_36px_rgba(23,59,63,0.07)] transition-shadow hover:shadow-[0_18px_46px_rgba(23,59,63,0.11)]"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="rounded-full border border-[#ded6c9] bg-[#f8f4ec] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#48605b]">
                                {formatDate(submission.submitted_at)}
                              </p>
                              <p className="rounded-full border border-[#ded6c9] bg-[#f8f4ec] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#48605b]">
                                {submission.category === "other"
                                  ? submission.custom_category
                                  : submission.category}
                              </p>
                            </div>
                            <h3 className="mt-3 font-display text-2xl font-black text-[#173b3f] sm:text-3xl">
                              {submission.title}
                            </h3>
                            <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-[#48605b]">
                              {submission.description}
                            </p>
                          </div>
                          <div
                            className={`w-fit shrink-0 rounded-xl border px-4 py-3 ${status.className}`}
                          >
                            <div className="flex items-center gap-2">
                              <StatusIcon size={18} aria-hidden="true" />
                              <p className="text-xs font-black uppercase tracking-[0.12em]">
                                {status.label}
                              </p>
                            </div>
                            <p className="mt-2 max-w-[16rem] text-xs font-bold leading-5 text-[#48605b]">
                              {status.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] p-8 text-center shadow-[0_12px_36px_rgba(23,59,63,0.07)] sm:p-10">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ded6c9] bg-[#f8f4ec] text-[#173b3f]">
                      <ClipboardList size={26} aria-hidden="true" />
                    </div>
                    <h2 className="mt-5 font-display text-4xl font-black text-[var(--brand-medium)]">
                      No submissions yet
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg font-bold leading-relaxed text-[var(--foreground)]/65">
                      Submitted resources will appear here after you use the
                      resource request form. Each new request starts as
                      Reviewing.
                    </p>
                    <Link
                      href="/request"
                      className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--brand-medium)] px-6 font-black text-[#f8f4ec] transition-colors hover:bg-[#3f6256] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d5b08c]"
                    >
                      <FilePlus2 size={17} aria-hidden="true" />
                      Submit a Resource
                    </Link>
                  </div>
                )}
              </div>
            </RequireAuth>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
