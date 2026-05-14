"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Facebook, Instagram, Linkedin } from "lucide-react";

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
    { name: "References", href: "/reference" },
  ];

  const socials = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/willstonegov/" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/willstone" },
  ];

  return (
    <footer className="w-full bg-[#264D52] border-t border-white/5 text-[#f5f0eb]/80 font-sans relative overflow-hidden py-8">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-4 mb-6">
          {/* Brand & Social Column */}
          <div className="md:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center space-x-3 mb-3 group">
              <div className="relative w-9 h-9 transition-transform duration-500 group-hover:scale-110">
                <Image
                  src="/logo2.png"
                  alt="Willstone Logo"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="text-2xl font-righteous text-[#f5f0eb] tracking-tight leading-none">
                Willstone
              </span>
            </Link>
            <p className="text-xs text-[#f5f0eb]/60 max-w-xs leading-relaxed font-medium mb-4">
              Empowering our community with accessible resources and essential services.
            </p>
            <div className="flex space-x-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#C59F82] transition-colors"
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Compact Nav Column */}
          <div className="md:col-span-5 flex flex-col">
            <h4 className="text-[#C59F82] font-bold uppercase tracking-widest text-[10px] mb-4">Navigation</h4>
            <nav className="grid grid-cols-2 gap-x-2 gap-y-2 max-w-[280px]">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group relative w-fit text-xs text-[#f5f0eb]/70 hover:text-white transition-colors duration-300 font-medium"
                >
                  {link.name}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#C59F82] transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3">
            <h4 className="text-[#C59F82] font-bold uppercase tracking-widest text-[10px] mb-4">Contact City Office</h4>
            <div className="space-y-3">
              <a href="tel:+1234567890" className="flex items-center gap-2 text-xs text-[#f5f0eb]/70 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Phone size={14} className="text-[#C59F82]" />
                </div>
                <span className="font-bold tracking-wide">(123) 456-7890</span>
              </a>
              <a href="mailto:willstone.city@gmail.com" className="flex items-center gap-2 text-xs text-[#f5f0eb]/70 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Mail size={14} className="text-[#C59F82]" />
                </div>
                <span className="font-bold tracking-wide">willstone.city@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <p className="text-[10px] font-bold text-[#f5f0eb]/70">
            © {currentYear} City of Willstone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


