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
    const bricksGrid = useMemo(() => {
        const rows = 35;
        const cols = 35;
        return Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="brick-row">
                {Array.from({ length: cols }).map((_, c) => (
                    <div key={c} className="brick"></div>
                ))}
            </div>
        ));
    }, []);

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#FFF2F2]">
            <Navbar />

            {/* Animated Brick Background */}
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
                    .brick-container {
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                        justify-content: center;
                        align-items: center;
                    }
                    .brick-row {
                        display: flex;
                        gap: 6px;
                        width: 100%;
                        justify-content: center;
                    }
                    .brick-row:nth-child(even) {
                        transform: translateX(-43px); /* Offset to create brick pattern */
                    }
                    .brick {
                        flex-shrink: 0;
                        width: 80px;
                        height: 35px;
                        background-color: #A9B5DF;
                        border-radius: 4px;
                        opacity: 0.15; /* Subtle by default */
                        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        pointer-events: auto; /* Enable hover on individual bricks */
                    }
                    .brick:hover {
                        transform: scale(1.15) translateY(-2px);
                        background-color: #7886C7; /* Brand medium */
                        opacity: 0.5;
                        box-shadow: 0 4px 12px rgba(45, 51, 107, 0.15);
                        z-index: 10;
                        transition-duration: 0.1s; /* Pop out faster, recede slower */
                    }
                    @keyframes idle-drift {
                        0% { transform: scale(1.1) translate(0px, 0px); }
                        100% { transform: scale(1.1) translate(-30px, -20px); }
                    }
                `}</style>

                <div className="idle-animated-wrapper">
                    <div
                        className="brick-container"
                        style={{
                            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                            transition: "transform 0.1s ease-out",
                        }}
                    >
                        {bricksGrid}
                    </div>
                </div>
            </div>

            <main className="flex-1 p-8 py-16 relative z-10 flex flex-col justify-center pointer-events-none">
                <div className="max-w-2xl w-full mx-auto relative group pointer-events-auto">
                    {/* Soft glow behind form to ensure readability */}
                    <div className="absolute -inset-6 bg-[#FFF2F2] rounded-3xl blur-2xl opacity-80 -z-10 pointer-events-none"></div>
                    <RequestForm />
                </div>
            </main>

            <div className="relative z-20 pointer-events-auto">
                <Footer />
            </div>
        </div >
    );
}