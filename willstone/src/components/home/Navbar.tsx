"use client";
import React, { useState, useEffect, useRef } from "react";
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
  ArrowLeft
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
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <div className="fixed top-4 left-4 z-[100]">
        <button
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-controls="nav-panel"
          className="flex items-center gap-3 px-5 py-3 bg-[#264D52] text-[#f5f0eb] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59F82]"
        >
          <div className="relative w-6 h-6 shrink-0">
            <Image
              src="/logo2.png"
              alt=""
              fill
              className="object-contain brightness-0 invert"
              aria-hidden="true"
            />
          </div>
          <span className="font-bold uppercase tracking-[0.15em] text-sm">Menu</span>
        </button>
      </div>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-[105] bg-[#1c2b2b]/40 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-in Panel */}
      <nav
        id="nav-panel"
        ref={panelRef}
        role="navigation"
        aria-label="Main navigation panel"
        aria-hidden={!isOpen}
        className={`
          fixed top-0 left-0 bottom-0 z-[110]
          w-[min(400px,90vw)] max-w-full
          bg-[#f5f0eb] 
          shadow-2xl
          flex flex-col
          transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b-2 border-[#264D52]/10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative w-9 h-9 shrink-0">
              <Image
                src="/logo2.png"
                alt="Willstone Logo"
                fill
                className="object-contain"
                aria-hidden="true"
              />
            </div>
            <span className="font-display font-bold tracking-[0.15em] text-[#264D52] text-3xl pt-1">
              Willstone
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="p-2 text-[#264D52] hover:bg-[#264D52]/10 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59F82]"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Links Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavItem
                key={link.href}
                link={link}
                isActive={pathname === link.href}
                onNavigate={() => setIsOpen(false)}
              />
            ))}
          </div>
        </div>
      </nav>
    </>
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
        group flex items-center gap-4 px-5 py-4 rounded-xl border-2
        transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#C59F82]
        ${isActive
          ? "bg-[#264D52] text-[#f5f0eb] border-[#264D52] shadow-md"
          : "bg-transparent border-transparent text-[#1c2b2b] hover:bg-[#70AC90]/15 hover:border-[#264D52] hover:scale-[1.02] hover:shadow-sm"
        }
      `}
    >
      <Icon
        size={24}
        className={`shrink-0 transition-all duration-200 group-hover:scale-110 ${isActive
          ? "text-[#C59F82]"
          : "text-[#496A49] group-hover:text-[#264D52]"
          }`}
      />
      <span className={`font-semibold tracking-wide transition-all duration-200 ${isActive ? "text-[16px] text-[#f5f0eb]" : "text-[15px] group-hover:text-[16px]"
        }`}>
        {link.name}
      </span>
    </Link>
  );
}