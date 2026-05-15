"use client";

import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gavel,
  Heart,
  MapPin,
  Palette,
  ScanHeart,
  Utensils,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type CalendarEvent,
  type EventType,
  mockEvents,
} from "@/data/mockEvents";
import { supabase } from "@/utils/supabase/client";

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const EVENT_TYPES: EventType[] = ["CULTURAL", "CIVIC", "SOCIAL", "HEALTH"];
const EVENT_POPOVER_ID = "calendar-event-details";
const EVENT_POPOVER_WIDTH = 320;
const EVENT_POPOVER_MAX_HEIGHT = 352;
const EVENT_POPOVER_ESTIMATED_HEIGHT = 300;
const EVENT_POPOVER_GAP = 10;
const EVENT_POPOVER_MARGIN = 16;

const CATEGORY_STYLES: Record<
  EventType,
  { bg: string; text: string; iconBg: string; soft: string }
> = {
  CULTURAL: {
    bg: "bg-[#b98d63]",
    text: "text-white",
    iconBg: "bg-[#b98d63]",
    soft: "bg-[#b98d63]/12 text-[#7a5636] border-[#b98d63]/25",
  },
  CIVIC: {
    bg: "bg-[#173b3f]",
    text: "text-white",
    iconBg: "bg-[#173b3f]",
    soft: "bg-[#173b3f]/10 text-[#173b3f] border-[#173b3f]/20",
  },
  SOCIAL: {
    bg: "bg-[#d5b08c]",
    text: "text-[#173b3f]",
    iconBg: "bg-[#d5b08c]",
    soft: "bg-[#d5b08c]/18 text-[#6d4f31] border-[#d5b08c]/35",
  },
  HEALTH: {
    bg: "bg-[#496A49]",
    text: "text-white",
    iconBg: "bg-[#496A49]",
    soft: "bg-[#496A49]/12 text-[#365536] border-[#496A49]/25",
  },
};

const CATEGORY_NAMES: Record<EventType, string> = {
  CULTURAL: "Cultural",
  CIVIC: "Civic",
  SOCIAL: "Social",
  HEALTH: "Health",
};

type EventRow = {
  id: string | number;
  title?: string | null;
  date?: string | null;
  time?: string | null;
  address?: string | null;
  type?: string | null;
  virtual?: boolean | null;
  description?: string | null;
  image?: string | null;
  interested?: number | null;
};

type CalendarCell = {
  key: string;
  date: number | null;
  fullDateStr?: string;
  events: CalendarEvent[];
};

type EventPopoverPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

const isEventType = (value: string | null | undefined): value is EventType =>
  EVENT_TYPES.includes(value as EventType);

const clamp = (value: number, min: number, max: number) => {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
};

const getCategoryIcon = (type: EventType) => {
  if (type === "CULTURAL") return Palette;
  if (type === "CIVIC") return Gavel;
  if (type === "SOCIAL") return Utensils;
  if (type === "HEALTH") return ScanHeart;
  return CalendarIcon;
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [selectedCategories, setSelectedCategories] =
    useState<EventType[]>(EVENT_TYPES);
  const [virtualOnly, setVirtualOnly] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [interestedCounts, setInterestedCounts] = useState<
    Record<string, number>
  >({});
  const [userInterested, setUserInterested] = useState<Record<string, boolean>>(
    {},
  );
  const [isMonthSelectOpen, setIsMonthSelectOpen] = useState(false);
  const monthSelectRef = useRef<HTMLDivElement>(null);
  const calendarFrameRef = useRef<HTMLDivElement>(null);
  const eventPopoverRef = useRef<HTMLDivElement>(null);
  const eventButtonRefs = useRef<Record<string, HTMLButtonElement>>({});
  const [eventPopoverPosition, setEventPopoverPosition] =
    useState<EventPopoverPosition | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase.from("events").select("*");

      if (!error && data) {
        const mappedEvents: CalendarEvent[] = (data as EventRow[])
          .filter((item) => item.id && item.title && item.date)
          .map((item) => {
            const eventType = isEventType(item.type) ? item.type : "CIVIC";
            return {
              id: String(item.id),
              title: item.title || "City event",
              date: item.date || "",
              time: item.time || undefined,
              address: item.address || undefined,
              type: eventType,
              isVirtual: Boolean(item.virtual),
              description:
                item.description || "More event details will be posted soon.",
              imageUrl: item.image || undefined,
              interestedCount: item.interested || 0,
            };
          });
        setEvents(mappedEvents);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        monthSelectRef.current &&
        !monthSelectRef.current.contains(event.target as Node)
      ) {
        setIsMonthSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedEvent(null);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedEvent]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayStr = formatter.format(new Date());

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedEvent(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedEvent(null);
  };

  const toggleCategory = (category: EventType) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const toggleAllCategories = () => {
    setSelectedCategories((current) =>
      current.length === EVENT_TYPES.length ? [] : EVENT_TYPES,
    );
  };

  const handleInterested = (eventId: string, currentCount: number) => {
    const isInterested = userInterested[eventId];
    setUserInterested((current) => ({ ...current, [eventId]: !isInterested }));

    setInterestedCounts((current) => {
      const baseCount =
        current[eventId] !== undefined ? current[eventId] : currentCount;
      return {
        ...current,
        [eventId]: isInterested ? baseCount - 1 : baseCount + 1,
      };
    });
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarCells = useMemo(() => {
    const cells: CalendarCell[] = [];

    for (let index = 0; index < firstDayOfMonth; index++) {
      cells.push({ key: `empty-start-${index}`, date: null, events: [] });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const fullDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = events.filter((event) => {
        if (event.date !== fullDateStr) return false;
        if (!selectedCategories.includes(event.type)) return false;
        if (virtualOnly && !event.isVirtual) return false;
        return true;
      });
      cells.push({
        key: fullDateStr,
        date: day,
        fullDateStr,
        events: dayEvents,
      });
    }

    const remainingCells = 42 - cells.length;
    if (remainingCells < 7) {
      for (let index = 0; index < remainingCells; index++) {
        cells.push({ key: `empty-end-${index}`, date: null, events: [] });
      }
    } else if (cells.length % 7 !== 0) {
      const left = 7 - (cells.length % 7);
      for (let index = 0; index < left; index++) {
        cells.push({ key: `empty-fill-${index}`, date: null, events: [] });
      }
    }

    return cells;
  }, [
    currentYear,
    currentMonth,
    daysInMonth,
    firstDayOfMonth,
    selectedCategories,
    virtualOnly,
    events,
  ]);

  useEffect(() => {
    if (!selectedEvent) return;

    const isSelectedEventVisible = calendarCells.some((cell) =>
      cell.events.some((event) => event.id === selectedEvent.id),
    );

    if (!isSelectedEventVisible) {
      setSelectedEvent(null);
    }
  }, [calendarCells, selectedEvent]);

  const updateEventPopoverPosition = useCallback(() => {
    if (!selectedEvent) {
      setEventPopoverPosition(null);
      return;
    }

    const anchor = eventButtonRefs.current[selectedEvent.id];
    const frame = calendarFrameRef.current;
    if (!anchor || !frame) return;

    const anchorRect = anchor.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    const measuredHeight =
      eventPopoverRef.current?.getBoundingClientRect().height ||
      EVENT_POPOVER_ESTIMATED_HEIGHT;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const frameIsWideEnough =
      frameRect.width >= EVENT_POPOVER_WIDTH + EVENT_POPOVER_MARGIN * 2;
    const width = Math.min(
      EVENT_POPOVER_WIDTH,
      viewportWidth - EVENT_POPOVER_MARGIN * 2,
      frameIsWideEnough
        ? frameRect.width - EVENT_POPOVER_MARGIN * 2
        : EVENT_POPOVER_WIDTH,
    );
    const horizontalMin = frameIsWideEnough
      ? Math.max(EVENT_POPOVER_MARGIN, frameRect.left + EVENT_POPOVER_MARGIN)
      : EVENT_POPOVER_MARGIN;
    const horizontalMax = frameIsWideEnough
      ? Math.min(
          viewportWidth - EVENT_POPOVER_MARGIN,
          frameRect.right - EVENT_POPOVER_MARGIN,
        )
      : viewportWidth - EVENT_POPOVER_MARGIN;
    const preferredLeft = anchorRect.left + anchorRect.width / 2 - width / 2;
    const left = clamp(preferredLeft, horizontalMin, horizontalMax - width);
    const verticalMin = Math.max(
      EVENT_POPOVER_MARGIN,
      frameRect.top + EVENT_POPOVER_MARGIN,
    );
    const verticalMax = Math.min(
      viewportHeight - EVENT_POPOVER_MARGIN,
      frameRect.bottom - EVENT_POPOVER_MARGIN,
    );
    const availableHeight = Math.max(0, verticalMax - verticalMin);
    const maxHeight = Math.min(EVENT_POPOVER_MAX_HEIGHT, availableHeight);
    const popoverHeight = Math.min(measuredHeight, maxHeight);
    const topBelow = anchorRect.bottom + EVENT_POPOVER_GAP;
    const topAbove = anchorRect.top - popoverHeight - EVENT_POPOVER_GAP;
    const belowFits = topBelow + popoverHeight <= verticalMax;
    const aboveFits = topAbove >= verticalMin;
    const preferredTop = belowFits || !aboveFits ? topBelow : topAbove;
    const top = clamp(preferredTop, verticalMin, verticalMax - popoverHeight);

    setEventPopoverPosition({ top, left, width, maxHeight });
  }, [selectedEvent]);

  useLayoutEffect(() => {
    updateEventPopoverPosition();

    const animationFrame = window.requestAnimationFrame(
      updateEventPopoverPosition,
    );
    return () => window.cancelAnimationFrame(animationFrame);
  }, [updateEventPopoverPosition]);

  useEffect(() => {
    if (!selectedEvent) return;

    updateEventPopoverPosition();
    window.addEventListener("resize", updateEventPopoverPosition);
    window.addEventListener("scroll", updateEventPopoverPosition, true);

    return () => {
      window.removeEventListener("resize", updateEventPopoverPosition);
      window.removeEventListener("scroll", updateEventPopoverPosition, true);
    };
  }, [selectedEvent, updateEventPopoverPosition]);

  const selectedEventStyle = selectedEvent
    ? CATEGORY_STYLES[selectedEvent.type]
    : null;

  return (
    <div className="flex w-full flex-col gap-6 font-sans">
      <div className="flex flex-col gap-5 rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] p-4 shadow-sm md:flex-row md:items-center md:justify-between md:p-5">
        <div>
          <p className="city-kicker">City calendar</p>
          <h2 className="mt-1 font-display text-3xl font-black text-[#173b3f] md:text-4xl">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
        </div>

        <div className="relative z-50 flex w-full items-center gap-2 md:w-auto md:gap-3">
          <button
            type="button"
            onClick={prevMonth}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#ded6c9] bg-white text-[#173b3f] transition hover:border-[#173b3f] hover:bg-[#f8f4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63]"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          <div ref={monthSelectRef} className="relative z-50 flex-1 md:w-72">
            <button
              type="button"
              className="flex min-h-11 w-full items-center justify-between rounded-lg border border-[#173b3f] bg-[#173b3f] px-4 text-white transition hover:bg-[#3f6256] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63]"
              onClick={() => setIsMonthSelectOpen((value) => !value)}
              aria-haspopup="listbox"
              aria-expanded={isMonthSelectOpen}
            >
              <span className="font-display text-base font-black">
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <ChevronDown
                size={20}
                className={`text-white transition-transform duration-300 ${isMonthSelectOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isMonthSelectOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 grid max-h-[420px] overflow-hidden rounded-xl border border-[#173b3f]/15 bg-[#173b3f] shadow-xl md:grid-cols-[1fr_8rem]">
                <div className="min-h-0 overflow-y-auto border-b border-white/10 bg-[#173b3f] md:border-b-0 md:border-r">
                  <div className="city-label sticky top-0 z-10 bg-[#122f33] px-4 py-2 text-white/75">
                    Month
                  </div>
                  <div className="grid gap-1 p-2" role="listbox">
                    {MONTHS.map((month, index) => (
                      <button
                        type="button"
                        key={month}
                        role="option"
                        aria-selected={currentMonth === index}
                        className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                          currentMonth === index
                            ? "bg-[#d5b08c] text-[#173b3f]"
                            : "text-white/85 hover:bg-white/10 hover:text-white"
                        }`}
                        onClick={() => {
                          setCurrentDate(new Date(currentYear, index, 1));
                          setIsMonthSelectOpen(false);
                          setSelectedEvent(null);
                        }}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="min-h-0 overflow-y-auto bg-[#122f33]">
                  <div className="city-label sticky top-0 z-10 bg-[#0f2528] px-4 py-2 text-white/75">
                    Year
                  </div>
                  <div className="grid gap-1 p-2" role="listbox">
                    {Array.from({ length: 7 }).map((_, index) => {
                      const year = currentYear - 3 + index;
                      return (
                        <button
                          type="button"
                          key={year}
                          role="option"
                          aria-selected={currentYear === year}
                          className={`rounded-lg px-3 py-2 text-center text-sm font-semibold transition ${
                            currentYear === year
                              ? "bg-[#d5b08c] text-[#173b3f]"
                              : "text-white/85 hover:bg-white/10 hover:text-white"
                          }`}
                          onClick={() => {
                            setCurrentDate(new Date(year, currentMonth, 1));
                            setIsMonthSelectOpen(false);
                            setSelectedEvent(null);
                          }}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={nextMonth}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#ded6c9] bg-white text-[#173b3f] transition hover:border-[#173b3f] hover:bg-[#f8f4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63]"
            aria-label="Next month"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-col items-start gap-5 lg:flex-row">
        <div
          ref={calendarFrameRef}
          className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-[#ded6c9] bg-white shadow-sm"
        >
          <div className="grid shrink-0 grid-cols-7 border-b border-[#ded6c9] bg-[#fbfaf7]">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="city-label py-3 text-center text-[#48605b]"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#ded6c9]">
            <div className="grid w-full grid-cols-7 gap-px auto-rows-[minmax(104px,auto)] md:auto-rows-[minmax(136px,auto)]">
              {calendarCells.map((cell) => {
                const hasSelectedEvent = cell.events.some(
                  (event) => event.id === selectedEvent?.id,
                );
                const isToday = cell.fullDateStr === todayStr;

                return (
                  <div
                    key={cell.key}
                    className={`relative flex flex-col p-2 transition-colors ${
                      !cell.date
                        ? "bg-[#f5f0eb]/70"
                        : hasSelectedEvent
                          ? "z-30 bg-[#d5b08c]/15 ring-1 ring-inset ring-[#b98d63]/35"
                          : selectedEvent
                            ? "bg-white opacity-70"
                            : "bg-white hover:bg-[#f8f4ec]"
                    } ${isToday ? "ring-2 ring-inset ring-[#496A49]" : ""}`}
                  >
                    {cell.date && (
                      <span
                        className={`mb-2 ml-1 text-sm font-bold ${
                          isToday ? "text-[#496A49]" : "text-[#48605b]"
                        }`}
                      >
                        {cell.date}
                      </span>
                    )}
                    <div className="relative flex w-full flex-1 flex-col gap-1.5">
                      {cell.events.map((event) => {
                        const isExpanded = selectedEvent?.id === event.id;
                        const style = CATEGORY_STYLES[event.type];
                        const Icon = getCategoryIcon(event.type);

                        return (
                          <div
                            key={event.id}
                            className={`relative ${isExpanded ? "z-30" : "z-20"}`}
                          >
                            <button
                              ref={(button) => {
                                if (button) {
                                  eventButtonRefs.current[event.id] = button;
                                } else {
                                  delete eventButtonRefs.current[event.id];
                                }
                              }}
                              type="button"
                              onClick={(eventClick) => {
                                eventClick.stopPropagation();
                                setSelectedEvent(isExpanded ? null : event);
                              }}
                              className={`group flex w-full shrink-0 cursor-pointer items-center justify-center rounded-full px-2 py-1.5 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] md:block ${style.bg} ${style.text}`}
                              title={event.title}
                              aria-expanded={isExpanded}
                              aria-haspopup="dialog"
                              aria-controls={
                                isExpanded ? EVENT_POPOVER_ID : undefined
                              }
                            >
                              <div
                                className={`md:hidden ${event.title.length > 8 ? "block" : "hidden"}`}
                              >
                                <Icon size={14} strokeWidth={2.5} />
                              </div>
                              <div
                                className={`truncate px-1 text-center text-[10px] font-bold leading-tight md:text-left md:text-xs ${event.title.length > 8 ? "hidden md:block" : "block"}`}
                              >
                                {event.title}
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-5 font-sans lg:sticky lg:top-[128px] lg:w-[320px]">
          <div className="flex flex-col gap-5 rounded-2xl border border-[#ded6c9] bg-white p-5 shadow-sm">
            <div>
              <p className="city-kicker">Filter events</p>
              <h2 className="mt-1 font-display text-2xl font-black text-[#173b3f]">
                Event Type
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {EVENT_TYPES.map((type) => {
                const isSelected = selectedCategories.includes(type);
                const style = CATEGORY_STYLES[type];
                const Icon = getCategoryIcon(type);

                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => toggleCategory(type)}
                    aria-pressed={isSelected}
                    className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] ${
                      isSelected
                        ? "border-[#173b3f]/15 bg-[#f8f4ec] text-[#173b3f]"
                        : "border-[#ded6c9] bg-white text-[#48605b] hover:bg-[#f8f4ec]"
                    }`}
                    aria-label={`Toggle ${CATEGORY_NAMES[type]} events`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${isSelected ? style.iconBg : "bg-[#f5f0eb]"} ${isSelected ? "text-white" : "text-[#48605b]"}`}
                    >
                      <Icon size={20} strokeWidth={2.5} />
                    </span>
                    <span className="text-[11px] font-bold">
                      {CATEGORY_NAMES[type]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-2 border-t border-[#ded6c9] pt-4">
              <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg bg-[#f8f4ec] p-3 transition hover:bg-[#f5f0eb]">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={selectedCategories.length === EVENT_TYPES.length}
                  onChange={toggleAllCategories}
                />
                <span className="flex h-5 w-5 items-center justify-center rounded border border-[#173b3f]/25 bg-white peer-checked:border-[#496A49] peer-checked:bg-[#496A49]">
                  {selectedCategories.length === EVENT_TYPES.length && (
                    <Check size={14} className="text-white" strokeWidth={3} />
                  )}
                </span>
                <span className="text-sm font-bold text-[#173b3f]">
                  Select all categories
                </span>
              </label>

              <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-[#f8f4ec]">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={virtualOnly}
                  onChange={() => setVirtualOnly((value) => !value)}
                />
                <span className="flex h-5 w-5 items-center justify-center rounded border border-[#173b3f]/25 bg-white peer-checked:border-[#496A49] peer-checked:bg-[#496A49]">
                  {virtualOnly && (
                    <Check size={14} className="text-white" strokeWidth={3} />
                  )}
                </span>
                <span className="text-sm font-bold text-[#173b3f]">
                  Virtual events only
                </span>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-[#496A49]/20 bg-[#496A49]/10 p-5">
            <h3 className="font-display text-xl font-black text-[#496A49]">
              Submit or book an event
            </h3>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-[#496A49]/85">
              Contact the Willstone Event Coordination Office for venue bookings
              or event submissions.
            </p>
            <a
              href="mailto:events@willstone.gov"
              className="mt-4 inline-flex text-sm font-bold text-[#496A49] underline decoration-[#496A49]/40 underline-offset-4 transition hover:text-[#173b3f]"
            >
              events@willstone.gov
            </a>
          </div>
        </aside>
      </div>

      {selectedEvent && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[40] cursor-default"
            onClick={() => setSelectedEvent(null)}
            aria-label="Close event details"
          />
          {selectedEventStyle && eventPopoverPosition && (
            <div
              ref={eventPopoverRef}
              id={EVENT_POPOVER_ID}
              role="dialog"
              aria-modal="false"
              aria-labelledby={`${EVENT_POPOVER_ID}-title`}
              className="fixed z-[60] overflow-hidden rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] shadow-[0_18px_45px_rgba(23,59,63,0.16)]"
              style={{
                top: eventPopoverPosition.top,
                left: eventPopoverPosition.left,
                width: eventPopoverPosition.width,
                maxHeight: eventPopoverPosition.maxHeight,
              }}
            >
              <div className="flex max-h-full flex-col gap-3 p-4">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-bold ${selectedEventStyle.soft}`}
                  >
                    {CATEGORY_NAMES[selectedEvent.type]}
                  </span>
                  {selectedEvent.isVirtual && (
                    <span className="rounded-full border border-[#173b3f]/20 bg-[#173b3f]/10 px-2.5 py-1 text-xs font-bold text-[#173b3f]">
                      Virtual
                    </span>
                  )}
                </div>
                <div>
                  <h4
                    id={`${EVENT_POPOVER_ID}-title`}
                    className="line-clamp-2 font-display text-xl font-black leading-tight text-[#173b3f]"
                  >
                    {selectedEvent.title}
                  </h4>
                  <p className="mt-2 line-clamp-2 text-sm font-medium leading-relaxed text-[#48605b]">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-sm font-medium text-[#48605b]">
                  {selectedEvent.time && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="shrink-0 text-[#b98d63]" />
                      <span className="line-clamp-1">{selectedEvent.time}</span>
                    </div>
                  )}
                  {selectedEvent.address && (
                    <div className="flex items-start gap-2">
                      <MapPin
                        size={16}
                        className="mt-0.5 shrink-0 text-[#b98d63]"
                      />
                      <span className="line-clamp-2">
                        {selectedEvent.address}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#ded6c9] pt-3">
                  <button
                    type="button"
                    onClick={(eventClick) => {
                      eventClick.stopPropagation();
                      handleInterested(
                        selectedEvent.id,
                        selectedEvent.interestedCount || 0,
                      );
                    }}
                    className={`flex min-h-10 min-w-0 items-center gap-2 rounded-lg border px-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63] ${
                      userInterested[selectedEvent.id]
                        ? "border-[#b98d63]/30 bg-[#b98d63]/12 text-[#7a5636]"
                        : "border-[#ded6c9] bg-white text-[#173b3f] hover:border-[#173b3f]/25"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={`shrink-0 ${
                        userInterested[selectedEvent.id]
                          ? "fill-[#b98d63] text-[#b98d63]"
                          : ""
                      }`}
                    />
                    <span className="truncate">
                      {userInterested[selectedEvent.id]
                        ? "Interested"
                        : "I'm interested"}
                    </span>
                    <span className="rounded-md bg-[#f5f0eb] px-1.5">
                      {interestedCounts[selectedEvent.id] ??
                        selectedEvent.interestedCount ??
                        0}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="min-h-10 shrink-0 rounded-lg px-2 text-sm font-bold text-[#48605b] transition hover:text-[#173b3f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
