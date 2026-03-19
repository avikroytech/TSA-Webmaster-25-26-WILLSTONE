"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";

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
    path: Station[];
}

interface UniqueStation {
    name: string;
    x: number;
    y: number;
    routes: { name: string; color: string }[];
}

// ─── City silhouette (smooth cubic-bezier curves from reference images) ──
// viewBox is 0 0 1000 1000


// ─── Subway Data ────────────────────────────────────────────────────
const SUBWAY_ROUTES: Route[] = [
    {
        name: "Emerald Line",
        color: "#f97316", // Orange-Red
        stations: [
            { name: "Sentinel Peak", x: 220, y: 200 },
            { name: "West Interchange", x: 180, y: 300 },
            { name: "Summit Center", x: 720, y: 260 },
        ],
        path: [
            { x: 180, y: 300 },
            { x: 220, y: 200 },
            { x: 420, y: 250 },
            { x: 720, y: 260 },
        ],
    } as any,

    {
        name: "Central Loop",
        color: "#15803d", // Green (adjusted to match image better)
        stations: [
            { name: "West Interchange", x: 180, y: 300 },
            { name: "Mid Junction", x: 320, y: 520 },
            { name: "Southern Gate", x: 360, y: 780 },
            { name: "Deep South", x: 200, y: 870 },
        ],
        path: [
            { x: 180, y: 300 },
            { x: 250, y: 360 },
            { x: 320, y: 520 },
            { x: 320, y: 650 },
            { x: 360, y: 780 },
            { x: 300, y: 820 },
            { x: 200, y: 870 },
        ],
    } as any,

    {
        name: "Summit Shuttle",
        color: "#1d4ed8", // Blue
        stations: [
            { name: "Mid Junction", x: 320, y: 520 },
            { name: "East Hub", x: 720, y: 420 },
            { name: "Horizon Terminus", x: 820, y: 700 },
        ],
        path: [
            { x: 320, y: 520 },
            { x: 420, y: 460 },
            { x: 600, y: 450 },
            { x: 720, y: 420 },
            { x: 680, y: 520 },
            { x: 690, y: 650 },
            { x: 820, y: 700 },
        ],
    } as any,
];

// ─── Bus Data ───────────────────────────────────────────────────────
const BUS_ROUTES: Route[] = [
    {
        name: "Sentinel Loop",
        color: "#22c55e", // Green
        stations: [
            { name: "North Sentinel", x: 120, y: 180 },
            { name: "East Sentinel", x: 280, y: 150 },
            { name: "South Sentinel", x: 320, y: 280 },
        ],
        path: [
            { x: 120, y: 180 },
            { x: 190, y: 140 },
            { x: 280, y: 150 },
            { x: 250, y: 200 },
            { x: 320, y: 280 },
            { x: 250, y: 320 },
            { x: 150, y: 330 },
            { x: 120, y: 180 }
        ]
    } as any,
    {
        name: "Summit Circle",
        color: "#1e3a8a", // Dark Blue
        stations: [
            { name: "Summit West", x: 680, y: 220 },
            { name: "Summit Peak", x: 880, y: 350 },
            { name: "Summit South", x: 750, y: 420 },
        ],
        path: [
            { x: 680, y: 220 },
            { x: 780, y: 230 },
            { x: 880, y: 350 },
            { x: 830, y: 450 },
            { x: 750, y: 420 },
            { x: 720, y: 350 },
            { x: 680, y: 220 }
        ]
    } as any,
    {
        name: "Central Way",
        color: "#ef4444", // Red
        stations: [
            { name: "Central West", x: 250, y: 500 },
            { name: "Central East", x: 400, y: 540 },
            { name: "Central South", x: 250, y: 580 },
        ],
        path: [
            { x: 250, y: 500 },
            { x: 330, y: 480 },
            { x: 380, y: 500 },
            { x: 400, y: 540 },
            { x: 340, y: 560 },
            { x: 250, y: 580 },
            { x: 250, y: 500 }
        ]
    } as any,
    {
        name: "Horizon Express",
        color: "#06b6d4", // Light Blue
        stations: [
            { name: "Horizon West", x: 180, y: 800 },
            { name: "Horizon Bridge", x: 350, y: 820 },
            { name: "Horizon Center", x: 560, y: 750 },
            { name: "Horizon Arch", x: 680, y: 680 },
            { name: "Horizon East", x: 840, y: 740 },
        ],
        path: [
            { x: 180, y: 800 },
            { x: 250, y: 850 },
            { x: 350, y: 820 },
            { x: 450, y: 750 },
            { x: 530, y: 650 },
            { x: 560, y: 750 },
            { x: 680, y: 680 },
            { x: 780, y: 650 },
            { x: 840, y: 740 }
        ]
    },
];



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
                map.set(station.name, {
                    name: station.name,
                    x: station.x,
                    y: station.y,
                    routes: [{ name: route.name, color: route.color }],
                });
            }
        }
    }
    return Array.from(map.values());
}

// ─── Vehicle animation helpers ──────────────────────────────────────
interface VehiclePos {
    x: number;
    y: number;
    angle: number; // radians
    routeIndex: number;
}

interface VehicleInternal {
    segIndex: number;      // current segment (station pair) index
    segProgress: number;   // 0..1 along current segment
    paused: boolean;
    pauseRemaining: number; // ms left at station
    phaseOffset: number;    // initial offset along route (0..1)
}

const VEHICLE_SPEED = 80;     // SVG-units per second
const STATION_PAUSE = 1000;   // ms to pause at each station

function dist(a: Station, b: Station) {
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

function angleBetween(a: Station, b: Station) {
    return Math.atan2(b.y - a.y, b.x - a.x);
}

function vehicleCountForRoute(stationCount: number) {
    if (stationCount <= 3) return 1;
    if (stationCount <= 6) return 2;
    return 3;
}

function initVehicles(routes: Route[]): VehicleInternal[][] {
    return routes.map((route) => {
        const count = vehicleCountForRoute(route.stations.length);
        const segCount = route.stations.length - 1;
        if (segCount <= 0) return [];
        return Array.from({ length: count }, (_, i) => {
            // Spread vehicles evenly along the route
            const offset = i / count;
            const startSeg = Math.floor(offset * segCount);
            const startProgress = (offset * segCount) - startSeg;
            return {
                segIndex: startSeg,
                segProgress: startProgress,
                paused: false,
                pauseRemaining: 0,
                phaseOffset: offset,
            };
        });
    });
}

// ─── Component ──────────────────────────────────────────────────────
export default function InteractiveMap() {
    const [mode, setMode] = useState<MapMode>("subway");
    const [hoveredStation, setHoveredStation] = useState<string | null>(null);
    const [selectedRoutes, setSelectedRoutes] = useState<Set<string>>(new Set());
    const svgRef = useRef<SVGSVGElement>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const routes = mode === "subway" ? SUBWAY_ROUTES : BUS_ROUTES;
    const uniqueStations = useMemo(() => getUniqueStations(routes), [routes]);

    // Station names on the selected routes (for highlight/dim)
    const selectedRouteStations = useMemo(() => {
        if (selectedRoutes.size === 0) return null;
        const stationSet = new Set<string>();
        routes.forEach((r) => {
            if (selectedRoutes.has(r.name)) {
                r.stations.forEach((s) => stationSet.add(s.name));
            }
        });
        return stationSet;
    }, [routes, selectedRoutes]);

    // Clear selection when switching modes
    const handleModeChange = useCallback((newMode: MapMode) => {
        setMode(newMode);
        setSelectedRoutes(new Set());
    }, []);

    // ── Vehicle animation ────────────────────────────────────────
    const vehiclesRef = useRef<VehicleInternal[][]>([]);
    const animFrameRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const [vehiclePositions, setVehiclePositions] = useState<VehiclePos[]>([]);

    // Re-init vehicles when routes change
    useEffect(() => {
        vehiclesRef.current = initVehicles(routes);
        lastTimeRef.current = 0;
    }, [routes]);

    // Animation loop
    useEffect(() => {
        const tick = (timestamp: number) => {
            if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
            const dt = Math.min(timestamp - lastTimeRef.current, 100); // cap delta
            lastTimeRef.current = timestamp;

            const allPositions: VehiclePos[] = [];

            vehiclesRef.current.forEach((vehicleArr, ri) => {
                const route = routes[ri];
                if (!route) return;
                const rPath = (route as any).path || route.stations;
                if (rPath.length < 2) return;
                const segCount = rPath.length - 1;

                vehicleArr.forEach((v) => {
                    if (v.paused) {
                        v.pauseRemaining -= dt;
                        if (v.pauseRemaining <= 0) {
                            v.paused = false;
                            v.pauseRemaining = 0;
                        }
                    }

                    if (!v.paused) {
                        const rPath = (route as any).path || route.stations;
                        const from = rPath[v.segIndex];
                        const to = rPath[v.segIndex + 1];
                        const segLen = dist(from, to);
                        if (segLen > 0) {
                            const progressDelta = (VEHICLE_SPEED * (dt / 1000)) / segLen;
                            v.segProgress += progressDelta;
                        }

                        // Arrived at next station
                        if (v.segProgress >= 1) {
                            v.segProgress = 0;
                            v.segIndex = (v.segIndex + 1) % segCount;
                            // 50% chance to stop
                            if (Math.random() < 0.5) {
                                v.paused = true;
                                v.pauseRemaining = STATION_PAUSE;
                            }
                        }
                    }

                    // Interpolate position
                    const rPath = (route as any).path || route.stations;
                    const from = rPath[v.segIndex];
                    const to = rPath[v.segIndex + 1] ?? rPath[v.segIndex];
                    const x = from.x + (to.x - from.x) * v.segProgress;
                    const y = from.y + (to.y - from.y) * v.segProgress;
                    const angle = angleBetween(from, to);

                    allPositions.push({ x, y, angle, routeIndex: ri });
                });
            });

            setVehiclePositions(allPositions);
            animFrameRef.current = requestAnimationFrame(tick);
        };

        animFrameRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [routes]);

    const hoveredData = useMemo(
        () => uniqueStations.find((s) => s.name === hoveredStation) ?? null,
        [uniqueStations, hoveredStation]
    );

    const handleStationClick = useCallback(
        (stationName: string, svgX: number, svgY: number) => {
            if (hoveredStation === stationName) {
                setHoveredStation(null);
                return;
            }
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
        [hoveredStation]
    );

    return (
        <div className="relative w-full h-full flex flex-col bg-[#111827] overflow-hidden">
            {/* ── Map Area ─────────────────────────────────────────── */}
            <div className="flex-1 relative map-container overflow-hidden">
                {/* SVG Map */}
                <svg
                    ref={svgRef}
                    viewBox="0 0 1000 1000"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                    onClick={() => setHoveredStation(null)}
                >
                    {/* Background Map Image */}
                    <image
                        href="/img/full_map.png"
                        x="0"
                        y="0"
                        width="1000"
                        height="1000"
                        preserveAspectRatio="xMidYMid meet"
                        className="opacity-90"
                    />

                    {/* Route lines */}
                    {routes.map((route) => {
                        const hasSelection = selectedRoutes.size > 0;
                        const dimmed = hasSelection && !selectedRoutes.has(route.name);
                        return (
                            <polyline
                                key={route.name}
                                points={((route as any).path || route.stations)
                                    .map((s: any) => `${s.x},${s.y}`)
                                    .join(" ")}
                                fill="none"
                                stroke={dimmed ? "#555" : route.color}
                                strokeWidth={dimmed ? 3 : 6}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity={dimmed ? 0.2 : 1}
                                className="transition-all duration-300"
                            />
                        );
                    })}

                    {/* Deduplicated station dots */}
                    {uniqueStations.map((station) => {
                        const isSelected = hoveredStation === station.name;
                        const onSelectedRoute = selectedRouteStations === null || selectedRouteStations.has(station.name);
                        const dimmed = !onSelectedRoute;

                        return (
                            <g
                                key={station.name}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleStationClick(station.name, station.x, station.y);
                                }}
                                style={{ cursor: "pointer" }}
                                opacity={dimmed ? 0.18 : 1}
                                className="transition-opacity duration-300"
                            >
                                {/* Active ring */}
                                <circle
                                    cx={station.x}
                                    cy={station.y}
                                    r={isSelected ? 14 : 0}
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth="2"
                                    opacity={isSelected ? 0.8 : 0}
                                    style={{ transition: "r 0.2s, opacity 0.2s" }}
                                />
                                {/* Dot */}
                                <circle
                                    cx={station.x}
                                    cy={station.y}
                                    r={isSelected ? 10 : 8}
                                    fill={isSelected ? "#fff" : "#1e293b"}
                                    stroke="white"
                                    strokeWidth="2.5"
                                    style={{ transition: "r 0.2s ease-out, fill 0.2s" }}
                                />
                            </g>
                        );
                    })}

                    {/* Animated vehicles */}
                    {vehiclePositions.map((vp, i) => {
                        const route = routes[vp.routeIndex];
                        if (!route) return null;
                        const hasSelection = selectedRoutes.size > 0;
                        const dimmed = hasSelection && !selectedRoutes.has(route.name);
                        const angleDeg = (vp.angle * 180) / Math.PI;
                        const isBus = mode === "bus";
                        const w = isBus ? 14 : 18;
                        const h = isBus ? 9 : 10;
                        return (
                            <g
                                key={`vehicle-${i}`}
                                transform={`translate(${vp.x}, ${vp.y}) rotate(${angleDeg})`}
                                opacity={dimmed ? 0.15 : 1}
                                className="transition-opacity duration-300"
                                pointerEvents="none"
                            >
                                <rect
                                    x={-w / 2}
                                    y={-h / 2}
                                    width={w}
                                    height={h}
                                    rx={isBus ? 3 : 2}
                                    ry={isBus ? 3 : 2}
                                    fill={route.color}
                                    stroke="white"
                                    strokeWidth="1.5"
                                />
                                <rect
                                    x={w / 2 - (isBus ? 4 : 5)}
                                    y={-h / 2 + 1.5}
                                    width={isBus ? 3 : 4}
                                    height={h - 3}
                                    rx="1"
                                    fill="rgba(255,255,255,0.7)"
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* ── Click tooltip card (HTML overlay) ──────────── */}
                {hoveredData && (
                    <div
                        className="absolute z-30"
                        style={{
                            left: tooltipPos.x,
                            top: tooltipPos.y,
                            transform: "translate(-50%, -110%)",
                        }}
                    >
                        <div
                            className="bg-[#f8f5f0]/95 backdrop-blur-md border border-black/10 rounded-xl shadow-2xl p-4 min-w-[200px]"
                            style={{
                                animation: "fadeUp 0.2s ease-out forwards",
                            }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-sans font-black text-[#1f2937] uppercase tracking-wider">
                                    {hoveredData.name}
                                </h3>
                                <button
                                    onClick={() => setHoveredStation(null)}
                                    className="text-[#6b7280] hover:text-[#1f2937] transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {hoveredData.routes.map((r) => (
                                    <div key={r.name} className="flex items-center gap-3 bg-white/50 p-2 rounded-lg border border-black/5">
                                        <span
                                            className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.2)]"
                                            style={{ backgroundColor: r.color, boxShadow: `0 0 10px ${r.color}60` }}
                                        />
                                        <span className="text-xs font-bold text-[#374151]">
                                            {r.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {/* Arrow */}
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] w-3 h-3 bg-[#f8f5f0]/95 border-r border-b border-black/10 rotate-45" />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Bottom Controls ─────────────────────────────────── */}
            <div className="bg-[#f8f5f0] p-4 md:p-6 mx-4 md:mx-6 mb-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-8 border border-black/5 animate-in slide-in-from-bottom-5 duration-500">
                <div className="flex flex-col gap-4 min-w-fit">
                    {/* Instruction Note */}
                    <div className="flex flex-col gap-1 px-1">
                        <p className="text-sm font-black tracking-[0.1em] text-[#264D52]">Map Navigation</p>
                        <p className="text-xs font-bold text-[#1c2b2b]/60 leading-tight max-w-[280px]">
                            Select routes to highlight their paths. Switch between train and bus maps.
                        </p>
                    </div>

                    <div className="flex bg-[#1c2b2b]/10 p-1.5 rounded-xl h-12 shadow-inner w-full md:w-auto">
                        <button
                            onClick={() => handleModeChange("subway")}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 rounded-lg transition-all duration-300 font-bold text-[10px] md:text-xs uppercase tracking-wider ${mode === "subway"
                                ? "bg-[#264D52] text-white shadow-lg scale-[1.02]"
                                : "text-[#264D52]/60 hover:text-[#264D52] hover:bg-white/30"
                                }`}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v10h-2V7z" />
                            </svg>
                            Subway
                        </button>
                        <button
                            onClick={() => handleModeChange("bus")}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 rounded-lg transition-all duration-300 font-bold text-[10px] md:text-xs uppercase tracking-wider ${mode === "bus"
                                ? "bg-[#264D52] text-white shadow-lg scale-[1.02]"
                                : "text-[#264D52]/60 hover:text-[#264D52] hover:bg-white/30"
                                }`}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 11V7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h1c0 1.1.9 2 2 2s2-.9 2-2h6c0 1.1.9 2 2 2s2-.9 2-2h1c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM4 7h12v4H4V7zm1 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                            </svg>
                            Bus
                        </button>
                    </div>
                </div>

                <div className="flex-1 w-full flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar py-2 md:py-3 animate-in fade-in slide-in-from-right-4 duration-500">
                    {routes.map((route) => {
                        const isSelected = selectedRoutes.has(route.name);
                        return (
                            <button
                                key={route.name}
                                onClick={() => {
                                    const next = new Set(selectedRoutes);
                                    if (next.has(route.name)) {
                                        next.delete(route.name);
                                    } else {
                                        next.add(route.name);
                                    }
                                    setSelectedRoutes(next);
                                }}
                                className={`h-11 md:h-12 px-5 md:px-6 rounded-xl font-sans font-bold text-[10px] md:text-xs uppercase tracking-wider transition-all duration-300 shadow-sm whitespace-nowrap border-2 ${isSelected
                                    ? "bg-white ring-2 ring-offset-2 scale-[1.02]"
                                    : "hover:scale-[1.02] active:scale-[0.98]"
                                    }`}
                                style={{
                                    backgroundColor: isSelected ? "white" : route.color,
                                    borderColor: isSelected ? route.color : "transparent",
                                    color: isSelected ? route.color : "white",
                                    boxShadow: isSelected ? `0 4px 12px ${route.color}40` : "none"
                                }}
                            >
                                {route.name}
                            </button>
                        );
                    })}
                </div>
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
