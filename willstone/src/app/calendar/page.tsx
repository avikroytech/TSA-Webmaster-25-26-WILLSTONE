import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Calendar from "@/components/calendar/Calendar";

export default function CalendarPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex flex-col flex-1 min-h-0 bg-[#FAFAFA] pt-6 pb-6 px-4 md:px-8">
                <div className="max-w-7xl mx-auto w-full mb-6 flex-shrink-0">
                    <h1 className="text-3xl md:text-5xl font-black uppercase text-[#264D52] tracking-tighter text-center">
                        Calendar
                    </h1>
                </div>
                <div className="max-w-7xl mx-auto w-full flex-1 min-h-0 flex flex-col">
                    <Calendar />
                </div>
            </main>
            <Footer />
        </div>
    );
}