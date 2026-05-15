import Calendar from "@/components/calendar/Calendar";
import Footer from "@/components/home/Footer";
import SubpageHero from "@/components/layout/SubpageHero";

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <SubpageHero
          title="Calendar"
          eyebrow="Events and meetings"
          description="Track city meetings, cultural events, seasonal programs, and neighborhood gatherings."
          image="/img/city-home2.jpg"
        />
        <section className="city-section city-section-tight">
          <div className="city-container">
            <Calendar />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
