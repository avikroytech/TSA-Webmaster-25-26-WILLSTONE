import type { Metadata } from "next";
import { Andada_Pro, Righteous } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/home/Navbar";
import ChatAgent from "@/components/ui/ChatAgent";

const andadaPro = Andada_Pro({
  variable: "--font-andada",
  subsets: ["latin"],
  display: "swap",
});

const righteous = Righteous({
  variable: "--font-righteous",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Willstone",
  description: "This is a community resource hub for the Willstone community.",
  icons: {
    icon: "./favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${andadaPro.variable} ${righteous.variable} antialiased flex min-h-screen overflow-x-hidden`}
      >
        <div id="main-content-wrapper" className="flex-1 w-full transition-all duration-300 ease-in-out">
          {children}
        </div>
        <ChatAgent />
        <Analytics />
      </body>
    </html>
  );
}
