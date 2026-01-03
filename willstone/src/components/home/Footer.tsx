import React from "react";
import Link from "next/link";

/**
 * Footer Component
 * 
 * A standard footer component for the website that includes:
 * - Copyright information
 * - Important links and resources
 * - Contact information
 * - Social media links (if applicable)
 * - Professional styling appropriate for a government website
 * 
 * Features:
 * - Responsive design that adapts to different screen sizes
 * - Organized into logical sections (Links, Contact, Legal)
 * - Clean and professional appearance
 * - Accessible navigation and structure
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-900 text-gray-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/resource-hub"
                  className="hover:text-white transition-colors duration-200"
                >
                  Resource Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/request-resource"
                  className="hover:text-white transition-colors duration-200"
                >
                  Request Resource
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="hover:text-white transition-colors duration-200"
                >
                  Map
                </Link>
              </li>
              <li>
                <Link
                  href="/calendar"
                  className="hover:text-white transition-colors duration-200"
                >
                  Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">Phone:</span>{" "}
                <a
                  href="tel:+1234567890"
                  className="hover:text-white transition-colors duration-200"
                >
                  (123) 456-7890
                </a>
              </li>
              <li>
                <span className="text-gray-400">Email:</span>{" "}
                <a
                  href="mailto:info@willstone.gov"
                  className="hover:text-white transition-colors duration-200"
                >
                  info@willstone.gov
                </a>
              </li>
              <li className="pt-2">
                <span className="text-gray-400">Address:</span>
                <p className="mt-1">
                  123 Main Street
                  <br />
                  Willstone, ST 12345
                </p>
              </li>
            </ul>
          </div>

          {/* Legal & Information Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="hover:text-white transition-colors duration-200"
                >
                  Accessibility
                </Link>
              </li>
              <li>
                <Link
                  href="/reference"
                  className="hover:text-white transition-colors duration-200"
                >
                  Reference Page
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Willstone. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Serving our community with integrity and excellence.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

