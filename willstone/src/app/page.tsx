import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import SpotlightCarousel from "@/components/home/SpotlightCarousel";
import CalendarSection from "@/components/home/CalendarSection";
import Footer from "@/components/home/Footer";

export default function Request() {
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
