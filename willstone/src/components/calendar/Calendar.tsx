"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { mockEvents, CalendarEvent } from '@/data/mockEvents';
import EventModal from './EventModal';

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
            <div className="w-full max-w-[1400px] mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden font-sans">

                {/* Calendar Header */}
                <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-[#FAFAFA]">
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
                            className="appearance-none bg-transparent font-medium text-gray-800 text-lg cursor-pointer outline-none hover:text-[#2D336B] transition-colors pr-2"
                        >
                            {MONTHS.map((month, index) => (
                                <option key={month} value={index}>{month}</option>
                            ))}
                        </select>

                        <select
                            value={currentYear}
                            onChange={handleYearChange}
                            className="appearance-none bg-transparent font-medium text-gray-800 text-lg cursor-pointer outline-none hover:text-[#2D336B] transition-colors"
                        >
                            {yearOptions.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-gray-200 bg-white">
                    {DAYS_OF_WEEK.map(day => (
                        <div key={day} className="py-3 text-center text-sm font-semibold text-[#2D336B]">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px">
                    {calendarCells.map((cell, idx) => (
                        <div
                            key={idx}
                            className={`min-h-[140px] bg-white p-2 flex flex-col transition-colors ${cell.date ? 'hover:bg-gray-50' : 'bg-gray-50'}`}
                        >
                            {cell.date && (
                                <span className="text-sm font-bold text-gray-500 mb-2 mt-1 ml-1">{String(cell.date).padStart(2, '0')}</span>
                            )}
                            <div className="flex flex-col gap-2.5 flex-1">
                                {cell.events.map(event => (
                                    <button
                                        key={event.id}
                                        onClick={() => setSelectedEvent(event)}
                                        className="group relative w-full text-left p-2 rounded border border-transparent hover:border-[#7886C7]/30 hover:bg-[#7886C7]/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#7886C7]"
                                    >
                                        <div className="text-xs">
                                            <div className="font-semibold text-[#2D336B] leading-tight line-clamp-2">
                                                {event.title}
                                            </div>
                                            {event.time && (
                                                <div className="text-gray-500 mt-1 line-clamp-1 truncate flex items-center gap-1">
                                                    <Clock size={10} className="inline flex-shrink-0" />
                                                    {event.time}
                                                </div>
                                            )}
                                            {event.address && (
                                                <div className="text-gray-400 mt-0.5 line-clamp-1 truncate text-[10px] flex items-center gap-1">
                                                    <MapPin size={10} className="inline flex-shrink-0" />
                                                    {event.address}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </>
    );
}
