"use client";
import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: "Resource Hub", href: "/resource-hub" },
    { name: "Request", href: "/request-resource" },
    { name: "Map", href: "/map" },
    { name: "Reference", href: "/reference" },
  ];

  return (
    <footer className="w-full bg-[#0A0C1A] border-t-4 border-[#2D336B] text-[#A9B5DF] font-sans relative overflow-hidden">
      {/* Subtle asphalt texture overlay to match the main sections */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/asphalt-dark.png')] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        
        {/* Top Row: Brand & Primary Nav */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-12">
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="w-10 h-10 bg-[#2D336B] border-2 border-[#7886C7] flex items-center justify-center shadow-[0_0_20px_rgba(120,134,199,0.3)] transition-all group-hover:bg-[#7886C7]">
              <span className="text-white font-black text-xl">W</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
                Willstone
              </span>
              <span className="text-[10px] font-bold text-[#7886C7] uppercase tracking-[0.4em] mt-1">
                Government
              </span>
            </div>
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-black uppercase tracking-[0.2em] text-white hover:text-[#7886C7] transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#7886C7] transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Middle Row: Contact Info with Theme Borders */}
        <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-12 pb-12 border-b border-[#2D336B]/50">
          <a href="tel:+1234567890" className="flex items-center gap-3 hover:text-white transition-colors group">
            <div className="p-2 bg-[#2D336B]/30 rounded-sm group-hover:bg-[#2D336B]">
                <Phone size={16} className="text-[#7886C7]" />
            </div>
            <span className="font-bold tracking-tight">(123) 456-7890</span>
          </a>
          <a href="mailto:info@willstone.gov" className="flex items-center gap-3 hover:text-white transition-colors group">
            <div className="p-2 bg-[#2D336B]/30 rounded-sm group-hover:bg-[#2D336B]">
                <Mail size={16} className="text-[#7886C7]" />
            </div>
            <span className="font-bold tracking-tight">info@willstone.gov</span>
          </a>
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-[#2D336B]/30 rounded-sm">
                <MapPin size={16} className="text-[#7886C7]" />
            </div>
            <span className="font-bold tracking-tight text-[#A9B5DF]">123 Main St, Willstone</span>
          </div>
        </div>

        {/* Bottom Row: Legal & Reference */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#A9B5DF]/40">
            © {currentYear} Willstone Government
          </p>
        </div>

      </div>
    </footer>
  );
}