import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/home/Navbar";
import AppProviders from "@/components/layout/AppProviders";
import AccessibilityPanel from "@/components/ui/AccessibilityPanel";
import ChatAgent from "@/components/ui/ChatAgent";

export const metadata: Metadata = {
  title: {
    default: "Willstone City | Official Website",
    template: "%s | Willstone",
  },
  description: "Explore Willstone resources, events, guides, city services, and community stories in one accessible hub.",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen overflow-x-hidden"
      >
        <AppProviders>
          <a
            href="#main-content-wrapper"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[500] focus:rounded-full focus:bg-[var(--brand-medium)] focus:px-5 focus:py-3 focus:text-[var(--background)]"
          >
            Skip to main content
          </a>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div id="main-content-wrapper" className="flex-1 w-full transition-all duration-300 ease-in-out">
              {children}
            </div>
          </div>
          <AccessibilityPanel />
          <ChatAgent />
          <Analytics />
        </AppProviders>
      </body>
    </html>
  );
}
