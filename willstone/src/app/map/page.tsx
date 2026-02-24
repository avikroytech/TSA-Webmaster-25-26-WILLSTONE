import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import InteractiveMap from "@/components/map/InteractiveMap";

export default function MapPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col" style={{ minHeight: "calc(100vh - 160px)" }}>
                <InteractiveMap />
            </main>
            <Footer />
        </div>
    );
}