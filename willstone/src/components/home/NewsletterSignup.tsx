"use client";

import { CheckCircle, Loader2, Mail } from "lucide-react";
import { useState } from "react";

export default function NewsletterSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setStatus(response.ok ? "success" : "error");
    if (response.ok) {
      setName("");
      setEmail("");
    }
  }

  return (
    <section className="city-section bg-[#fbfaf7]">
      <div className="city-container grid gap-8 rounded-2xl bg-[#173b3f] p-6 text-white shadow-lg md:grid-cols-[1fr_1.2fr] md:p-10">
        <div>
          <p className="city-kicker text-[#d5b08c]">Stay connected</p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">Willstone Weekly</h2>
          <p className="mt-4 max-w-xl text-sm font-bold leading-relaxed text-white/80">
            Get resource updates, event reminders, and new resident services in a concise weekly digest.
          </p>
        </div>

        <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1fr_1.4fr_auto] md:items-end">
          <label className="grid gap-2 text-sm font-bold">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="min-h-12 rounded-md border border-white/15 bg-white px-4 text-[#173b3f] outline-none focus:ring-4 focus:ring-[#d5b08c]/30"
              placeholder="Avery Stone"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-12 rounded-md border border-white/15 bg-white px-4 text-[#173b3f] outline-none focus:ring-4 focus:ring-[#d5b08c]/30"
              placeholder="avery@example.com"
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#d5b08c] px-5 font-black text-[#173b3f] transition hover:bg-white disabled:opacity-60"
          >
            {status === "loading" ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
            Join
          </button>
          {status === "success" && (
            <p className="inline-flex items-center gap-2 text-sm font-bold text-[#d5b08c] md:col-span-3">
              <CheckCircle size={17} /> You are subscribed.
            </p>
          )}
          {status === "error" && <p className="text-sm font-bold text-red-100 md:col-span-3">Subscription failed. Please try again.</p>}
        </form>
      </div>
    </section>
  );
}
