"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: "Home", href: "/" },
    { name: "Resource Hub", href: "/resource-hub" },
    { name: "Request a Resource", href: "/request" },
    { name: "Map", href: "/map" },
    { name: "Calendar", href: "/calendar" },
    { name: "News", href: "/news" },
    { name: "Guides", href: "/guides" },
    { name: "Government", href: "/government" },
    { name: "Reference", href: "/reference" },
  ];

  return (
    <footer className="w-full bg-[#C59F82] border-t border-[#1c2b2b]/10 text-[#1c2b2b] font-sans relative overflow-hidden py-10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <div className="relative w-10 h-10 transition-transform duration-500 group-hover:scale-110">
                <Image
                  src="/logo2.png"
                  alt="Willstone Logo"
                  fill
                  className="object-contain brightness-0"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-righteous text-[#0a1212] tracking-tight leading-none">
                  Willstone
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#264D52] max-w-xs leading-relaxed font-medium">
              Empowering our community with accessible resources, real-time updates, and essential services for a better tomorrow.
            </p>
          </div>

          {/* Links Column */}
          <div className="md:col-span-5">
            <h4 className="text-[#496A49] font-bold uppercase tracking-widest text-xs mb-6">Navigation</h4>
            <nav className="grid grid-cols-2 gap-x-6 gap-y-3">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group relative w-fit text-sm text-[#1c2b2b] hover:text-[#496A49] transition-colors duration-300 font-bold"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#264D52] transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3">
            <h4 className="text-[#496A49] font-bold uppercase tracking-widest text-xs mb-6">Contact Us</h4>
            <div className="space-y-4">
              <a href="tel:+1234567890" className="flex items-center gap-3 text-[#1c2b2b] hover:text-[#264D52] transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-[#264D52]/10 flex items-center justify-center group-hover:bg-[#264D52]/20 transition-colors border border-[#264D52]/20">
                  <Phone size={16} className="text-[#264D52]" />
                </div>
                <span className="text-sm font-bold tracking-wide">(123) 456-7890</span>
              </a>
              <a href="mailto:willstone.city@gmail.com" className="flex items-center gap-3 text-[#1c2b2b] hover:text-[#264D52] transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-[#264D52]/10 flex items-center justify-center group-hover:bg-[#264D52]/20 transition-colors border border-[#264D52]/20">
                  <Mail size={16} className="text-[#264D52]" />
                </div>
                <span className="text-sm font-bold tracking-wide">willstone.city@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#1c2b2b]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-[#496A49]">
            © {currentYear} City of Willstone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
