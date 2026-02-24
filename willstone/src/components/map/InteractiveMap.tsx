"use client";

import { useState, useMemo, useRef, useCallback } from "react";

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

interface UniqueStation {
    name: string;
    x: number;
    y: number;
    routes: { name: string; color: string }[];
    /** label offset direction: "right" | "left" | "above" | "below" */
    labelDir: "right" | "left" | "above" | "below";
}

// ─── City silhouette (smooth cubic-bezier curves from reference images) ──
// viewBox is 0 0 1000 1000
const CITY_OUTLINE = [
    "M 540 60",
    "C 565 65, 590 72, 610 80",
    "C 630 90, 645 105, 660 110",
    "C 680 100, 700 93, 720 95",
    "C 740 100, 752 118, 760 130",
    "C 775 132, 790 135, 800 140",
    "C 812 152, 822 164, 830 175",
    "C 845 188, 858 198, 870 210",
    "C 882 232, 892 250, 900 270",
    "C 908 290, 916 310, 920 330",
    "C 926 350, 932 365, 935 380",
    "C 938 395, 940 408, 940 420",
    "C 940 440, 936 455, 930 470",
    "C 926 485, 924 498, 920 510",
    "C 917 520, 914 530, 910 540",
    "C 903 548, 896 555, 890 560",
    "C 882 564, 876 566, 870 570",
    "C 866 580, 862 590, 860 600",
    "C 862 615, 868 628, 870 640",
    "C 868 655, 864 668, 860 680",
    "C 852 696, 842 708, 830 720",
    "C 816 732, 802 742, 790 750",
    "C 775 762, 762 772, 750 780",
    "C 735 792, 722 802, 710 810",
    "C 698 825, 688 838, 680 850",
    "C 672 862, 666 872, 660 880",
    "C 652 892, 646 902, 640 910",
    "C 630 918, 620 928, 610 930",
    "C 600 928, 590 924, 580 920",
    "C 565 908, 552 898, 540 890",
    "C 520 882, 505 876, 490 870",
    "C 470 862, 455 856, 440 850",
    "C 420 842, 405 836, 390 830",
    "C 370 816, 355 804, 340 790",
    "C 320 770, 305 755, 290 740",
    "C 275 724, 262 712, 250 700",
    "C 235 684, 222 672, 210 660",
    "C 195 644, 182 632, 170 620",
    "C 155 604, 142 592, 130 580",
    "C 118 564, 108 552, 100 540",
    "C 95 524, 90 512, 90 500",
    "C 90 484, 94 472, 100 460",
    "C 106 444, 112 432, 120 420",
    "C 130 404, 140 392, 150 380",
    "C 164 368, 178 358, 190 350",
    "C 204 342, 218 335, 230 330",
    "C 242 322, 252 316, 260 310",
    "C 272 298, 282 288, 290 280",
    "C 298 268, 304 258, 310 250",
    "C 320 238, 330 228, 340 220",
    "C 354 210, 368 200, 380 195",
    "C 394 184, 408 176, 420 170",
    "C 436 158, 448 148, 460 140",
    "C 475 128, 488 118, 500 110",
    "C 512 98, 522 88, 530 80",
    "C 534 72, 537 66, 540 60",
    "Z",
].join(" ");

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

// ─── Label positioning: custom overrides for stations that clip ─────
// Stations on the right edge get labels to the left, etc.
const LABEL_OVERRIDES: Record<string, "left" | "right" | "above" | "below"> = {
    // Subway
    "Eastgate": "left",
    "Commerce District": "left",
    "Lakeside": "left",
    "Northeast Heights": "left",
    "Airport Junction": "left",
    "South Terminal": "above",
    // Bus
    "Eastgate Pavillion": "left",
    "Briarwood": "left",
    "Tail's End": "above",
    "Highmark's Junction": "right",
};

// ─── Helper: deduplicate stations and compute routes per station ────
function getUniqueStations(routes: Route[]): UniqueStation[] {
    const map = new Map<string, UniqueStation>();
    for (const route of routes) {
        for (const station of route.stations) {
            const existing = map.get(station.name);
            if (existing) {
                if (!existing.routes.find((r) => r.name === route.name)) {
                    existing.routes.push({ name: route.name, color: route.color });
                }
            } else {
                const labelDir =
                    LABEL_OVERRIDES[station.name] ??
                    (station.x > 750 ? "left" : "right");
                map.set(station.name, {
                    name: station.name,
                    x: station.x,
                    y: station.y,
                    routes: [{ name: route.name, color: route.color }],
                    labelDir,
                });
            }
        }
    }
    return Array.from(map.values());
}

// ─── Label offset helpers ───────────────────────────────────────────
function labelOffset(dir: UniqueStation["labelDir"]) {
    switch (dir) {
        case "right":
            return { dx: 14, dy: 5, anchor: "start" as const };
        case "left":
            return { dx: -14, dy: 5, anchor: "end" as const };
        case "above":
            return { dx: 0, dy: -14, anchor: "middle" as const };
        case "below":
            return { dx: 0, dy: 22, anchor: "middle" as const };
    }
}

// ─── Component ──────────────────────────────────────────────────────
export default function InteractiveMap() {
    const [mode, setMode] = useState<MapMode>("subway");
    const [hoveredStation, setHoveredStation] = useState<string | null>(null);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const routes = mode === "subway" ? SUBWAY_ROUTES : BUS_ROUTES;
    const uniqueStations = useMemo(() => getUniqueStations(routes), [routes]);

    // Station names on the selected route (for highlight/dim)
    const selectedRouteStations = useMemo(() => {
        if (!selectedRoute) return null;
        const route = routes.find((r) => r.name === selectedRoute);
        if (!route) return null;
        return new Set(route.stations.map((s) => s.name));
    }, [routes, selectedRoute]);

    // Clear selection when switching modes
    const handleModeChange = useCallback((newMode: MapMode) => {
        setMode(newMode);
        setSelectedRoute(null);
    }, []);

    const hoveredData = useMemo(
        () => uniqueStations.find((s) => s.name === hoveredStation) ?? null,
        [uniqueStations, hoveredStation]
    );

    const handleStationHover = useCallback(
        (stationName: string, svgX: number, svgY: number) => {
            setHoveredStation(stationName);
            // Convert SVG coords to screen coords for the tooltip
            if (svgRef.current) {
                const svgEl = svgRef.current;
                const pt = svgEl.createSVGPoint();
                pt.x = svgX;
                pt.y = svgY;
                const ctm = svgEl.getScreenCTM();
                if (ctm) {
                    const screenPt = pt.matrixTransform(ctm);
                    // Get the map container's bounds to make tooltip relative
                    const containerRect = svgEl.closest(".map-container")?.getBoundingClientRect();
                    if (containerRect) {
                        setTooltipPos({
                            x: screenPt.x - containerRect.left,
                            y: screenPt.y - containerRect.top,
                        });
                    }
                }
            }
        },
        []
    );

    return (
        <div className="relative w-full flex" style={{ height: "100%", minHeight: 0 }}>
            {/* ── Legend Panel (left side) ─────────────────────────── */}
            <div className="w-56 shrink-0 bg-[#2D336B]/90 backdrop-blur-sm text-white p-5 flex flex-col gap-2 z-10 border-r-4 border-[#7886C7]">
                <h2 className="text-lg font-black uppercase tracking-[0.15em] mb-3 border-b-2 border-[#7886C7] pb-2">
                    {mode === "subway" ? "Subway Lines" : "Bus Routes"}
                </h2>
                {routes.map((route) => {
                    const isSelected = selectedRoute === route.name;
                    const isDimmed = selectedRoute !== null && !isSelected;
                    return (
                        <div
                            key={route.name}
                            onClick={() => setSelectedRoute(isSelected ? null : route.name)}
                            className={`flex items-center gap-3 py-2 px-2 -mx-2 rounded cursor-pointer transition-all duration-200 ${isSelected
                                    ? "bg-white/20 ring-1 ring-white/40"
                                    : isDimmed
                                        ? "opacity-40"
                                        : "hover:bg-white/10"
                                }`}
                        >
                            <span
                                className="w-5 h-5 rounded-sm shrink-0 border border-white/30"
                                style={{ backgroundColor: route.color }}
                            />
                            <span className="text-sm font-semibold tracking-wide leading-tight">
                                {route.name}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* ── Map Area ─────────────────────────────────────────── */}
            <div className="flex-1 relative bg-[#A9B5DF] overflow-hidden map-container">
                {/* Toggle buttons */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <button
                        onClick={() => handleModeChange("subway")}
                        className={`px-5 py-2.5 text-sm font-black uppercase tracking-[0.15em] transition-all duration-200 border-[3px] cursor-pointer ${mode === "subway"
                            ? "bg-[#2D336B] text-white border-[#2D336B] shadow-lg"
                            : "bg-white/80 text-[#2D336B] border-[#7886C7] hover:bg-white"
                            }`}
                    >
                        Subway
                    </button>
                    <button
                        onClick={() => handleModeChange("bus")}
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
                    ref={svgRef}
                    viewBox="0 0 1000 1000"
                    className="absolute inset-0 w-full h-full"
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
                    {routes.map((route) => {
                        const dimmed = selectedRoute !== null && selectedRoute !== route.name;
                        return (
                            <polyline
                                key={route.name}
                                points={route.stations
                                    .map((s) => `${s.x},${s.y}`)
                                    .join(" ")}
                                fill="none"
                                stroke={dimmed ? "#555" : route.color}
                                strokeWidth={dimmed ? 3 : 5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity={dimmed ? 0.18 : 1}
                                className="transition-all duration-300"
                            />
                        );
                    })}

                    {/* Deduplicated station dots */}
                    {uniqueStations.map((station) => {
                        const isHovered = hoveredStation === station.name;
                        const onSelectedRoute = selectedRouteStations === null || selectedRouteStations.has(station.name);
                        const dimmed = !onSelectedRoute;

                        return (
                            <g
                                key={station.name}
                                onMouseEnter={() =>
                                    handleStationHover(station.name, station.x, station.y)
                                }
                                onMouseLeave={() => setHoveredStation(null)}
                                style={{ cursor: "pointer" }}
                                opacity={dimmed ? 0.18 : 1}
                                className="transition-opacity duration-300"
                            >
                                {/* Hover ring (larger, subtle glow) */}
                                <circle
                                    cx={station.x}
                                    cy={station.y}
                                    r={isHovered ? 14 : 0}
                                    fill="none"
                                    stroke="#7886C7"
                                    strokeWidth="2"
                                    opacity={isHovered ? 0.5 : 0}
                                    style={{ transition: "r 0.2s, opacity 0.2s" }}
                                />
                                {/* Dot */}
                                <circle
                                    cx={station.x}
                                    cy={station.y}
                                    r={isHovered ? 10 : 6}
                                    fill={dimmed ? "#999" : "white"}
                                    stroke={dimmed ? "#555" : "#2D336B"}
                                    strokeWidth="2.5"
                                    style={{ transition: "r 0.2s ease-out" }}
                                />
                            </g>
                        );
                    })}

                    {/* Compass rose (bottom-left corner) */}
                    <g transform="translate(60, 890)">
                        <circle cx="0" cy="0" r="45" fill="rgba(255,255,255,0.6)" stroke="#2D336B" strokeWidth="3" />
                        {/* Cross lines */}
                        <line x1="0" y1="-38" x2="0" y2="38" stroke="#2D336B" strokeWidth="2.5" />
                        <line x1="-38" y1="0" x2="38" y2="0" stroke="#2D336B" strokeWidth="2.5" />
                        {/* Diagonal lines */}
                        <line x1="-22" y1="-22" x2="22" y2="22" stroke="#2D336B" strokeWidth="1" opacity="0.4" />
                        <line x1="22" y1="-22" x2="-22" y2="22" stroke="#2D336B" strokeWidth="1" opacity="0.4" />
                        {/* North arrow */}
                        <polygon points="0,-36 -6,-20 6,-20" fill="#E53935" />
                        <polygon points="0,36 -6,20 6,20" fill="#2D336B" opacity="0.5" />
                        {/* Labels */}
                        <text x="0" y="-52" textAnchor="middle" fontSize="22" fontWeight="900" fill="#2D336B">N</text>
                        <text x="0" y="68" textAnchor="middle" fontSize="22" fontWeight="900" fill="#2D336B">S</text>
                        <text x="58" y="8" textAnchor="middle" fontSize="22" fontWeight="900" fill="#2D336B">E</text>
                        <text x="-58" y="8" textAnchor="middle" fontSize="22" fontWeight="900" fill="#2D336B">W</text>
                    </g>
                </svg>

                {/* ── Hover tooltip card (HTML overlay) ──────────── */}
                {hoveredData && (
                    <div
                        className="absolute z-30 pointer-events-none"
                        style={{
                            left: tooltipPos.x,
                            top: tooltipPos.y,
                            transform: "translate(-50%, -110%)",
                        }}
                    >
                        <div
                            className="bg-white/95 backdrop-blur-sm border-2 border-[#2D336B] rounded-lg shadow-xl px-4 py-3 min-w-[180px]"
                            style={{
                                animation: "fadeUp 0.2s ease-out forwards",
                            }}
                        >
                            <h3 className="text-sm font-black text-[#2D336B] uppercase tracking-wider mb-2">
                                {hoveredData.name}
                            </h3>
                            <div className="flex flex-col gap-1">
                                {hoveredData.routes.map((r) => (
                                    <div key={r.name} className="flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-full shrink-0"
                                            style={{ backgroundColor: r.color }}
                                        />
                                        <span className="text-xs font-semibold text-[#2D336B]/80">
                                            {r.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {/* Arrow */}
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-3 h-3 bg-white/95 border-r-2 border-b-2 border-[#2D336B] rotate-45" />
                        </div>
                    </div>
                )}
            </div>

            {/* Tooltip animation keyframes */}
            <style>{`
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(6px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
