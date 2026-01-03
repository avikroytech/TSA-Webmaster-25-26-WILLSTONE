"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Resource Hub", href: "/resource-hub" },
    { name: "Request Resource", href: "/request-resource" },
    { name: "Map", href: "/map" },
    { name: "Calendar", href: "/calendar" },
    { name: "Reference Page", href: "/reference" },
  ];

  return (
    <nav 
      className={`sticky top-0 z-[100] w-full transition-all duration-300 border-b ${
        isScrolled 
          ? "bg-slate-950/80 backdrop-blur-md border-slate-800 shadow-2xl" 
          : "bg-slate-950 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo and Title Section */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <span className="text-white font-black text-xl tracking-tighter">W</span>
              </div>
              {/* Subtle pulse effect on logo */}
              <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-20 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">
              Willstone
            </h1>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 rounded-lg ${
                    isActive 
                      ? "text-blue-400" 
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden absolute w-full bg-slate-950 border-b border-slate-800 transition-all duration-300 ease-in-out ${
        mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}>
        <div className="px-6 py-8 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-bold text-slate-400 hover:text-blue-400 transition-colors uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}