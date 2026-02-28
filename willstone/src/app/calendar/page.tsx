import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Calendar from "@/components/calendar/Calendar";

export default function CalendarPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 min-h-0 bg-[#FAFAFA] py-10 px-4 md:px-8">
                <div className="max-w-7xl mx-auto mb-10">
                    <h1 className="text-4xl md:text-6xl text-center font-black uppercase text-[#2D336B] tracking-tighter">
                        City Calendar
                    </h1>
                </div>
                <Calendar />
            </main>
            <Footer />
        </div>
    );
}