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
        className={`${andadaPro.variable} ${righteous.variable} antialiased`}
      >
        {children}
        <ChatAgent />
        <Analytics />
      </body>
    </html>
  );
}
