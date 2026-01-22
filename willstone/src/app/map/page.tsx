import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Image from "next/image";
import Link from "next/link";

export default function Request() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-[#FFF2F2] p-8 flex flex-col items-center justify-center">
                
                <div className="flex flex-col items-center gap-6">
                    {/* Image Container with Theme-Aligned Border */}
                        <div className="relative w-[300px] h-[400px] md:w-[450px] md:h-[300px] bg-white border-[6px] border-[#2D336B] shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                            <Image 
                                src="/train_map.png" 
                                alt="Willstone Train Line Map"
                                width={1200} 
                                height={1200}
                                className="h-auto w-auto max-w-full object-contain group-hover:opacity-90 transition-opacity"
                            />
                        </div>

                    {/* Label */}
                    <div className="text-center">
                        <h3 className="text-[#2D336B] font-black uppercase tracking-[0.25em] text-lg">
                            Train Line Map
                        </h3>
                        {/* Decorative accent line */}
                        <div className="h-1 w-12 bg-[#7886C7] mx-auto mt-2" />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                    {/* Image Container with Theme-Aligned Border */}
                        <div className="relative w-[300px] h-[400px] md:w-[450px] md:h-[300px] bg-white border-[6px] border-[#2D336B] shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                            <Image 
                                src="/bus_map.png" 
                                alt="Willstone Train Line Map"
                                width={1200} 
                                height={1200}
                                className="h-auto w-auto max-w-full object-contain group-hover:opacity-90 transition-opacity"
                            />
                        </div>

                    {/* Label */}
                    <div className="text-center">
                        <h3 className="text-[#2D336B] font-black uppercase tracking-[0.25em] text-lg">
                            Bus Route Map
                        </h3>
                        {/* Decorative accent line */}
                        <div className="h-1 w-12 bg-[#7886C7] mx-auto mt-2" />
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}