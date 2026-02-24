"use client";

import { useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────
type MapMode = "subway" | "bus";

interface Station {
    name: string;
    x: number;
    y: number;
}

interface Route {
    name: string;
    color: string;
    stations: Station[];
}

// ─── City silhouette (approximate SVG path from reference images) ───
// viewBox is 0 0 1000 1000
const CITY_OUTLINE =
    "M 540 60 " +
    "L 610 80 " +
    "L 660 110 " +
    "L 720 95 " +
    "L 760 130 " +
    "L 800 140 " +
    "L 830 175 " +
    "L 870 210 " +
    "L 900 270 " +
    "L 920 330 " +
    "L 935 380 " +
    "L 940 420 " +
    "L 930 470 " +
    "L 920 510 " +
    "L 910 540 " +
    "L 890 560 " +
    "L 870 570 " +
    "L 860 600 " +
    "L 870 640 " +
    "L 860 680 " +
    "L 830 720 " +
    "L 790 750 " +
    "L 750 780 " +
    "L 710 810 " +
    "L 680 850 " +
    "L 660 880 " +
    "L 640 910 " +
    "L 610 930 " +
    "L 580 920 " +
    "L 540 890 " +
    "L 490 870 " +
    "L 440 850 " +
    "L 390 830 " +
    "L 340 790 " +
    "L 290 740 " +
    "L 250 700 " +
    "L 210 660 " +
    "L 170 620 " +
    "L 130 580 " +
    "L 100 540 " +
    "L 90 500 " +
    "L 100 460 " +
    "L 120 420 " +
    "L 150 380 " +
    "L 190 350 " +
    "L 230 330 " +
    "L 260 310 " +
    "L 290 280 " +
    "L 310 250 " +
    "L 340 220 " +
    "L 380 195 " +
    "L 420 170 " +
    "L 460 140 " +
    "L 500 110 " +
    "L 530 80 " +
    "Z";

// ─── Subway Data ────────────────────────────────────────────────────
const SUBWAY_ROUTES: Route[] = [
    {
        name: "Central Line",
        color: "#E53935",
        stations: [
            { name: "North Point", x: 625, y: 140 },
            { name: "Metro Center", x: 640, y: 260 },
            { name: "Uptown", x: 560, y: 360 },
            { name: "Central Station", x: 580, y: 470 },
            { name: "Brookton", x: 520, y: 580 },
            { name: "The Terminal", x: 620, y: 660 },
            { name: "University Square", x: 620, y: 730 },
            { name: "South Terminal", x: 620, y: 850 },
        ],
    },
    {
        name: "Crosstown Line",
        color: "#2D336B",
        stations: [
            { name: "Westbrook", x: 170, y: 590 },
            { name: "Transit Plaza", x: 250, y: 570 },
            { name: "Riverside", x: 360, y: 600 },
            { name: "Brookton", x: 520, y: 580 },
            { name: "Commerce District", x: 740, y: 570 },
            { name: "Eastgate", x: 870, y: 570 },
        ],
    },
    {
        name: "Uptown Line",
        color: "#4CAF50",
        stations: [
            { name: "Southwest Park", x: 240, y: 640 },
            { name: "Memorial Plaza", x: 330, y: 530 },
            { name: "Hill Crest", x: 380, y: 470 },
            { name: "Union Square", x: 430, y: 420 },
            { name: "Garden District", x: 490, y: 380 },
            { name: "Uptown", x: 560, y: 360 },
            { name: "Metro Center", x: 640, y: 260 },
            { name: "Northeast Heights", x: 720, y: 190 },
        ],
    },
    {
        name: "West Hills Line",
        color: "#4DD0E1",
        stations: [
            { name: "Observatory Park", x: 370, y: 350 },
            { name: "Union Square", x: 430, y: 420 },
        ],
    },
    {
        name: "Garden Line",
        color: "#F48FB1",
        stations: [
            { name: "Garden District", x: 490, y: 380 },
            { name: "Central Station", x: 580, y: 470 },
            { name: "Airport Junction", x: 710, y: 430 },
            { name: "Lakeside", x: 800, y: 490 },
        ],
    },
];

// ─── Bus Data ───────────────────────────────────────────────────────
const BUS_ROUTES: Route[] = [
    {
        name: "Red Horizon Route",
        color: "#E53935",
        stations: [
            { name: "Falcon's Tip", x: 620, y: 155 },
            { name: "Juniper's Square", x: 680, y: 250 },
            { name: "Atlas Convergence", x: 540, y: 410 },
            { name: "Eastgate Pavillion", x: 830, y: 370 },
            { name: "Briarwood", x: 810, y: 490 },
            { name: "Slatebrook", x: 640, y: 530 },
            { name: "Tail's End", x: 620, y: 860 },
        ],
    },
    {
        name: "Ironclad Route",
        color: "#2D336B",
        stations: [
            { name: "Westgate Pavillion", x: 270, y: 440 },
            { name: "Driftwood's Pass", x: 340, y: 530 },
            { name: "Atlas Convergence", x: 540, y: 410 },
            { name: "Slatebrook", x: 640, y: 530 },
            { name: "Tail's End", x: 620, y: 860 },
        ],
    },
    {
        name: "Crosswind Route",
        color: "#4CAF50",
        stations: [
            { name: "Highmark's Junction", x: 140, y: 560 },
            { name: "Driftwood's Pass", x: 340, y: 530 },
            { name: "Copperstone", x: 340, y: 660 },
            { name: "Westgate Pavillion", x: 270, y: 440 },
            { name: "Moonrise", x: 430, y: 330 },
            { name: "Juniper's Square", x: 680, y: 250 },
        ],
    },
    {
        name: "Summit Route",
        color: "#4DD0E1",
        stations: [
            { name: "Moonrise", x: 430, y: 330 },
            { name: "Atlas Convergence", x: 540, y: 410 },
            { name: "Slatebrook", x: 640, y: 530 },
            { name: "Crestwall Sector", x: 580, y: 680 },
            { name: "Tail's End", x: 620, y: 860 },
        ],
    },
    {
        name: "Midpass Route",
        color: "#F48FB1",
        stations: [
            { name: "Westgate Pavillion", x: 270, y: 440 },
            { name: "Driftwood's Pass", x: 340, y: 530 },
            { name: "Slatebrook", x: 640, y: 530 },
            { name: "Briarwood", x: 810, y: 490 },
            { name: "Eastgate Pavillion", x: 830, y: 370 },
        ],
    },
];

// ─── Component ──────────────────────────────────────────────────────
export default function InteractiveMap() {
    const [mode, setMode] = useState<MapMode>("subway");

    const routes = mode === "subway" ? SUBWAY_ROUTES : BUS_ROUTES;

    return (
        <div className="relative w-full h-full flex">
            {/* ── Legend Panel (left side) ─────────────────────────── */}
            <div className="w-56 shrink-0 bg-[#2D336B]/90 backdrop-blur-sm text-white p-5 flex flex-col gap-2 z-10 border-r-4 border-[#7886C7]">
                <h2 className="text-lg font-black uppercase tracking-[0.15em] mb-3 border-b-2 border-[#7886C7] pb-2">
                    {mode === "subway" ? "Subway Lines" : "Bus Routes"}
                </h2>
                {routes.map((route) => (
                    <div key={route.name} className="flex items-center gap-3 py-1.5">
                        <span
                            className="w-5 h-5 rounded-sm shrink-0 border border-white/30"
                            style={{ backgroundColor: route.color }}
                        />
                        <span className="text-sm font-semibold tracking-wide leading-tight">
                            {route.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── Map Area ─────────────────────────────────────────── */}
            <div className="flex-1 relative bg-[#A9B5DF] overflow-hidden">
                {/* Toggle buttons */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <button
                        onClick={() => setMode("subway")}
                        className={`px-5 py-2.5 text-sm font-black uppercase tracking-[0.15em] transition-all duration-200 border-[3px] cursor-pointer ${mode === "subway"
                                ? "bg-[#2D336B] text-white border-[#2D336B] shadow-lg"
                                : "bg-white/80 text-[#2D336B] border-[#7886C7] hover:bg-white"
                            }`}
                    >
                        Subway
                    </button>
                    <button
                        onClick={() => setMode("bus")}
                        className={`px-5 py-2.5 text-sm font-black uppercase tracking-[0.15em] transition-all duration-200 border-[3px] cursor-pointer ${mode === "bus"
                                ? "bg-[#2D336B] text-white border-[#2D336B] shadow-lg"
                                : "bg-white/80 text-[#2D336B] border-[#7886C7] hover:bg-white"
                            }`}
                    >
                        Bus
                    </button>
                </div>

                {/* Title */}
                <div className="absolute top-4 right-6 z-20">
                    <h1 className="text-2xl md:text-3xl font-black text-[#2D336B] uppercase tracking-[0.1em] drop-shadow-sm">
                        {mode === "subway"
                            ? "Willstone Subway Map"
                            : "Willstone Bus Lines Map"}
                    </h1>
                </div>

                {/* SVG Map */}
                <svg
                    viewBox="0 0 1000 1000"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* City silhouette */}
                    <path
                        d={CITY_OUTLINE}
                        fill="#FAFAD2"
                        stroke="#2D336B"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />

                    {/* Route lines */}
                    {routes.map((route) => (
                        <polyline
                            key={route.name}
                            points={route.stations.map((s) => `${s.x},${s.y}`).join(" ")}
                            fill="none"
                            stroke={route.color}
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-opacity duration-300"
                        />
                    ))}

                    {/* Station dots and labels */}
                    {routes.map((route) =>
                        route.stations.map((station) => (
                            <g key={`${route.name}-${station.name}`}>
                                {/* Dot */}
                                <circle
                                    cx={station.x}
                                    cy={station.y}
                                    r="6"
                                    fill="white"
                                    stroke={route.color}
                                    strokeWidth="2.5"
                                />
                                {/* Label */}
                                <text
                                    x={station.x + 12}
                                    y={station.y + 4}
                                    fill="#2D336B"
                                    fontSize="13"
                                    fontWeight="700"
                                    fontFamily="system-ui, sans-serif"
                                    className="pointer-events-none select-none"
                                >
                                    {station.name}
                                </text>
                            </g>
                        ))
                    )}

                    {/* Compass rose (bottom-left) */}
                    <g transform="translate(120, 900)">
                        <circle cx="0" cy="0" r="30" fill="none" stroke="#2D336B" strokeWidth="2" />
                        <line x1="0" y1="-25" x2="0" y2="25" stroke="#2D336B" strokeWidth="1.5" />
                        <line x1="-25" y1="0" x2="25" y2="0" stroke="#2D336B" strokeWidth="1.5" />
                        <text x="0" y="-32" textAnchor="middle" fontSize="14" fontWeight="900" fill="#2D336B">N</text>
                        <text x="0" y="44" textAnchor="middle" fontSize="14" fontWeight="900" fill="#2D336B">S</text>
                        <text x="34" y="5" textAnchor="middle" fontSize="14" fontWeight="900" fill="#2D336B">E</text>
                        <text x="-34" y="5" textAnchor="middle" fontSize="14" fontWeight="900" fill="#2D336B">W</text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
