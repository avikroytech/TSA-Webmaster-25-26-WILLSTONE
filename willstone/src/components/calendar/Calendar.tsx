"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Check, Calendar as CalendarIcon, Heart, ScanHeart, Gavel, Utensils, Palette, ChevronDown } from 'lucide-react';
import { CalendarEvent, EventType } from '@/data/mockEvents';
import { supabase } from '@/utils/supabase/client';

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const CATEGORY_STYLES: Record<EventType, { bg: string; text: string; iconBg: string }> = {
    CULTURAL: { bg: 'bg-[#70AC90]', text: 'text-white', iconBg: 'bg-[#70AC90]' },
    CIVIC: { bg: 'bg-[#264D52]', text: 'text-white', iconBg: 'bg-[#264D52]' },
    SOCIAL: { bg: 'bg-[#C59F82]/30', text: 'text-[#C59F82]', iconBg: 'bg-[#C59F82]' },
    HEALTH: { bg: 'bg-[#496A49]', text: 'text-white', iconBg: 'bg-[#496A49]' },
};

const CATEGORY_NAMES: Record<EventType, string> = {
    CULTURAL: 'CULTURAL',
    CIVIC: 'CIVIC',
    SOCIAL: 'SOCIAL',
    HEALTH: 'HEALTH',
};

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Start at Feb 2026 per mock data
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<EventType[]>(['CULTURAL', 'CIVIC', 'SOCIAL', 'HEALTH']);
    const [virtualOnly, setVirtualOnly] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    // Track interested counts locally to mock interaction
    const [interestedCounts, setInterestedCounts] = useState<Record<string, number>>({});
    const [userInterested, setUserInterested] = useState<Record<string, boolean>>({});

    const [isMonthSelectOpen, setIsMonthSelectOpen] = useState(false);
    const monthSelectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchEvents() {
            const { data, error } = await supabase
                .from("events")
                .select("*");

            if (!error && data) {
                const mappedEvents: CalendarEvent[] = data.map((item: any) => ({
                    id: item.id.toString(),
                    title: item.title,
                    date: item.date,
                    time: item.time,
                    address: item.address,
                    type: item.type as EventType,
                    isVirtual: item.virtual,
                    description: item.description,
                    imageUrl: item.image,
                    interestedCount: item.interested
                }));
                setEvents(mappedEvents);
            }
        }
        fetchEvents();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (monthSelectRef.current && !monthSelectRef.current.contains(event.target as Node)) {
                setIsMonthSelectOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const todayStr = formatter.format(new Date());

    // Navigation handlers
    const prevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const toggleCategory = (category: EventType) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const toggleAllCategories = () => {
        if (selectedCategories.length === 4) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(['CULTURAL', 'CIVIC', 'SOCIAL', 'HEALTH']);
        }
    };

    const handleInterested = (eventId: string, currentCount: number) => {
        const isInterested = userInterested[eventId];
        setUserInterested(prev => ({ ...prev, [eventId]: !isInterested }));

        setInterestedCounts(prev => {
            const baseCount = prev[eventId] !== undefined ? prev[eventId] : currentCount;
            return {
                ...prev,
                [eventId]: isInterested ? baseCount - 1 : baseCount + 1
            };
        });
    };

    // Calendar Math
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Create grid cells
    const calendarCells = useMemo(() => {
        const cells: { date: number | null, fullDateStr?: string, events: CalendarEvent[] }[] = [];

        // Empty cells
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push({ date: null, events: [] });
        }

        // Day cells
        for (let i = 1; i <= daysInMonth; i++) {
            const fullDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayEvents = events.filter(e => {
                if (e.date !== fullDateStr) return false;
                if (!selectedCategories.includes(e.type)) return false;
                if (virtualOnly && !e.isVirtual) return false;
                return true;
            });
            cells.push({ date: i, fullDateStr, events: dayEvents });
        }

        // Filling the rest of the last row
        const remainingCells = 42 - cells.length; // 6 rows * 7 columns
        if (remainingCells < 7) {
            for (let i = 0; i < remainingCells; i++) {
                cells.push({ date: null, events: [] });
            }
        } else if (cells.length % 7 !== 0) {
            const left = 7 - (cells.length % 7);
            for (let i = 0; i < left; i++) {
                cells.push({ date: null, events: [] });
            }
        }

        return cells;
    }, [currentYear, currentMonth, daysInMonth, firstDayOfMonth, selectedCategories, virtualOnly, events]);

    return (
        <div className="w-full flex-1 min-h-0 flex flex-col font-sans mb-12">
            {/* Header row: "City Calendar" + Navigation */}
            <div className="flex flex-col md:flex-row justify-center items-start md:items-center mb-6 gap-4">
                <h1 className="text-4xl md:text-5xl font-black text-center text-[#264D52] font-display">
                    Calendar
                </h1>

                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto shrink-0 relative z-50">
                    <button
                        onClick={prevMonth}
                        className="p-3 bg-white hover:bg-[#FAFAFA] transition-all duration-300 text-gray-800 rounded-xl shadow-sm border border-gray-100 cursor-pointer outline-none hover:shadow-md hover:-translate-x-1"
                        aria-label="Previous Month"
                    >
                        <ChevronLeft size={20} strokeWidth={2.5} />
                    </button>

                    <div ref={monthSelectRef} className="relative z-50 flex-1 md:w-64">
                        <div
                            className="w-full px-4 py-3 bg-[#264D52] border-2 border-[#264D52] rounded-xl text-white focus:outline-none focus:border-[#496A49] focus:ring-1 focus:ring-[#496A49] transition-all duration-300 flex justify-between items-center cursor-pointer select-none shadow-sm hover:shadow-md hover:bg-[#1a3538]"
                            onClick={() => setIsMonthSelectOpen(!isMonthSelectOpen)}
                        >
                            <span className="font-black text-sm md:text-lg font-display uppercase tracking-widest whitespace-nowrap">
                                {MONTHS[currentMonth]} {currentYear}
                            </span>
                            <ChevronDown size={20} className={`text-white transition-transform duration-300 ${isMonthSelectOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isMonthSelectOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#264D52] border-2 border-[#264D52] rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 z-50 flex flex-col md:flex-row max-h-[400px]">
                                <div className="flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-b md:border-b-0 md:border-r border-white/10 bg-[#264D52]">
                                    <div className="sticky top-0 bg-[#1a3538] text-[10px] font-black text-white/70 uppercase tracking-widest px-4 py-2 border-b border-white/10 z-10 w-full text-left">Month</div>
                                    <div className="p-2 flex flex-col gap-1 relative z-0">
                                        {MONTHS.map((month, idx) => (
                                            <div
                                                key={month}
                                                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${currentMonth === idx ? 'bg-[#70AC90] text-white shadow-sm' : 'text-white/80 hover:bg-[#496A49] hover:text-white hover:translate-x-1'}`}
                                                onClick={() => {
                                                    setCurrentDate(new Date(currentYear, idx, 1));
                                                    setIsMonthSelectOpen(false);
                                                }}
                                            >
                                                {month}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-full md:w-32 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-[#1a3538]">
                                    <div className="sticky top-0 bg-[#122527] text-[10px] font-black text-white/70 uppercase tracking-widest px-4 py-2 border-b border-white/10 z-10 w-full text-left">Year</div>
                                    <div className="p-2 flex flex-col gap-1 relative z-0">
                                        {Array.from({ length: 7 }).map((_, i) => currentYear - 3 + i).map(year => (
                                            <div
                                                key={year}
                                                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer text-center ${currentYear === year ? 'bg-[#70AC90] text-white shadow-sm' : 'text-white/80 hover:bg-[#496A49] hover:text-white hover:scale-105'}`}
                                                onClick={() => {
                                                    setCurrentDate(new Date(year, currentMonth, 1));
                                                    setIsMonthSelectOpen(false);
                                                }}
                                            >
                                                {year}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={nextMonth}
                        className="p-3 bg-white hover:bg-[#FAFAFA] transition-all duration-300 text-gray-800 rounded-xl shadow-sm border border-gray-100 cursor-pointer outline-none hover:shadow-md hover:translate-x-1"
                        aria-label="Next Month"
                    >
                        <ChevronRight size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Split Layout: Calendar + Sidebar */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 min-h-0 items-start">

                {/* Left: Calendar Grid */}
                <div className="flex flex-col flex-1 min-h-0 w-full bg-white rounded-xl shadow-sm border border-gray-200 font-sans">
                    {/* Days Header */}
                    <div className="grid grid-cols-7 border-b border-gray-100 bg-white flex-shrink-0">
                        {DAYS_OF_WEEK.map(day => (
                            <div key={day} className="py-4 text-center text-xs font-bold text-[#8699A6] tracking-widest font-sans uppercase">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="flex-1 bg-gray-200 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                        <div className="grid grid-cols-7 gap-px auto-rows-[minmax(100px,auto)] md:auto-rows-[minmax(140px,auto)] w-full">
                            {calendarCells.map((cell, idx) => {
                                const colIndex = idx % 7;
                                const rowIndex = Math.floor(idx / 7);
                                const hasSelectedEvent = cell.events.some(e => e.id === selectedEvent?.id);
                                const isToday = cell.fullDateStr === todayStr;

                                return (
                                    <div
                                        key={idx}
                                        className={`p-2 flex flex-col transition-all duration-300 origin-center ${!cell.date
                                            ? 'bg-gray-50/50'
                                            : hasSelectedEvent
                                                ? 'bg-amber-50/60 md:scale-[1.02] shadow-xl md:-translate-y-1 relative z-50 cursor-pointer ring-1 ring-amber-200'
                                                : selectedEvent
                                                    ? `bg-white relative z-10 cursor-pointer opacity-60 ${isToday ? 'ring-2 ring-inset ring-[#70AC90] bg-[#eef6f2]' : ''}`
                                                    : `bg-white relative z-10 cursor-pointer hover:bg-amber-50/40 md:hover:scale-[1.02] md:hover:shadow-xl md:hover:-translate-y-1 hover:z-30 ${isToday ? 'ring-2 ring-inset ring-[#70AC90] bg-[#eef6f2]' : ''}`
                                            }`}
                                    >
                                        {cell.date && (
                                            <span className={`text-sm font-semibold mb-2 ml-1 ${isToday ? 'text-[#70AC90]' : 'text-[#8699A6]'}`}>
                                                {cell.date}
                                            </span>
                                        )}
                                        <div className="flex flex-col gap-1.5 flex-1 w-full relative">
                                            {cell.events.map(event => {
                                                const isExpanded = selectedEvent?.id === event.id;
                                                const verticalPosition = rowIndex < 3 ? 'top-full mt-2' : 'bottom-full mb-2';
                                                const horizontalPosition = colIndex > 3 ? 'right-0' : 'left-0';

                                                const style = CATEGORY_STYLES[event.type];
                                                const Icon = event.type === 'CULTURAL' ? Palette : 
                                                            event.type === 'CIVIC' ? Gavel : 
                                                            event.type === 'SOCIAL' ? Utensils : 
                                                            event.type === 'HEALTH' ? ScanHeart : CalendarIcon;

                                                return (
                                                    <div key={event.id} className={`relative ${isExpanded ? 'z-50' : 'z-20'}`}>
                                                        <button
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                setSelectedEvent(isExpanded ? null : event);
                                                            }}
                                                            className={`group relative w-full flex items-center justify-center md:block px-2 py-1.5 rounded-full transition-all duration-300 hover:scale-[1.04] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#496A49] shrink-0 cursor-pointer ${style.bg} ${style.text}`}
                                                            title={event.title}
                                                        >
                                                            {/* Show Icon for long titles on small screens */}
                                                            <div className={`md:hidden ${event.title.length > 8 ? 'block' : 'hidden'}`}>
                                                                <Icon size={14} strokeWidth={2.5} />
                                                            </div>
                                                            {/* Show Text on larger screens or for short titles on small screens */}
                                                            <div className={`text-[10px] md:text-xs font-bold leading-tight truncate px-1 text-center md:text-left ${event.title.length > 8 ? 'hidden md:block' : 'block'}`}>
                                                                {event.title}
                                                            </div>
                                                        </button>

                                                        {/* Floating Popover */}
                                                        {isExpanded && (
                                                            <div className={`fixed md:absolute z-[60] w-[calc(100%-2rem)] md:w-72 bg-white shadow-2xl md:shadow-xl rounded-2xl md:rounded-xl border border-gray-100 overflow-hidden left-4 right-4 bottom-10 md:bottom-auto md:left-auto md:right-auto md:${verticalPosition} md:${horizontalPosition} animate-in fade-in zoom-in-95 duration-200`}>


                                                                <div className="p-4 flex flex-col gap-4">
                                                                    {!event.imageUrl && (
                                                                        <div className="flex gap-2">
                                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.iconBg} text-white`}>
                                                                                {CATEGORY_NAMES[event.type]}
                                                                            </span>
                                                                            {event.isVirtual && (
                                                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white">
                                                                                    VIRTUAL
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    <h4 className="font-bold text-[#1c2b2b] text-lg leading-tight">
                                                                        {event.title}
                                                                    </h4>

                                                                    <div className="flex flex-col gap-2 text-sm text-gray-600 font-medium">
                                                                        {event.time && (
                                                                            <div className="flex items-center gap-2">
                                                                                <Clock size={16} className="text-[#C59F82]" />
                                                                                <span>{event.time}</span>
                                                                            </div>
                                                                        )}
                                                                        {event.address && (
                                                                            <div className="flex items-start gap-2">
                                                                                <MapPin size={16} className="text-[#C59F82] shrink-0 mt-0.5" />
                                                                                <span className="line-clamp-2">{event.address}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="pt-3 border-t border-gray-100 flex justify-end items-center">
                                                                        <button
                                                                            onClick={e => {
                                                                                e.stopPropagation();
                                                                                handleInterested(event.id, event.interestedCount || 0);
                                                                            }}
                                                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${userInterested[event.id] ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'}`}
                                                                        >
                                                                            <Heart size={16} className={userInterested[event.id] ? 'fill-rose-500 text-rose-500' : ''} />
                                                                            {userInterested[event.id] ? "I'm interested!" : "I'm interested"}
                                                                            <span className={`px-1.5 rounded-md ml-1 ${userInterested[event.id] ? 'bg-rose-100' : 'bg-gray-200'}`}>{interestedCounts[event.id] ?? event.interestedCount ?? 0}</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0 font-sans">

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
                        <h2 className="text-xl font-black text-[#264D52] font-display">Filter by Event Type</h2>

                        <div className="flex justify-between items-center px-1">
                            {(['CULTURAL', 'CIVIC', 'SOCIAL', 'HEALTH'] as EventType[]).map(type => {
                                const isSelected = selectedCategories.includes(type);
                                const style = CATEGORY_STYLES[type];

                                // Specific icons based on design
                                let Icon = CalendarIcon;
                                if (type === 'CULTURAL') Icon = Palette;
                                if (type === 'CIVIC') Icon = Gavel;
                                if (type === 'SOCIAL') Icon = Utensils;
                                if (type === 'HEALTH') Icon = ScanHeart;

                                return (
                                    <div key={type} className="flex flex-col items-center gap-2">
                                        <button
                                            onClick={() => toggleCategory(type)}
                                            className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer ${isSelected ? `${style.iconBg} ring-2 ring-offset-2 ring-[#70AC90] scale-100 opacity-100` : 'bg-gray-100 scale-95 hover:scale-100'}`}
                                            aria-label={`Toggle ${type}`}
                                        >
                                            <Icon size={24} strokeWidth={2.5} className={isSelected ? 'text-white' : 'text-gray-400'} />
                                        </button>
                                        <span className={`text-[10px] font-bold tracking-wider ${isSelected ? 'text-[#1c2b2b]' : 'text-gray-400'}`}>
                                            {CATEGORY_NAMES[type]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <label className="flex items-center gap-3 p-3 rounded-lg bg-[#f5f0eb] cursor-pointer hover:bg-[#ebdcd3] transition-colors border border-transparent">
                                <div className={`w-5 h-5 rounded overflow-hidden flex items-center justify-center border ${selectedCategories.length === 4 ? 'bg-[#70AC90] border-[#70AC90]' : 'bg-white border-gray-300'}`}>
                                    {selectedCategories.length === 4 && <Check size={14} className="text-white flex-shrink-0" strokeWidth={3} />}
                                </div>
                                <span className="font-bold text-[#1c2b2b] text-sm font-sans pt-0.5">Select All Categories</span>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedCategories.length === 4}
                                    onChange={toggleAllCategories}
                                />
                            </label>

                            <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className={`w-5 h-5 rounded overflow-hidden flex items-center justify-center border ${virtualOnly ? 'bg-[#70AC90] border-[#70AC90]' : 'bg-white border-gray-300'}`}>
                                    {virtualOnly && <Check size={14} className="text-white flex-shrink-0" strokeWidth={3} />}
                                </div>
                                <span className="font-bold text-[#1c2b2b] text-sm font-sans pt-0.5">Virtual Events Only</span>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={virtualOnly}
                                    onChange={() => setVirtualOnly(!virtualOnly)}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-[#E4E4D9] rounded-xl p-6 border border-[#c5c8ac]">
                        <h3 className="font-black text-xl text-[#496A49] mb-3 font-display">Book something</h3>
                        <p className="text-[#496A49]/80 text-sm leading-relaxed mb-4 font-sans">
                            Contact the Willstone Event Coordination Office for venue bookings or event submissions.
                        </p>
                        <a href="mailto:events@willstone.gov" className="text-[#496A49] font-bold text-sm font-sans underline underline-offset-4 decoration-[#70AC90] hover:text-[#264D52] transition-colors">
                            events@willstone.gov
                        </a>
                    </div>
                </div>
            </div>

            {/* Dark overlay backdrop to allow closing popover by clicking outside */}
            {selectedEvent && (
                <div
                    className="fixed inset-0 z-[40]"
                    onClick={() => setSelectedEvent(null)}
                />
            )}
        </div>
    );
}
