import Footer from "@/components/home/Footer";
import Calendar from "@/components/calendar/Calendar";
import SubpageHero from "@/components/layout/SubpageHero";

export default function CalendarPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex flex-col flex-1 min-h-0 bg-background pb-8">
                <SubpageHero
                    title="Calendar"
                    eyebrow="Events and meetings"
                    description="Track city meetings, cultural events, seasonal programs, and neighborhood gatherings."
                    image="/img/city-home2.jpg"
                />
                <div className="px-4 md:px-8">
                <div className="max-w-[1400px] mx-auto w-full flex-1 min-h-0 flex flex-col">
                    <Calendar />
                </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
