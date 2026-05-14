import Footer from "@/components/home/Footer";
import InteractiveMap from "@/components/map/InteractiveMap";

export default function MapPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 min-h-[calc(100vh-76px)]">
                <InteractiveMap />
            </main>
            <Footer />
        </div>
    );
}
