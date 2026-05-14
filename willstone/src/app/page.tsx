import Hero from "@/components/home/Hero";
import SpotlightCarousel from "@/components/home/SpotlightCarousel";
import CalendarSection from "@/components/home/CalendarSection";
import Footer from "@/components/home/Footer";
import ImpactStats from "@/components/home/ImpactStats";
import NewsletterSignup from "@/components/home/NewsletterSignup";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero />
        <ImpactStats />
        <SpotlightCarousel />
        <CalendarSection />
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  );
}
