"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "@/components/home/Footer";
import SubpageHero from "@/components/layout/SubpageHero";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const { login, user, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    login(email, name);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main>
        <SubpageHero
          title="Resident Sign In"
          eyebrow="My Willstone"
          description="Access a local dashboard for saved submission receipts and resident resource activity."
          image="/img/city-home.jpg"
        />
        <section className="px-6 py-16">
          <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-sm md:p-8">
            {user ? (
              <div className="text-center">
                <h2 className="font-display text-4xl text-[var(--brand-medium)]">Signed In</h2>
                <p className="mt-3 font-bold text-[var(--foreground)]/70">{user.name} · {user.email}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => router.push("/dashboard")} className="min-h-12 rounded-xl bg-[var(--brand-medium)] px-5 font-black text-white">
                    View Dashboard
                  </button>
                  <button type="button" onClick={logout} className="min-h-12 rounded-xl border border-[var(--brand-medium)]/20 px-5 font-black text-[var(--brand-medium)]">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-5">
                <h2 className="font-display text-4xl text-[var(--brand-medium)]">Login or Signup</h2>
                <label className="grid gap-2 font-black text-[var(--brand-medium)]">
                  Name
                  <input required value={name} onChange={(event) => setName(event.target.value)} className="min-h-12 rounded-xl border border-[var(--brand-medium)]/20 px-4 outline-none focus:ring-4 focus:ring-[var(--brand-medium)]/10" />
                </label>
                <label className="grid gap-2 font-black text-[var(--brand-medium)]">
                  Email
                  <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-12 rounded-xl border border-[var(--brand-medium)]/20 px-4 outline-none focus:ring-4 focus:ring-[var(--brand-medium)]/10" />
                </label>
                <button type="submit" className="min-h-12 rounded-xl bg-[var(--brand-medium)] px-5 font-black text-white">
                  Continue
                </button>
                <p className="text-xs font-bold leading-relaxed text-[var(--foreground)]/55">
                  This lightweight resident profile persists on this device and connects to your locally saved submission receipts.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
