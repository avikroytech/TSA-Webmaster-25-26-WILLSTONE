import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Calendar from "@/components/calendar/Calendar";

export default function CalendarPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex flex-col flex-1 min-h-0 bg-background pt-24 pb-8 px-4 md:px-8">
                <div className="max-w-[1400px] mx-auto w-full flex-1 min-h-0 flex flex-col">
                    <Calendar />
                </div>
            </main>
            <Footer />
        </div>
    );
}