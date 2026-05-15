"use client";

import {
  Bookmark,
  Building2,
  CalendarDays,
  ChevronDown,
  FileText,
  Landmark,
  LogIn,
  LogOut,
  Map as MapIcon,
  Menu,
  Newspaper,
  Phone,
  PlusCircle,
  Search,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, FormEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type MatchMode = "exact" | "section";
type NavItem = {
  label: string;
  href: string;
  match?: MatchMode;
  icon?: ComponentType<{ size?: number; className?: string }>;
};

const MORE_MENU_ID = "main-more-navigation";
const ACCOUNT_MENU_ID = "resident-account-navigation";
const MOBILE_MENU_ID = "mobile-navigation";
const BUTTON_MOTION =
  "motion-safe:transition-[background-color,border-color,color,transform] motion-safe:duration-200 motion-safe:ease-out motion-safe:active:translate-y-px";
const ICON_MOTION =
  "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out";
const NAV_LINK_MOTION =
  "ring-1 ring-inset ring-transparent motion-safe:transition-[background-color,color,box-shadow,transform] motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0";
const MENU_LINK_MOTION =
  "ring-1 ring-inset ring-transparent motion-safe:transition-[background-color,color,box-shadow,transform] motion-safe:duration-200 motion-safe:ease-out motion-safe:active:translate-y-px";

const primaryLinks: NavItem[] = [
  { label: "Services", href: "/resource-hub", match: "section" },
  { label: "Calendar", href: "/calendar", match: "exact" },
  { label: "News", href: "/news", match: "section" },
  { label: "Government", href: "/government", match: "exact" },
  { label: "About", href: "/about", match: "exact" },
];

const moreLinks: NavItem[] = [
  { label: "Guides", href: "/guides", icon: FileText, match: "section" },
  { label: "City Map", href: "/map", icon: MapIcon, match: "exact" },
  {
    label: "References",
    href: "/reference",
    icon: Landmark,
    match: "exact",
  },
];

const mobileLinks: NavItem[] = [
  { label: "Services", href: "/resource-hub", icon: Search, match: "section" },
  { label: "Calendar", href: "/calendar", icon: CalendarDays, match: "exact" },
  { label: "News", href: "/news", icon: Newspaper, match: "section" },
  { label: "Government", href: "/government", icon: Landmark, match: "exact" },
  { label: "About", href: "/about", icon: Users, match: "exact" },
  ...moreLinks,
];

const isActivePath = (
  pathname: string | null,
  href: string,
  match: MatchMode = "exact",
) => {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  if (match === "section")
    return pathname === href || pathname.startsWith(`${href}/`);
  return pathname === href;
};

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [beaconQuery, setBeaconQuery] = useState("");
  const moreRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pathname) return;
    setMobileOpen(false);
    setMoreOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node))
        setMoreOpen(false);
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      )
        setAccountOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setMoreOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const askBeacon = (query?: string) => {
    const trimmedQuery = query?.trim();
    window.dispatchEvent(
      trimmedQuery
        ? new CustomEvent("willstone-ai-search", { detail: trimmedQuery })
        : new CustomEvent("willstone-open-beacon"),
    );
  };

  const submitBeaconSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    askBeacon(beaconQuery);
    setBeaconQuery("");
    closeMenus();
  };

  const closeMenus = () => {
    setMobileOpen(false);
    setMoreOpen(false);
    setAccountOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
  };

  return (
    <header className="sticky top-0 z-[120] border-b border-[#d8d1c6] bg-[#fbfaf7]/95 text-[#173b3f] shadow-[0_1px_0_rgba(23,59,63,0.04)] backdrop-blur-xl">
      <div className="border-b border-[#e6dfd5] bg-[#173b3f] text-[#f8f4ec]">
        <div className="mx-auto flex h-9 max-w-7xl items-center px-4 text-xs font-medium sm:px-6">
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Phone size={13} /> City Office: (123) 456-7890
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={13} /> Public meetings posted weekly
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid h-[72px] max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b98d63]"
        >
          <span className="relative h-11 w-11 shrink-0 rounded-lg bg-[#173b3f] p-1.5">
            <Image
              src="/logo2.png"
              alt="Willstone city seal"
              fill
              className="object-contain p-1 brightness-0 invert"
            />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-black uppercase tracking-[0.22em] text-[#5d7169]">
              City of
            </span>
            <span className="block truncate font-display text-[26px] leading-none text-[#173b3f]">
              Willstone
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden min-w-0 items-center justify-start gap-1 lg:flex"
        >
          {primaryLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={isActivePath(pathname, link.href, link.match)}
              onClick={closeMenus}
            >
              {link.label}
            </NavLink>
          ))}
          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((value) => !value)}
              aria-controls={MORE_MENU_ID}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              className={`inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm font-semibold text-[#173b3f] hover:bg-[#f8f4ec] hover:ring-[#d5b08c]/70 hover:shadow-[0_8px_18px_rgba(23,59,63,0.08)] active:bg-[#e4ece6] active:ring-[#b98d63]/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] ${NAV_LINK_MOTION}`}
            >
              More{" "}
              <ChevronDown
                size={15}
                className={`${ICON_MOTION} ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>
            {moreOpen && (
              <div
                id={MORE_MENU_ID}
                className="absolute right-0 top-[calc(100%+0.75rem)] w-56 rounded-xl border border-[#ded6c9] bg-[#fbfaf7] p-2 shadow-[0_18px_45px_rgba(23,59,63,0.14)]"
                role="menu"
              >
                {moreLinks.map((link) => (
                  <DropdownLink
                    key={link.href}
                    href={link.href}
                    active={isActivePath(pathname, link.href, link.match)}
                    icon={link.icon}
                    onClick={closeMenus}
                  >
                    {link.label}
                  </DropdownLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <search
            aria-label="Ask Beacon"
            className="relative w-[clamp(15rem,23vw,22rem)]"
          >
            <form onSubmit={submitBeaconSearch}>
              <label htmlFor="beacon-navbar-search" className="sr-only">
                Ask Beacon about city services
              </label>
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5d7169]"
              />
              <input
                id="beacon-navbar-search"
                type="search"
                value={beaconQuery}
                onChange={(event) => setBeaconQuery(event.target.value)}
                placeholder="Ask Beacon..."
                className="h-10 w-full rounded-md border border-[#cfc7ba] bg-white py-2 pl-9 pr-16 text-sm font-semibold text-[#173b3f] outline-none placeholder:text-[#5d7169]/70 hover:border-[#9f9283] focus:border-[#173b3f] focus:ring-4 focus:ring-[#d5b08c]/25"
              />
              <button
                type="submit"
                className={`absolute right-1 top-1/2 inline-flex h-8 -translate-y-1/2 items-center rounded px-3 text-xs font-black text-[#173b3f] hover:bg-[#f8f4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] ${BUTTON_MOTION}`}
              >
                Ask
              </button>
            </form>
          </search>

          {user ? (
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                aria-controls={ACCOUNT_MENU_ID}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className={`inline-flex h-10 max-w-[14rem] items-center gap-2 rounded-md border border-[#cfc7ba] bg-[#173b3f] px-3 text-sm font-bold text-[#fbfaf7] hover:bg-[#244a4d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] ${BUTTON_MOTION}`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#fbfaf7] text-xs font-black text-[#173b3f]">
                  {getInitials(user.name)}
                </span>
                <span className="truncate">{user.name}</span>
                <ChevronDown
                  size={15}
                  className={`${ICON_MOTION} ${accountOpen ? "rotate-180" : ""}`}
                />
              </button>
              {accountOpen && (
                <div
                  id={ACCOUNT_MENU_ID}
                  className="absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-xl border border-[#ded6c9] bg-[#fbfaf7] p-2 shadow-[0_18px_45px_rgba(23,59,63,0.14)]"
                  role="menu"
                >
                  <div className="px-3 py-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5d7169]">
                      Resident account
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-[#173b3f]">
                      {user.email}
                    </p>
                  </div>
                  <div className="my-1 h-px bg-[#ded6c9]" />
                  <DropdownLink
                    href="/dashboard"
                    active={isActivePath(pathname, "/dashboard")}
                    icon={Building2}
                    onClick={closeMenus}
                  >
                    Dashboard
                  </DropdownLink>
                  <DropdownLink
                    href="/saved"
                    active={isActivePath(pathname, "/saved")}
                    icon={Bookmark}
                    onClick={closeMenus}
                  >
                    Saved Resources
                  </DropdownLink>
                  <DropdownLink
                    href="/request"
                    active={isActivePath(pathname, "/request")}
                    icon={PlusCircle}
                    onClick={closeMenus}
                  >
                    Submit Resource
                  </DropdownLink>
                  <DropdownButton icon={LogOut} onClick={handleLogout}>
                    Log Out
                  </DropdownButton>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              aria-current={pathname === "/auth" ? "page" : undefined}
              className={`inline-flex h-10 items-center gap-2 rounded-md bg-[#173b3f] px-4 text-sm font-black text-[#fbfaf7] hover:bg-[#244a4d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] ${BUTTON_MOTION} ${isLoading ? "pointer-events-none opacity-70" : ""}`}
            >
              <LogIn size={16} />
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-expanded={mobileOpen}
          aria-controls={MOBILE_MENU_ID}
          aria-label="Toggle navigation"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#173b3f] text-white hover:bg-[#3f6256] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] lg:hidden ${BUTTON_MOTION}`}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          id={MOBILE_MENU_ID}
          className="border-t border-[#e6dfd5] bg-[#fbfaf7] px-4 pb-5 pt-3 lg:hidden"
        >
          <search aria-label="Ask Beacon" className="relative mb-3">
            <form onSubmit={submitBeaconSearch}>
              <label htmlFor="beacon-mobile-search" className="sr-only">
                Ask Beacon about city services
              </label>
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5d7169]"
              />
              <input
                id="beacon-mobile-search"
                type="search"
                value={beaconQuery}
                onChange={(event) => setBeaconQuery(event.target.value)}
                placeholder="Ask Beacon about services, events, or city offices"
                className="min-h-12 w-full rounded-md border border-[#cfc7ba] bg-white py-3 pl-10 pr-16 text-sm font-semibold text-[#173b3f] outline-none placeholder:text-[#5d7169]/70 focus:border-[#173b3f] focus:ring-4 focus:ring-[#d5b08c]/25"
              />
              <button
                type="submit"
                className={`absolute right-1.5 top-1/2 inline-flex h-9 -translate-y-1/2 items-center rounded px-3 text-xs font-black text-[#173b3f] hover:bg-[#f8f4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] ${BUTTON_MOTION}`}
              >
                Ask
              </button>
            </form>
          </search>

          <nav aria-label="Mobile navigation" className="grid gap-1">
            {mobileLinks.map((link) => (
              <DropdownLink
                key={link.href}
                href={link.href}
                active={isActivePath(pathname, link.href, link.match)}
                icon={link.icon}
                onClick={closeMenus}
              >
                {link.label}
              </DropdownLink>
            ))}
          </nav>

          {user ? (
            <div className="mt-4 rounded-xl border border-[#ded6c9] bg-white p-2">
              <div className="px-3 py-2">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5d7169]">
                  Resident account
                </p>
                <p className="mt-1 truncate text-sm font-bold text-[#173b3f]">
                  {user.email}
                </p>
              </div>
              <DropdownLink
                href="/dashboard"
                onClick={closeMenus}
                active={isActivePath(pathname, "/dashboard")}
                icon={Building2}
              >
                Dashboard
              </DropdownLink>
              <DropdownLink
                href="/saved"
                onClick={closeMenus}
                active={isActivePath(pathname, "/saved")}
                icon={Bookmark}
              >
                Saved Resources
              </DropdownLink>
              <DropdownLink
                href="/request"
                onClick={closeMenus}
                active={isActivePath(pathname, "/request")}
                icon={PlusCircle}
              >
                Submit Resource
              </DropdownLink>
              <DropdownButton icon={LogOut} onClick={handleLogout}>
                Log Out
              </DropdownButton>
            </div>
          ) : (
            <Link
              href="/auth"
              onClick={closeMenus}
              className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#173b3f] px-4 text-sm font-black text-[#fbfaf7] hover:bg-[#244a4d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63]"
            >
              <LogIn size={16} />
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function NavLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`inline-flex h-10 min-w-0 items-center rounded-md px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] ${NAV_LINK_MOTION} ${
        active
          ? "bg-[#173b3f] text-white ring-[#173b3f] hover:bg-[#244a4d] hover:ring-[#d5b08c]/70"
          : "text-[#173b3f] hover:bg-[#f8f4ec] hover:text-[#102f32] hover:ring-[#d5b08c]/70 hover:shadow-[0_8px_18px_rgba(23,59,63,0.08)] active:bg-[#e4ece6] active:ring-[#b98d63]/45"
      }`}
    >
      <span className="truncate">{children}</span>
    </Link>
  );
}

function DropdownButton({
  icon: Icon,
  onClick,
  children,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex min-h-11 w-full min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#173b3f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] hover:bg-[#f8f4ec] hover:text-[#102f32] hover:ring-[#d5b08c]/70 hover:shadow-[0_6px_16px_rgba(23,59,63,0.07)] active:bg-[#e4ece6] active:ring-[#b98d63]/45 ${MENU_LINK_MOTION}`}
    >
      <Icon size={16} className="shrink-0" />
      <span className="truncate">{children}</span>
    </button>
  );
}

function DropdownLink({
  href,
  active,
  icon: Icon,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  icon?: ComponentType<{ size?: number; className?: string }>;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-11 min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] ${MENU_LINK_MOTION} ${
        active
          ? "bg-[#173b3f] text-white ring-[#173b3f] hover:bg-[#244a4d] hover:ring-[#d5b08c]/70"
          : "text-[#173b3f] hover:bg-[#f8f4ec] hover:text-[#102f32] hover:ring-[#d5b08c]/70 hover:shadow-[0_6px_16px_rgba(23,59,63,0.07)] active:bg-[#e4ece6] active:ring-[#b98d63]/45"
      }`}
    >
      {Icon && <Icon size={16} className="shrink-0" />}
      <span className="truncate">{children}</span>
    </Link>
  );
}
