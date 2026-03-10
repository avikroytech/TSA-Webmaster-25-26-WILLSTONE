"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { mockEvents, CalendarEvent } from '@/data/mockEvents';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Start at Feb 2026 per mock data
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Navigation handlers
    const prevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentDate(new Date(currentYear, parseInt(e.target.value), 1));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentDate(new Date(parseInt(e.target.value), currentMonth, 1));
    };

    // Calendar Math
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Create grid cells (empty slots for days before 1st, then actual days)
    const calendarCells = useMemo(() => {
        const cells: { date: number | null, fullDateStr?: string, events: CalendarEvent[] }[] = [];

        // Empty cells
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push({ date: null, events: [] });
        }

        // Day cells
        for (let i = 1; i <= daysInMonth; i++) {
            const fullDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayEvents = mockEvents.filter(e => e.date === fullDateStr);
            cells.push({ date: i, fullDateStr, events: dayEvents });
        }

        // Filling the rest of the last row
        const remainingCells = 42 - cells.length; // 6 rows * 7 columns
        if (remainingCells < 7) {
            for (let i = 0; i < remainingCells; i++) {
                cells.push({ date: null, events: [] });
            }
        } else if (cells.length % 7 !== 0) { // Should be a multiple of 7
            const left = 7 - (cells.length % 7);
            for (let i = 0; i < left; i++) {
                cells.push({ date: null, events: [] });
            }
        }

        return cells;
    }, [currentYear, currentMonth, daysInMonth, firstDayOfMonth]);

    // Year Options (-5 to +5 years)
    const yearOptions = Array.from({ length: 11 }).map((_, i) => currentYear - 5 + i);

    return (
        <>
            <div className="flex flex-col flex-1 min-h-0 w-full max-w-[1400px] mx-auto bg-white rounded-lg shadow-sm border border-gray-200 font-sans">

                {/* Calendar Header */}
                <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-[#FAFAFA] flex-shrink-0">
                    <div className="flex items-center gap-1 border border-gray-300 rounded-md bg-white shadow-sm overflow-hidden">
                        <button
                            onClick={prevMonth}
                            className="p-2 hover:bg-gray-100 transition-colors text-gray-600 outline-none"
                            aria-label="Previous Month"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="w-px h-5 bg-gray-300" />
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-gray-100 transition-colors text-gray-600 outline-none"
                            aria-label="Next Month"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={currentMonth}
                            onChange={handleMonthChange}
                            className="appearance-none bg-transparent font-medium text-gray-800 text-lg cursor-pointer outline-none hover:text-[#264D52] transition-colors pr-2"
                        >
                            {MONTHS.map((month, index) => (
                                <option key={month} value={index}>{month}</option>
                            ))}
                        </select>

                        <select
                            value={currentYear}
                            onChange={handleYearChange}
                            className="appearance-none bg-transparent font-medium text-gray-800 text-lg cursor-pointer outline-none hover:text-[#264D52] transition-colors"
                        >
                            {yearOptions.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-gray-200 bg-white flex-shrink-0">
                    {DAYS_OF_WEEK.map(day => (
                        <div key={day} className="py-3 text-center text-sm font-semibold text-[#264D52]">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1 bg-gray-200 flex flex-col min-h-0">
                    <div className="grid grid-cols-7 gap-px flex-1">
                        {calendarCells.map((cell, idx) => {
                            const colIndex = idx % 7;
                            const rowIndex = Math.floor(idx / 7);
                            const hasSelectedEvent = cell.events.some(e => e.id === selectedEvent?.id);

                            return (
                                <div
                                    key={idx}
                                    className={`bg-white p-2 md:p-3 flex flex-col transition-colors ${cell.date ? 'hover:bg-gray-50' : 'bg-gray-50'} ${hasSelectedEvent ? 'relative z-50' : 'relative z-10'}`}
                                >
                                    {cell.date && (
                                        <span className="text-sm font-bold text-gray-500 mb-2 ml-1">{String(cell.date).padStart(2, '0')}</span>
                                    )}
                                    <div className="flex flex-col gap-1.5 flex-1 w-full h-full relative">
                                        {cell.events.map(event => {
                                            const isExpanded = selectedEvent?.id === event.id;

                                            // Smart positioning logic to keep the popover within the bounds of the calendar grid
                                            const verticalPosition = rowIndex < 2 ? 'top-full mt-2' : 'bottom-full mb-2';
                                            const horizontalPosition = colIndex > 3 ? 'right-0' : 'left-0';

                                            return (
                                                <div key={event.id} className={`relative ${isExpanded ? 'z-50' : 'z-20'}`}>
                                                    <button
                                                        onClick={() => setSelectedEvent(isExpanded ? null : event)}
                                                        className={`group relative w-full text-left p-1.5 md:p-2 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-[#496A49] shrink-0
                                                    ${isExpanded ? 'bg-[#496A49] text-white border-transparent' : 'bg-transparent text-[#264D52] border-transparent hover:bg-[#496A49]/10 hover:border-[#496A49]/30'}
                                                `}
                                                    >
                                                        <div className="text-xs">
                                                            <div className={`font-semibold leading-tight line-clamp-2 ${isExpanded ? 'text-white' : 'text-[#264D52]'}`}>
                                                                {event.title}
                                                            </div>
                                                        </div>
                                                    </button>

                                                    {/* Floating Popover on Click (No Image/Description) */}
                                                    {isExpanded && (
                                                        <div className={`absolute w-64 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-lg border border-[#e5e7eb] z-[60] overflow-hidden ${verticalPosition} ${horizontalPosition}`}>
                                                            <div className="p-4 flex flex-col gap-3 relative bg-white">
                                                                <h4 className="font-bold text-[#264D52] text-base leading-tight">
                                                                    {event.title}
                                                                </h4>

                                                                <div className="flex flex-col gap-1.5 text-xs text-gray-600 font-medium">
                                                                    {event.time && (
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock size={14} className="text-[#496A49]" />
                                                                            <span>{event.time}</span>
                                                                        </div>
                                                                    )}
                                                                    {event.address && (
                                                                        <div className="flex items-center gap-2">
                                                                            <MapPin size={14} className="text-[#496A49]" />
                                                                            <span className="line-clamp-2">{event.address}</span>
                                                                        </div>
                                                                    )}
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

            {/* Dark overlay backdrop to allow closing popover by clicking outside */}
            {selectedEvent && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSelectedEvent(null)}
                />
            )}
        </>
    );
}
