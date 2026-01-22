import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import RequestForm from "@/components/resource/RequestForm";

export default function Request() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-slate-950 p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8">Submit a Resource</h1>
                    <RequestForm />
                </div>
            </main>
            <Footer />
        </div>
    );
}