"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Resource Hub", href: "/resource-hub" },
    { name: "Request a Resource", href: "/request" },
    { name: "Map", href: "/map" },
    { name: "Reference", href: "/reference" },
  ];

  return (
    <nav
      className={`sticky top-0 z-[100] w-full transition-all duration-300 ${isScrolled ? "py-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)]" : "py-5"
        }`}
      style={{
        backgroundColor: "#264D52",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Structural Road Edges */}
      <div className="absolute top-0 w-full h-[1px] bg-[#496A49]/20" />
      <div className="absolute bottom-0 w-full h-[4px] bg-[#1a2a2a]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="flex items-center justify-between h-20">

          {/* --- LOGO (Left Aligned) --- */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="relative h-16 px-8 bg-[#f5f0eb] rounded-lg transform -skew-x-12 flex items-center justify-center shadow-[6px_6px_0px_#496A49] transition-all group-hover:translate-y-1 group-hover:shadow-none">
              <div className="transform skew-x-12 flex items-center gap-4">
                <div className="relative w-10 h-10">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-[#264D52] font-black uppercase text-2xl tracking-tighter">
                  Willstone
                </span>
              </div>
            </div>
          </Link>

          {/* --- THE HIGHWAY (Links Right Aligned) --- */}
          <div className="hidden md:flex items-center flex-grow justify-end relative h-full ml-12">
            <div className="flex items-center gap-3 relative z-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.name} href={link.href} className="relative group">
                    <div className={`
                      relative px-7 py-3 transition-all duration-300 transform -skew-x-[20deg]
                      border-b-4 
                      ${isActive
                        ? "bg-[#f5f0eb] border-[#C59F82] shadow-[0_10px_20px_rgba(0,0,0,0.3)] scale-105"
                        : "bg-[#496A49] border-[#264D52] hover:bg-[#f5f0eb] hover:border-[#C59F82] hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                      }
                    `}>
                      <div className="transform skew-x-[20deg] whitespace-nowrap">
                        <span className={`
                          font-black text-[11px] uppercase tracking-[0.2em] transition-colors duration-300
                          ${isActive
                            ? "text-[#264D52]"
                            : "text-[#f5f0eb] group-hover:text-[#264D52]"
                          }
                        `}>
                          {link.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 text-[#f5f0eb] bg-[#496A49] rounded-lg transform -skew-x-12 hover:bg-[#C59F82] transition-colors"
            >
              <div className="transform skew-x-12">
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden absolute w-full transition-all duration-500 ease-in-out ${mobileMenuOpen ? "max-h-screen opacity-100 border-t-4 border-[#496A49]" : "max-h-0 opacity-0 overflow-hidden"
        }`} style={{ backgroundColor: "#264D52" }}>
        <div className="px-6 py-10 space-y-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-8 py-5 rounded-lg font-black uppercase tracking-widest text-center transform -skew-x-6 transition-all ${isActive ? "bg-[#f5f0eb] text-[#264D52]" : "bg-[#496A49] text-[#f5f0eb]"
                  }`}
              >
                <div className="transform skew-x-6">{link.name}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}