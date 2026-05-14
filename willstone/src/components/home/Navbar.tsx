"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Building2,
  CalendarDays,
  ChevronDown,
  FileText,
  Landmark,
  Map,
  Menu,
  Newspaper,
  Phone,
  PlusCircle,
  Search,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const primaryLinks = [
  { label: "Services", href: "/resource-hub" },
  { label: "Calendar", href: "/calendar" },
  { label: "News", href: "/news" },
  { label: "Government", href: "/government" },
  { label: "About", href: "/about" },
];

const moreLinks = [
  { label: "Guides", href: "/guides", icon: FileText },
  { label: "City Map", href: "/map", icon: Map },
  { label: "Dashboard", href: "/dashboard", icon: Building2 },
  { label: "References", href: "/reference", icon: Landmark },
];

const mobileLinks = [
  { label: "Services", href: "/resource-hub", icon: Search },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Government", href: "/government", icon: Landmark },
  { label: "About", href: "/about", icon: Users },
  ...moreLinks,
];

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) setMoreOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const askBeacon = () => {
    window.dispatchEvent(new CustomEvent("willstone-open-beacon"));
  };

  return (
    <header className="sticky top-0 z-[120] border-b border-[#d8d1c6] bg-[#fbfaf7]/95 text-[#173b3f] shadow-[0_1px_0_rgba(23,59,63,0.04)] backdrop-blur-xl">
      <div className="border-b border-[#e6dfd5] bg-[#173b3f] text-[#f8f4ec]">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-[12px] font-semibold sm:px-6">
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Phone size={13} /> City Office: (123) 456-7890
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={13} /> Public meetings posted weekly
            </span>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            {user && <span>Signed in as {user.name}</span>}
            <button type="button" onClick={askBeacon} className="inline-flex items-center gap-1.5 hover:text-[#d5b08c]">
              <Bot size={13} /> Ask Beacon
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b98d63]">
          <span className="relative h-11 w-11 shrink-0 rounded-lg bg-[#173b3f] p-1.5">
            <Image src="/logo2.png" alt="Willstone city seal" fill className="object-contain p-1 brightness-0 invert" />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-black uppercase tracking-[0.22em] text-[#5d7169]">City of</span>
            <span className="block truncate font-display text-[26px] leading-none text-[#173b3f]">Willstone</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {primaryLinks.map((link) => (
            <NavLink key={link.href} href={link.href} active={pathname === link.href}>
              {link.label}
            </NavLink>
          ))}
          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((value) => !value)}
              aria-expanded={moreOpen}
              className="inline-flex h-10 items-center gap-1 rounded-md px-3 text-[14px] font-bold text-[#173b3f] transition hover:bg-[#eef3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63]"
            >
              More <ChevronDown size={15} className={moreOpen ? "rotate-180 transition" : "transition"} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] w-56 rounded-xl border border-[#ded6c9] bg-[#fbfaf7] p-2 shadow-[0_18px_45px_rgba(23,59,63,0.14)]">
                {moreLinks.map((link) => (
                  <DropdownLink key={link.href} href={link.href} active={pathname === link.href} icon={link.icon}>
                    {link.label}
                  </DropdownLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/resource-hub"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#cfc7ba] bg-white px-4 text-[14px] font-black text-[#173b3f] transition hover:border-[#173b3f]"
          >
            <Search size={16} /> Find Services
          </Link>
          <Link
            href="/request"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#b98d63] px-4 text-[14px] font-black text-white transition hover:bg-[#173b3f]"
          >
            <PlusCircle size={16} /> Submit Resource
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#173b3f] text-white lg:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="border-t border-[#e6dfd5] bg-[#fbfaf7] px-4 pb-5 pt-3 lg:hidden">
          <nav aria-label="Mobile navigation" className="grid gap-1">
            {mobileLinks.map((link) => (
              <DropdownLink key={link.href} href={link.href} active={pathname === link.href} icon={link.icon}>
                {link.label}
              </DropdownLink>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button type="button" onClick={askBeacon} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#cfc7ba] bg-white px-4 font-black text-[#173b3f]">
              <Bot size={16} /> Ask Beacon
            </button>
            <Link href="/resource-hub" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#cfc7ba] bg-white px-4 font-black text-[#173b3f]">
              <Search size={16} /> Find Services
            </Link>
            <Link href="/request" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#b98d63] px-4 font-black text-white">
              <PlusCircle size={16} /> Submit Resource
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex h-10 items-center rounded-md px-3 text-[14px] font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] ${
        active ? "bg-[#173b3f] text-white" : "text-[#173b3f] hover:bg-[#eef3ee]"
      }`}
    >
      {children}
    </Link>
  );
}

function DropdownLink({
  href,
  active,
  icon: Icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ComponentType<{ size?: number }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-bold transition ${
        active ? "bg-[#173b3f] text-white" : "text-[#173b3f] hover:bg-[#eef3ee]"
      }`}
    >
      <Icon size={16} />
      {children}
    </Link>
  );
}
