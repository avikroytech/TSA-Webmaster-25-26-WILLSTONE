"use client";
import React from "react";
import Link from "next/link";

/**
 * Navbar Component
 * 
 * A sticky navigation bar that remains fixed at the top of the page when scrolling.
 * Features:
 * - Logo and site title on the left side
 * - Navigation links on the right side in the order: Resource Hub, Request Resource, Map, Calendar, Reference Page
 * - Professional styling appropriate for a government website
 * - Smooth transitions and hover effects
 * - Responsive design that adapts to different screen sizes
 */
export default function Navbar() {
  const navLinks = [
    { name: "Resource Hub", href: "/resource-hub" },
    { name: "Request Resource", href: "/request-resource" },
    { name: "Map", href: "/map" },
    { name: "Calendar", href: "/calendar" },
    { name: "Reference Page", href: "/reference" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title Section */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
            </div>
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Willstone
              </h1>
            </Link>
          </div>

          {/* Navigation Links Section */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 font-sans"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button (for future mobile menu implementation) */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Open main menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

