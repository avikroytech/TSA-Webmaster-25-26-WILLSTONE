"use client";

import { Eye, EyeOff } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/utils/supabase/client";

// Types
type MapMode = "subway" | "bus";
type PinCategory = "Health" | "Education" | "Parks" | "Civic";

interface Station {
  name: string;
  x: number;
  y: number;
}

interface MapPoint {
  x: number;
  y: number;
}

interface Route {
  name: string;
  color: string;
  stations: Station[];
  path: MapPoint[];
}

interface UniqueStation {
  name: string;
  x: number;
  y: number;
  routes: { name: string; color: string }[];
}

interface DbResource {
  id: string | number;
  title?: string | null;
  slug?: string | null;
  category?: string | null;
}

interface ResourcePin {
  id: string;
  title: string;
  category: PinCategory;
  x: number;
  y: number;
  href: string;
}

const COLORS = {
  civicTeal: "#173b3f",
  harborGreen: "#3f6256",
  civicCopper: "#b98d63",
  meetingGold: "#d5b08c",
  parchment: "#f8f4ec",
  civicPaper: "#fbfaf7",
  softStone: "#f5f0eb",
  ruleStone: "#ded6c9",
  mutedText: "#48605b",
  water: "#dfe9e3",
};

const ISLAND_LABELS = [
  {
    name: "Emerald Island",
    x: 122,
    y: 94,
    width: 214,
    leader: "M196 106 C210 128 218 154 224 184",
  },
  {
    name: "Talon Island",
    x: 840,
    y: 126,
    width: 188,
    leader: "M804 142 C786 162 773 184 762 218",
  },
  {
    name: "Central Island",
    x: 116,
    y: 452,
    width: 202,
    leader: "M206 452 C238 448 270 448 300 462",
  },
  {
    name: "Coastal Island",
    x: 822,
    y: 760,
    width: 202,
    leader: "M780 748 C728 730 666 718 606 710",
  },
];

// City silhouette uses smooth cubic-bezier curves from reference images.
// viewBox is 0 0 1000 1000

// Subway data
const SUBWAY_ROUTES: Route[] = [
  {
    name: "Emerald Line",
    color: COLORS.harborGreen,
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
  },

  {
    name: "Central Loop",
    color: COLORS.civicTeal,
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
  },

  {
    name: "Summit Shuttle",
    color: COLORS.civicCopper,
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
  },
];

// Bus data
const BUS_ROUTES: Route[] = [
  {
    name: "Sentinel Loop",
    color: COLORS.harborGreen,
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
      { x: 120, y: 180 },
    ],
  },
  {
    name: "Summit Circle",
    color: COLORS.civicTeal,
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
      { x: 680, y: 220 },
    ],
  },
  {
    name: "Central Way",
    color: COLORS.civicCopper,
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
      { x: 250, y: 500 },
    ],
  },
  {
    name: "Horizon Express",
    color: "#6f8f86",
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
      { x: 840, y: 740 },
    ],
  },
];

const RESOURCE_PIN_LIMIT = 12;

const PIN_SLOTS: MapPoint[] = [
  { x: 220, y: 200 },
  { x: 245, y: 330 },
  { x: 725, y: 280 },
  { x: 720, y: 420 },
  { x: 320, y: 520 },
  { x: 305, y: 485 },
  { x: 760, y: 510 },
  { x: 610, y: 695 },
  { x: 360, y: 780 },
  { x: 350, y: 820 },
  { x: 820, y: 700 },
  { x: 210, y: 245 },
];

const PIN_COLORS: Record<PinCategory, string> = {
  Health: "#9f4f3f",
  Education: COLORS.civicTeal,
  Parks: COLORS.harborGreen,
  Civic: COLORS.civicCopper,
};

// Helper: deduplicate stations and compute routes per station.
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

// Vehicle animation helpers
interface VehiclePos {
  x: number;
  y: number;
  angle: number; // radians
  routeIndex: number;
  vehicleIndex: number;
}

interface VehicleInternal {
  segIndex: number; // current segment (station pair) index
  segProgress: number; // 0..1 along current segment
  paused: boolean;
  pauseRemaining: number; // ms left at station
  phaseOffset: number; // initial offset along route (0..1)
}

const VEHICLE_SPEED = 80; // SVG-units per second
const STATION_PAUSE = 1000; // ms to pause at each station

const PIN_LABEL_MAX_CHARS = 18;
const PIN_LABEL_MAX_LINES = 3;
const PIN_LABEL_LINE_HEIGHT = 16;
const PIN_LABEL_HORIZONTAL_PADDING = 24;
const PIN_LABEL_VERTICAL_PADDING = 14;

function splitLabelWord(word: string) {
  const parts: string[] = [];
  for (let index = 0; index < word.length; index += PIN_LABEL_MAX_CHARS) {
    parts.push(word.slice(index, index + PIN_LABEL_MAX_CHARS));
  }
  return parts;
}

function pinLabelLines(label: string) {
  const words = label.trim().split(/\s+/).flatMap(splitLabelWord);
  const lines: string[] = [];

  for (const word of words) {
    const current = lines.at(-1);
    if (!current) {
      lines.push(word);
    } else if (`${current} ${word}`.length <= PIN_LABEL_MAX_CHARS) {
      lines[lines.length - 1] = `${current} ${word}`;
    } else {
      lines.push(word);
    }
  }

  if (lines.length <= PIN_LABEL_MAX_LINES) {
    return lines;
  }

  const visibleLines = lines.slice(0, PIN_LABEL_MAX_LINES);
  const lastLine = visibleLines[PIN_LABEL_MAX_LINES - 1];
  visibleLines[PIN_LABEL_MAX_LINES - 1] =
    lastLine.length >= PIN_LABEL_MAX_CHARS
      ? `${lastLine.slice(0, PIN_LABEL_MAX_CHARS - 3)}...`
      : `${lastLine}...`;

  return visibleLines;
}

function pinLabelMetrics(label: string) {
  const lines = pinLabelLines(label);
  const longestLine = lines.reduce((longest, line) => {
    return Math.max(longest, line.length);
  }, 0);

  const width = Math.max(
    116,
    Math.min(196, longestLine * 9.4 + PIN_LABEL_HORIZONTAL_PADDING),
  );
  const height =
    lines.length * PIN_LABEL_LINE_HEIGHT + PIN_LABEL_VERTICAL_PADDING;

  return { height, lines, width };
}

function categoryForResource(resource: DbResource): PinCategory {
  const category = `${resource.category || ""}`.toLowerCase();
  if (
    category.includes("health") ||
    category.includes("safety") ||
    category.includes("medical")
  ) {
    return "Health";
  }
  if (
    category.includes("education") ||
    category.includes("library") ||
    category.includes("museum")
  ) {
    return "Education";
  }
  if (
    category.includes("park") ||
    category.includes("recreation") ||
    category.includes("wildlife")
  ) {
    return "Parks";
  }
  return "Civic";
}

function resourceHref(resource: DbResource) {
  return `/resource-hub/${resource.slug || resource.id}`;
}

function resourceTitle(resource: DbResource) {
  return resource.title?.trim() || "Community resource";
}

function dist(a: MapPoint, b: MapPoint) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

function angleBetween(a: MapPoint, b: MapPoint) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

function vehicleCountForRoute(stationCount: number) {
  if (stationCount <= 3) return 1;
  if (stationCount <= 6) return 2;
  return 3;
}

function initVehicles(routes: Route[]): VehicleInternal[][] {
  return routes.map((route) => {
    const count = vehicleCountForRoute(route.path.length);
    const segCount = route.path.length - 1;
    if (segCount <= 0) return [];
    return Array.from({ length: count }, (_, i) => {
      // Spread vehicles evenly along the route
      const offset = i / count;
      const startSeg = Math.floor(offset * segCount);
      const startProgress = offset * segCount - startSeg;
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

// Component
export default function InteractiveMap() {
  const [mode, setMode] = useState<MapMode>("subway");
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [selectedRoutes, setSelectedRoutes] = useState<Set<string>>(new Set());
  const [selectedPinCategory, setSelectedPinCategory] = useState<
    PinCategory | "All"
  >("All");
  const [showResourcePins, setShowResourcePins] = useState(true);
  const [resourcePins, setResourcePins] = useState<ResourcePin[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const routes = mode === "subway" ? SUBWAY_ROUTES : BUS_ROUTES;
  const uniqueStations = useMemo(() => getUniqueStations(routes), [routes]);
  const visiblePins = useMemo(
    () =>
      showResourcePins
        ? resourcePins.filter(
            (pin) =>
              selectedPinCategory === "All" ||
              pin.category === selectedPinCategory,
          )
        : [],
    [resourcePins, selectedPinCategory, showResourcePins],
  );
  const pinCategoryCounts = useMemo(() => {
    const counts: Record<PinCategory | "All", number> = {
      All: resourcePins.length,
      Health: 0,
      Education: 0,
      Parks: 0,
      Civic: 0,
    };
    resourcePins.forEach((pin) => {
      counts[pin.category] += 1;
    });
    return counts;
  }, [resourcePins]);

  useEffect(() => {
    let isMounted = true;

    async function fetchResourcePins() {
      const { data, error } = await supabase
        .from("community_resources")
        .select("id,title,slug,category")
        .limit(RESOURCE_PIN_LIMIT);

      if (!isMounted) return;

      if (error || !data) {
        console.warn("Unable to load map resource pins:", error);
        setResourcePins([]);
        return;
      }

      const pins = (data as DbResource[])
        .filter((resource) => resource.id && resourceTitle(resource))
        .slice(0, RESOURCE_PIN_LIMIT)
        .map((resource, index) => {
          const slot = PIN_SLOTS[index % PIN_SLOTS.length];
          return {
            id: String(resource.id),
            title: resourceTitle(resource),
            category: categoryForResource(resource),
            x: slot.x,
            y: slot.y,
            href: resourceHref(resource),
          };
        });

      setResourcePins(pins);
    }

    fetchResourcePins();

    return () => {
      isMounted = false;
    };
  }, []);

  // Station names on the selected routes (for highlight/dim)
  const selectedRouteStations = useMemo(() => {
    if (selectedRoutes.size === 0) return null;
    const stationSet = new Set<string>();
    routes.forEach((r) => {
      if (selectedRoutes.has(r.name)) {
        r.stations.forEach((s) => {
          stationSet.add(s.name);
        });
      }
    });
    return stationSet;
  }, [routes, selectedRoutes]);

  // Clear selection when switching modes
  const handleModeChange = useCallback((newMode: MapMode) => {
    setMode(newMode);
    setSelectedRoutes(new Set());
  }, []);

  // Vehicle animation
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
        const rPath = route.path;
        if (rPath.length < 2) return;
        const segCount = rPath.length - 1;

        vehicleArr.forEach((v, vehicleIndex) => {
          if (v.paused) {
            v.pauseRemaining -= dt;
            if (v.pauseRemaining <= 0) {
              v.paused = false;
              v.pauseRemaining = 0;
            }
          }

          if (!v.paused) {
            const rPath = route.path;
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
          const rPath = route.path;
          const from = rPath[v.segIndex];
          const to = rPath[v.segIndex + 1] ?? rPath[v.segIndex];
          const x = from.x + (to.x - from.x) * v.segProgress;
          const y = from.y + (to.y - from.y) * v.segProgress;
          const angle = angleBetween(from, to);

          allPositions.push({ x, y, angle, routeIndex: ri, vehicleIndex });
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
    [uniqueStations, hoveredStation],
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
          const containerRect = svgEl
            .closest(".map-container")
            ?.getBoundingClientRect();
          if (containerRect) {
            setTooltipPos({
              x: screenPt.x - containerRect.left,
              y: screenPt.y - containerRect.top,
            });
          }
        }
      }
    },
    [hoveredStation],
  );

  return (
    <div className="relative flex min-h-[calc(100vh-76px)] w-full flex-col overflow-hidden bg-[#dfe9e3]">
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(23,59,63,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(23,59,63,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
      {/* Map area */}
      <div className="map-container relative min-h-[58vh] flex-1 overflow-hidden md:min-h-[calc(100vh-238px)]">
        {/* SVG Map */}
        <svg
          ref={svgRef}
          viewBox="0 0 1000 1000"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          onClick={() => setHoveredStation(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setHoveredStation(null);
            }
          }}
          role="img"
          aria-label="Interactive Willstone transit and resource map"
        >
          <defs>
            <filter
              id="mapRouteShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="3"
                floodColor="#173b3f"
                floodOpacity="0.22"
              />
            </filter>
            <filter
              id="mapPinShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="4"
                floodColor="#173b3f"
                floodOpacity="0.22"
              />
            </filter>
          </defs>
          <rect x="0" y="0" width="1000" height="1000" fill={COLORS.water} />
          <path
            d="M52 156 C210 118 276 186 418 136 C574 82 720 112 932 72"
            fill="none"
            stroke="#173b3f"
            strokeDasharray="6 18"
            strokeLinecap="round"
            strokeWidth="2"
            opacity="0.16"
          />
          <path
            d="M78 892 C250 810 362 906 526 812 C658 736 806 808 944 742"
            fill="none"
            stroke="#173b3f"
            strokeDasharray="6 18"
            strokeLinecap="round"
            strokeWidth="2"
            opacity="0.16"
          />
          {/* Background Map Image */}
          <image
            href="/img/full_map.png"
            x="0"
            y="0"
            width="1000"
            height="1000"
            preserveAspectRatio="xMidYMid meet"
            className="opacity-95 saturate-[0.9]"
          />
          {ISLAND_LABELS.map((island) => (
            <g key={island.name} className="map-island-label">
              <path
                d={island.leader}
                fill="none"
                stroke={COLORS.civicTeal}
                strokeDasharray="3 10"
                strokeLinecap="round"
                strokeWidth="2.5"
                opacity="0.42"
              />
              <rect
                x={island.x - island.width / 2}
                y={island.y - 24}
                width={island.width}
                height="38"
                rx="8"
                fill={COLORS.civicPaper}
                stroke={COLORS.ruleStone}
                strokeWidth="1.5"
                opacity="0.94"
              />
              <text
                x={island.x}
                y={island.y}
                textAnchor="middle"
                className="pointer-events-none select-none fill-[#173b3f]"
                fontSize="22"
                fontWeight="900"
              >
                {island.name}
              </text>
            </g>
          ))}

          {/* Route lines */}
          {routes.map((route) => {
            const hasSelection = selectedRoutes.size > 0;
            const dimmed = hasSelection && !selectedRoutes.has(route.name);
            const points = route.path.map((s) => `${s.x},${s.y}`).join(" ");
            return (
              <g
                key={route.name}
                filter={dimmed ? undefined : "url(#mapRouteShadow)"}
              >
                <polyline
                  points={points}
                  fill="none"
                  stroke={COLORS.civicPaper}
                  strokeWidth={mode === "bus" ? 13 : 16}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={dimmed ? 0.14 : 0.92}
                  className="transition-all duration-300"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke={dimmed ? COLORS.mutedText : route.color}
                  strokeDasharray={mode === "bus" ? "1 18" : undefined}
                  strokeWidth={dimmed ? 4 : mode === "bus" ? 8 : 9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={dimmed ? 0.22 : 1}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}

          {/* Deduplicated station dots */}
          {uniqueStations.map((station) => {
            const isSelected = hoveredStation === station.name;
            const onSelectedRoute =
              selectedRouteStations === null ||
              selectedRouteStations.has(station.name);
            const dimmed = !onSelectedRoute;

            return (
              <a
                key={station.name}
                href={`#station-${station.name.toLowerCase().replaceAll(" ", "-")}`}
                aria-label={`${station.name} station`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStationClick(station.name, station.x, station.y);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleStationClick(station.name, station.x, station.y);
                  }
                }}
                style={{ cursor: "pointer", opacity: dimmed ? 0.18 : 1 }}
                className="transition-opacity duration-300"
              >
                {/* Active ring */}
                <circle
                  cx={station.x}
                  cy={station.y}
                  r={isSelected ? 14 : 0}
                  fill="none"
                  stroke={COLORS.civicPaper}
                  strokeWidth="2"
                  opacity={isSelected ? 0.8 : 0}
                  style={{ transition: "r 0.2s, opacity 0.2s" }}
                />
                {/* Dot */}
                <circle
                  cx={station.x}
                  cy={station.y}
                  r={isSelected ? 10 : 8}
                  fill={isSelected ? COLORS.civicPaper : COLORS.civicTeal}
                  stroke={COLORS.civicPaper}
                  strokeWidth="2.5"
                  style={{ transition: "r 0.2s ease-out, fill 0.2s" }}
                />
              </a>
            );
          })}

          {/* Color-coded resource pins */}
          {visiblePins.map((pin) => {
            const label = pinLabelMetrics(pin.title);
            const labelX = pin.x - label.width / 2;
            const labelY = pin.y - 27 - label.height;
            return (
              <a
                key={pin.id}
                href={pin.href}
                aria-label={`${pin.title}, ${pin.category} resource`}
                className="resource-pin"
              >
                <g filter="url(#mapPinShadow)">
                  <rect
                    x={labelX}
                    y={labelY}
                    width={label.width}
                    height={label.height}
                    rx="7"
                    fill={COLORS.civicPaper}
                    stroke={COLORS.ruleStone}
                    strokeWidth="1.5"
                    opacity="0.96"
                    className="map-pin-label"
                  />
                  <path
                    d={`M${pin.x - 9} ${pin.y - 27} L${pin.x} ${pin.y - 18} L${pin.x + 9} ${pin.y - 27}Z`}
                    fill={COLORS.civicPaper}
                    stroke={COLORS.ruleStone}
                    strokeWidth="1.5"
                    className="map-pin-label"
                  />
                  <circle
                    className="resource-pin-halo"
                    cx={pin.x}
                    cy={pin.y}
                    r="20"
                    fill={COLORS.civicPaper}
                    opacity="0.96"
                  />
                  <path
                    className="resource-pin-marker"
                    d={`M${pin.x} ${pin.y - 10} C${pin.x + 11} ${pin.y - 10} ${pin.x + 14} ${pin.y + 2} ${pin.x} ${pin.y + 18} C${pin.x - 14} ${pin.y + 2} ${pin.x - 11} ${pin.y - 10} ${pin.x} ${pin.y - 10}Z`}
                    fill={PIN_COLORS[pin.category]}
                    stroke={COLORS.civicPaper}
                    strokeWidth="3"
                  />
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r="4.5"
                    fill={COLORS.civicPaper}
                  />
                  <text
                    x={pin.x}
                    y={labelY + 18}
                    textAnchor="middle"
                    className="pointer-events-none select-none fill-[#173b3f] map-pin-label"
                    fontSize="17"
                    fontWeight="900"
                  >
                    {label.lines.map((line, lineIndex) => (
                      <tspan
                        key={`${pin.id}-label-${lineIndex}`}
                        x={pin.x}
                        dy={lineIndex === 0 ? 0 : PIN_LABEL_LINE_HEIGHT}
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              </a>
            );
          })}

          {/* Animated vehicles */}
          {vehiclePositions.map((vp) => {
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
                key={`${route.name}-vehicle-${vp.vehicleIndex}`}
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
                  stroke={COLORS.civicPaper}
                  strokeWidth="1.5"
                />
                <rect
                  x={w / 2 - (isBus ? 4 : 5)}
                  y={-h / 2 + 1.5}
                  width={isBus ? 3 : 4}
                  height={h - 3}
                  rx="1"
                  fill={COLORS.civicPaper}
                  opacity="0.78"
                />
              </g>
            );
          })}
        </svg>

        {/* Click tooltip card (HTML overlay) */}
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
              className="min-w-[200px] rounded-lg border border-[#173b3f]/15 bg-[#fbfaf7]/95 p-4 shadow-[0_22px_50px_rgba(23,59,63,0.22)] backdrop-blur-md"
              style={{
                animation: "fadeUp 0.2s ease-out forwards",
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-sans text-sm font-black uppercase tracking-wider text-[#173b3f]">
                  {hoveredData.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setHoveredStation(null)}
                  aria-label="Close station details"
                  className="rounded-md text-[#48605b] transition-colors hover:text-[#173b3f] focus:outline-none focus:ring-2 focus:ring-[#b98d63]"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {hoveredData.routes.map((r) => (
                  <div
                    key={r.name}
                    className="flex items-center gap-3 rounded-lg border border-[#173b3f]/10 bg-[#f8f4ec] p-2"
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.2)]"
                      style={{
                        backgroundColor: r.color,
                        boxShadow: `0 0 10px ${r.color}60`,
                      }}
                    />
                    <span className="text-xs font-bold text-[#173b3f]">
                      {r.name}
                    </span>
                  </div>
                ))}
              </div>
              {/* Arrow */}
              <div className="absolute -bottom-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-[#173b3f]/15 bg-[#fbfaf7]/95" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 mx-3 mb-3 flex flex-col gap-4 rounded-xl border border-[#173b3f]/12 bg-[#fbfaf7] p-3 shadow-[0_18px_45px_rgba(23,59,63,0.18)] md:mx-6 md:mb-6 md:p-5 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex min-w-fit flex-col gap-3">
          {/* Instruction Note */}
          <div className="flex flex-col gap-1 px-1">
            <p className="text-sm font-black tracking-[0.1em] text-[#173b3f]">
              Map Navigation
            </p>
            <p className="max-w-[320px] text-xs font-bold leading-snug text-[#48605b]">
              Highlight a route, filter service pins, or switch between transit
              and neighborhood coverage.
            </p>
          </div>

          <div className="inline-flex h-12 w-full rounded-lg border border-[#173b3f]/15 bg-[#173b3f]/8 p-1 md:w-fit">
            <button
              type="button"
              onClick={() => handleModeChange("subway")}
              aria-pressed={mode === "subway"}
              className={`flex h-full flex-1 items-center justify-center gap-2 rounded-md px-5 text-[11px] font-black uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#b98d63] md:flex-none ${
                mode === "subway"
                  ? "bg-[#173b3f] text-[#fbfaf7] shadow-sm"
                  : "text-[#173b3f]/65 hover:bg-[#fbfaf7]/70 hover:text-[#173b3f]"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v10h-2V7z" />
              </svg>
              Subway
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("bus")}
              aria-pressed={mode === "bus"}
              className={`flex h-full flex-1 items-center justify-center gap-2 rounded-md px-5 text-[11px] font-black uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#b98d63] md:flex-none ${
                mode === "bus"
                  ? "bg-[#173b3f] text-[#fbfaf7] shadow-sm"
                  : "text-[#173b3f]/65 hover:bg-[#fbfaf7]/70 hover:text-[#173b3f]"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18 11V7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h1c0 1.1.9 2 2 2s2-.9 2-2h6c0 1.1.9 2 2 2s2-.9 2-2h1c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM4 7h12v4H4V7zm1 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
              </svg>
              Bus
            </button>
          </div>
        </div>

        <div className="flex w-full flex-1 items-center gap-2 overflow-x-auto py-1 md:gap-3 md:py-3">
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
                type="button"
                aria-pressed={isSelected}
                className={`h-11 whitespace-nowrap rounded-lg border-2 px-4 font-sans text-[11px] font-black uppercase tracking-wider shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#b98d63] md:h-12 md:px-5 md:text-xs ${
                  isSelected
                    ? "scale-[1.02] bg-[#fbfaf7] ring-2 ring-offset-2"
                    : "hover:scale-[1.02] active:scale-[0.98]"
                }`}
                style={{
                  backgroundColor: isSelected ? COLORS.civicPaper : route.color,
                  borderColor: isSelected ? route.color : "transparent",
                  color: isSelected ? route.color : COLORS.civicPaper,
                  boxShadow: isSelected
                    ? `0 4px 12px ${route.color}40`
                    : "none",
                }}
              >
                {route.name}
              </button>
            );
          })}
        </div>

        <div className="flex w-full items-center gap-2 overflow-x-auto lg:w-auto">
          <button
            type="button"
            onClick={() => setShowResourcePins((visible) => !visible)}
            aria-pressed={showResourcePins}
            className={`flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-4 text-xs font-black uppercase tracking-wider transition focus:outline-none focus:ring-2 focus:ring-[#b98d63] ${
              showResourcePins
                ? "border-[#173b3f] bg-[#173b3f] text-[#fbfaf7]"
                : "border-[#173b3f]/15 bg-[#f8f4ec] text-[#173b3f] hover:bg-[#173b3f]/10"
            }`}
          >
            {showResourcePins ? (
              <Eye className="h-4 w-4" aria-hidden="true" />
            ) : (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            )}
            Pins
          </button>
          {(["All", "Health", "Education", "Parks", "Civic"] as const).map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedPinCategory(category)}
                aria-pressed={selectedPinCategory === category}
                disabled={!showResourcePins}
                className={`h-11 whitespace-nowrap rounded-lg border px-4 text-xs font-black uppercase tracking-wider transition focus:outline-none focus:ring-2 focus:ring-[#b98d63] disabled:cursor-not-allowed disabled:opacity-45 ${
                  showResourcePins && selectedPinCategory === category
                    ? "border-[#173b3f] bg-[#173b3f] text-[#fbfaf7]"
                    : "border-[#173b3f]/10 bg-[#f8f4ec] text-[#173b3f] hover:bg-[#173b3f]/10"
                }`}
              >
                {category}{" "}
                <span className="ml-1 opacity-70">
                  {pinCategoryCounts[category]}
                </span>
              </button>
            ),
          )}
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
                @media (max-width: 767px) {
                    .map-pin-label,
                    .map-island-label {
                        display: none;
                    }
                }
                .resource-pin-halo,
                .resource-pin-marker {
                    transform-box: fill-box;
                    transform-origin: center;
                    transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
                }
                .resource-pin:hover .resource-pin-halo,
                .resource-pin:focus .resource-pin-halo {
                    transform: scale(1.16);
                }
                .resource-pin:hover .resource-pin-marker,
                .resource-pin:focus .resource-pin-marker {
                    transform: scale(1.08);
                }
            `}</style>
    </div>
  );
}
