"use client";

import { Eye, EyeOff, Loader2, Lock, Mail, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Footer from "@/components/home/Footer";
import SubpageHero from "@/components/layout/SubpageHero";
import { useAuth } from "@/context/AuthContext";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthPageContent />
    </Suspense>
  );
}

function AuthPageContent() {
  const { login, signup, user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace(nextPath);
  }, [isLoading, user, nextPath, router]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
        router.replace(nextPath);
      } else {
        const hasSession = await signup(email, password, name);
        if (hasSession) {
          router.replace(nextPath);
        } else {
          setStatusMessage(
            "Account created. Check your email to confirm your Willstone account before signing in.",
          );
          setMode("login");
          setPassword("");
        }
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "We could not complete that request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4ec]">
      <main>
        <SubpageHero
          title="Resident Account"
          eyebrow="My Willstone"
          description="Sign in to save resources, submit recommendations, review services, and manage resident activity."
          image="/img/city-home.jpg"
        />
        <section className="px-[var(--space-page-x)] py-[var(--space-section-tight)]">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <aside className="rounded-3xl border border-[#ded6c9] bg-[#173b3f] p-7 text-[#f8f4ec] shadow-[0_20px_48px_rgba(23,59,63,0.14)]">
              <h2 className="mt-3 font-display text-4xl font-black leading-tight">
                One account for resident tools.
              </h2>
              <div className="mt-8 grid gap-4 text-sm font-semibold leading-relaxed text-[#f8f4ec]/82">
                <p>Save community resources for later.</p>
                <p>Submit new programs and public services for review.</p>
                <p>Post resource reviews under your resident profile.</p>
              </div>
              <div className="mt-8 rounded-2xl border border-[#d5b08c]/35 bg-[#102f32] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#d5b08c]">
                  Judge credentials
                </p>
                <dl className="mt-3 grid gap-2 text-sm font-bold text-[#f8f4ec]">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-[#f8f4ec]/58">
                      Email
                    </dt>
                    <dd className="mt-1 break-all">tsajudge@tsa.com</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-[#f8f4ec]/58">
                      Password
                    </dt>
                    <dd className="mt-1">Judge@123</dd>
                  </div>
                </dl>
              </div>
            </aside>

            <div className="rounded-3xl border border-[#ded6c9] bg-[#fbfaf7] p-5 shadow-sm md:p-8">
              {isLoading || user ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                  <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#3f6256]" />
                  <p className="city-kicker text-[#48605b]">
                    Opening your account
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 grid grid-cols-2 rounded-xl border border-[#ded6c9] bg-[#f8f4ec] p-1">
                    {(["login", "signup"] as const).map((option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => {
                          setMode(option);
                          setFormError("");
                          setStatusMessage("");
                        }}
                        className={`min-h-11 rounded-lg text-sm font-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] ${
                          mode === option
                            ? "bg-[#173b3f] text-[#fbfaf7]"
                            : "text-[#173b3f] hover:bg-[#fbfaf7]"
                        }`}
                      >
                        {option === "login" ? "Sign In" : "Create Account"}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={submit} className="grid gap-5">
                    <div>
                      <h2 className="font-display text-4xl font-black text-[#173b3f]">
                        {mode === "login" ? "Welcome back" : "Create account"}
                      </h2>
                      <p className="mt-2 text-sm font-semibold leading-relaxed text-[#48605b]">
                        {mode === "login"
                          ? "Use your Willstone resident account to continue."
                          : "Create a resident account with your email and password."}
                      </p>
                    </div>

                    {mode === "signup" && (
                      <label className="grid gap-2 text-sm font-black text-[#173b3f]">
                        Full name
                        <span className="relative">
                          <UserRound
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#48605b]"
                          />
                          <input
                            required
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="min-h-12 w-full rounded-xl border border-[#cfc7ba] bg-white px-4 pl-11 font-semibold outline-none focus:border-[#173b3f] focus:ring-4 focus:ring-[#d5b08c]/25"
                          />
                        </span>
                      </label>
                    )}

                    <label className="grid gap-2 text-sm font-black text-[#173b3f]">
                      Email
                      <span className="relative">
                        <Mail
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#48605b]"
                        />
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          className="min-h-12 w-full rounded-xl border border-[#cfc7ba] bg-white px-4 pl-11 font-semibold outline-none focus:border-[#173b3f] focus:ring-4 focus:ring-[#d5b08c]/25"
                        />
                      </span>
                    </label>

                    <label className="grid gap-2 text-sm font-black text-[#173b3f]">
                      Password
                      <span className="relative">
                        <Lock
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#48605b]"
                        />
                        <input
                          required
                          type={showPassword ? "text" : "password"}
                          minLength={6}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          className="min-h-12 w-full rounded-xl border border-[#cfc7ba] bg-white px-4 pl-11 pr-14 font-semibold outline-none focus:border-[#173b3f] focus:ring-4 focus:ring-[#d5b08c]/25"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#48605b] hover:bg-[#f8f4ec] hover:text-[#173b3f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63]"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          aria-pressed={showPassword}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </span>
                    </label>

                    {formError && (
                      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                        {formError}
                      </p>
                    )}

                    {statusMessage && (
                      <p className="rounded-xl border border-[#d5b08c] bg-[#f8f4ec] px-4 py-3 text-sm font-bold text-[#173b3f]">
                        {statusMessage}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#173b3f] px-5 text-sm font-black text-[#fbfaf7] transition-colors hover:bg-[#3f6256] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting && (
                        <Loader2 size={17} className="animate-spin" />
                      )}
                      {mode === "login" ? "Sign In" : "Create Account"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f4ec] text-[#173b3f]">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
}
