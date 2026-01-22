import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import RequestForm from "@/components/resource/RequestForm";

export default function Request() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-[#FFF2F2] p-8">
                <div className="max-w-2xl mx-auto">
                    <RequestForm />
                </div>
            </main>
            <Footer />
        </div>
    );
}