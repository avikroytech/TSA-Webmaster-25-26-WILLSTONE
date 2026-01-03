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
    { name: "Calendar", href: "/calendar" },
    { name: "Privacy", href: "/privacy" },
  ];

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Top Row: Brand & Primary Nav */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <span className="text-white font-black text-sm">W</span>
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase italic">
              Willstone
            </span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Middle Row: Contact Micro-pills */}
        <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-10 pb-10 border-b border-slate-900/50 text-[13px]">
          <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-white transition-colors">
            <Phone size={14} className="text-blue-500" />
            (123) 456-7890
          </a>
          <a href="mailto:info@willstone.gov" className="flex items-center gap-2 hover:text-white transition-colors">
            <Mail size={14} className="text-blue-500" />
            info@willstone.gov
          </a>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-blue-500" />
            123 Main St, Willstone
          </div>
        </div>

        {/* Bottom Row: Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-medium tracking-wider uppercase opacity-50">
            © {currentYear} Willstone Government. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <Link href="/accessibility" className="text-[11px] font-bold uppercase tracking-tighter hover:text-white">Accessibility</Link>
             <Link href="/reference" className="text-[11px] font-bold uppercase tracking-tighter hover:text-white">Reference</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}