'use client';

import { useEffect, useState, useMemo } from "react";
import Footer from "@/components/home/Footer";
import RequestForm from "@/components/resource/RequestForm";
import SubpageHero from "@/components/layout/SubpageHero";

export default function Request() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Subtle parallax effect tracking mouse
            const x = (e.clientX / window.innerWidth - 0.5) * -40;
            const y = (e.clientY / window.innerHeight - 0.5) * -40;
            setMousePos({ x, y });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const backgroundPosition = useMemo(() => `${50 + mousePos.x * 0.02}% ${50 + mousePos.y * 0.02}%`, [mousePos.x, mousePos.y]);

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#f5f0eb]">
            <SubpageHero
                title="Submit a Resource"
                eyebrow="Resident powered directory"
                description="Recommend a local service, nonprofit, program, or public facility for review by the Willstone team."
                image="/img/city-home2.jpg"
            />

            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-70"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at center, rgba(197,159,130,0.22) 0 4px, transparent 4px), radial-gradient(circle at center, rgba(112,172,144,0.14) 0 3px, transparent 3px)",
                    backgroundPosition,
                    backgroundSize: "42px 42px, 68px 68px",
                }}
            />

            <main className="flex-1 p-6 md:p-8 py-16 relative z-10 flex flex-col justify-center pointer-events-none">
                <div className="max-w-2xl w-full mx-auto relative group pointer-events-auto">
                    <div className="absolute -inset-6 bg-[#f5f0eb] rounded-3xl blur-2xl opacity-80 -z-10 pointer-events-none"></div>
                    <RequestForm />
                </div>
            </main>

            <div className="relative z-20 pointer-events-auto">
                <Footer />
            </div>
        </div >
    );
}
