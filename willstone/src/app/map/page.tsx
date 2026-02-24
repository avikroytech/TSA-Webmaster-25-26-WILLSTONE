import Navbar from "@/components/home/Navbar";
import InteractiveMap from "@/components/map/InteractiveMap";

export default function MapPage() {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 min-h-0">
                <InteractiveMap />
            </main>
        </div>
    );
}