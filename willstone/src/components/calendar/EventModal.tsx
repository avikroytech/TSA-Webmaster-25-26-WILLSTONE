import React, { useEffect } from 'react';
import Image from 'next/image';
import { CalendarEvent } from '@/data/mockEvents';
import { Clock, MapPin, X } from 'lucide-react';

interface EventModalProps {
    event: CalendarEvent;
    onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {event.imageUrl ? (
                    <div className="relative w-full h-48 sm:h-64 bg-gray-100">
                        <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-end p-4 pb-0">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 text-gray-500 rounded-full transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                <div className="p-6 sm:p-8 flex flex-col gap-4">
                    <h3 className="font-black text-[#2D336B] text-2xl leading-tight">
                        {event.title}
                    </h3>

                    <div className="flex flex-col gap-3 text-sm text-gray-600 font-medium border-y border-gray-100 py-4">
                        {event.time && (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#7886C7]/10 rounded-lg">
                                    <Clock size={18} className="text-[#7886C7]" />
                                </div>
                                <span className="text-base">{event.time}</span>
                            </div>
                        )}
                        {event.address && (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#7886C7]/10 rounded-lg">
                                    <MapPin size={18} className="text-[#7886C7]" />
                                </div>
                                <span className="text-base">{event.address}</span>
                            </div>
                        )}
                    </div>

                    {event.description && (
                        <p className="text-gray-600 mt-2 leading-relaxed text-base">
                            {event.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
