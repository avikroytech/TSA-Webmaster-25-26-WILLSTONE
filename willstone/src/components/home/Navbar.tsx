"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderOpen,
  PlusCircle,
  Map,
  Calendar,
  Newspaper,
  BookOpen,
  Landmark,
  FileText,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Resource Hub", href: "/resource-hub", icon: FolderOpen },
  { name: "Request a Resource", href: "/request", icon: PlusCircle },
  { name: "Map", href: "/map", icon: Map },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "News", href: "/news", icon: Newspaper },
  { name: "Guides", href: "/guides", icon: BookOpen },
  { name: "Government", href: "/government", icon: Landmark },
  { name: "Reference", href: "/reference", icon: FileText },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Close on outside click (mobile)
  useEffect(() => {
    if (!isMobile || !isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMobile, isOpen]);

  // Desktop hover handlers with delay to prevent flicker
  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setIsOpen(true);
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    closeTimeout.current = setTimeout(() => setIsOpen(false), 200);
  }, [isMobile]);

  // Focus-within for keyboard users on desktop
  const handleFocusIn = useCallback(() => {
    if (isMobile) return;
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setIsOpen(true);
  }, [isMobile]);

  const handleFocusOut = useCallback(
    (e: React.FocusEvent) => {
      if (isMobile) return;
      // Only close if focus leaves the entire nav container
      if (navRef.current && !navRef.current.contains(e.relatedTarget as Node)) {
        closeTimeout.current = setTimeout(() => setIsOpen(false), 200);
      }
    },
    [isMobile]
  );

  // Split links into 2 columns
  const mid = Math.ceil(navLinks.length / 2);
  const col1 = navLinks.slice(0, mid);
  const col2 = navLinks.slice(mid);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none pt-4 px-4">
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocusIn}
        onBlur={handleFocusOut}
        className="pointer-events-auto relative"
      >
        {/* Trigger Button */}
        <button
          onClick={() => isMobile && setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls="nav-panel"
          className={`
            relative z-20 flex items-center justify-center gap-3
            mx-auto px-6 py-3
            bg-[#264D52] text-[#f5f0eb]
            font-bold uppercase tracking-[0.15em] text-sm
            shadow-lg
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59F82]
            ${isOpen
              ? "w-[min(480px,90vw)] rounded-t-2xl rounded-b-none shadow-2xl"
              : "w-[180px] rounded-full hover:shadow-xl hover:scale-105"
            }
          `}
        >
          <div className="relative w-7 h-7 shrink-0">
            <Image
              src="/logo2.png"
              alt=""
              fill
              className="object-contain brightness-0 invert"
              aria-hidden="true"
            />
          </div>
          <span className="select-none font-display">
            {isOpen && isMobile ? "Close" : "Willstone"}
          </span>
          {isMobile && (
            <span className="ml-auto">
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </span>
          )}
        </button>

        {/* Panel */}
        <div
          id="nav-panel"
          role="menu"
          aria-hidden={!isOpen}
          className={`
            absolute left-1/2 -translate-x-1/2 z-10
            bg-[#f5f0eb] border-2 border-t-0 border-[#264D52]
            rounded-b-2xl
            shadow-2xl
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            overflow-hidden
            ${isOpen
              ? "w-[min(480px,90vw)] max-h-[600px] opacity-100 py-5 px-5"
              : "w-[180px] max-h-0 opacity-0 py-0 px-5"
            }
          `}
        >
          <div className={`
            grid grid-cols-2 gap-x-3 gap-y-1
            transition-opacity duration-300
            ${isOpen ? "opacity-100 delay-200" : "opacity-0"}
          `}>
            {/* Column 1 */}
            <div className="flex flex-col gap-1">
              {col1.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  isActive={pathname === link.href}
                  onNavigate={() => setIsOpen(false)}
                />
              ))}
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-1">
              {col2.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  isActive={pathname === link.href}
                  onNavigate={() => setIsOpen(false)}
                />
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

/* ----------------------------------------- */
/* Individual Nav Link                       */
/* ----------------------------------------- */
interface NavItemProps {
  link: { name: string; href: string; icon: React.ComponentType<{ size?: number; className?: string }> };
  isActive: boolean;
  onNavigate: () => void;
}

function NavItem({ link, isActive, onNavigate }: NavItemProps) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      role="menuitem"
      onClick={onNavigate}
      className={`
        group flex items-center gap-3 px-4 py-3 rounded-xl border-2
        transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#C59F82]
        ${isActive
          ? "bg-[#264D52] text-[#f5f0eb] border-[#264D52] shadow-md"
          : "bg-transparent border-transparent text-[#1c2b2b] hover:bg-[#70AC90]/15 hover:border-[#264D52] hover:scale-[1.04] hover:shadow-sm"
        }
      `}
    >
      <Icon
        size={22}
        className={`shrink-0 transition-all duration-200 group-hover:scale-110 ${isActive
          ? "text-[#C59F82]"
          : "text-[#496A49] group-hover:text-[#264D52]"
          }`}
      />
      <span className={`font-semibold tracking-wide transition-all duration-200 ${isActive ? "text-[15px] text-[#f5f0eb]" : "text-sm group-hover:text-[15px]"
        }`}>
        {link.name}
      </span>
    </Link>
  );
}