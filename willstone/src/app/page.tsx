import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import SpotlightCarousel from "@/components/home/SpotlightCarousel";
import CalendarSection from "@/components/home/CalendarSection";
import Footer from "@/components/home/Footer";

/**
 * Home Page Component
 * 
 * The main landing page of the Willstone website.
 * Composed of multiple sections:
 * 1. Navbar - Sticky navigation bar at the top
 * 2. Hero - Prominent landing section with welcome message
 * 3. SpotlightCarousel - Featured resources carousel
 * 4. CalendarSection - Upcoming events and calendar preview
 * 5. Footer - Site footer with links and information
 * 
 * All components are organized in the components/home directory
 * for better code organization and maintainability.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SpotlightCarousel />
        <CalendarSection />
      </main>
      <Footer />
    </div>
  );
}
