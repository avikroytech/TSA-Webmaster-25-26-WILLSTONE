'use client';

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import RequestForm from "@/components/resource/RequestForm";

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

    // Memoize the grid to prevent 1000+ divs from re-rendering on every mouse move
    const pebblesGrid = useMemo(() => {
        const rows = 40;
        const cols = 50;
        return Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="pebble-row">
                {Array.from({ length: cols }).map((_, c) => (
                    <div key={c} className="pebble"></div>
                ))}
            </div>
        ));
    }, []);

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#f5f0eb]">
            <Navbar />

            {/* Animated Pebble Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <style>{`
                    .idle-animated-wrapper {
                        animation: idle-drift 25s ease-in-out infinite alternate;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                    }
                    .pebble-container {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        justify-content: center;
                        align-items: center;
                    }
                    .pebble-row {
                        display: flex;
                        gap: 14px;
                        width: 100%;
                        justify-content: center;
                    }
                    .pebble-row:nth-child(even) {
                        transform: translateX(-22px); /* Offset to create organic pattern */
                    }
                    .pebble {
                        flex-shrink: 0;
                        width: 30px;
                        height: 25px;
                        background-color: #D4B08C; /* Sandy pebble color */
                        border-radius: 50%; /* Make it rounded like a pebble */
                        opacity: 0.15; /* Subtle by default */
                        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        pointer-events: auto; /* Enable hover on individual pebbles */
                    }
                    .pebble:nth-child(even) {
                        border-radius: 60% 40% 50% 50%; /* Add slight randomness to shape */
                        transform: rotate(15deg);
                    }
                    .pebble:nth-child(3n) {
                        border-radius: 40% 60% 40% 60%;
                        transform: rotate(-10deg);
                        background-color: #C59F82;
                    }
                    .pebble:hover {
                        transform: scale(1.4) translateY(-4px) !important;
                        background-color: #496A49; /* Pops with brand green to mimic beach grass/island flora */
                        opacity: 0.6;
                        box-shadow: 0 4px 12px rgba(45, 51, 107, 0.2);
                        z-index: 10;
                        transition-duration: 0.1s; /* Pop out faster, recede slower */
                    }
                    @keyframes idle-drift {
                        0% { transform: scale(1.1) translate(0px, 0px); }
                        100% { transform: scale(1.1) translate(-20px, -15px); }
                    }
                `}</style>

                <div className="idle-animated-wrapper">
                    <div
                        className="pebble-container"
                        style={{
                            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                            transition: "transform 0.1s ease-out",
                        }}
                    >
                        {pebblesGrid}
                    </div>
                </div>
            </div>

            <main className="flex-1 p-8 pt-32 pb-16 relative z-10 flex flex-col justify-center pointer-events-none">
                <div className="max-w-2xl w-full mx-auto relative group pointer-events-auto">
                    {/* Soft glow behind form to ensure readability */}
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