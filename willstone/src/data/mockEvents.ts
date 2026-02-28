export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // ISO format YYYY-MM-DD
    time?: string;
    address?: string;
    description: string;
    imageUrl?: string;
}

export const mockEvents: CalendarEvent[] = [
    {
        id: "evt-1",
        title: "Kids Invite Someone Special Valentine's Dance",
        date: "2026-02-07",
        time: "6:00 PM - 8:30 PM",
        address: "Community Center, 100 Main St",
        description: "A special Valentine's dance for kids to bring a parent, grandparent, or someone special for an evening of music, dancing, and memories.",
        imageUrl: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "evt-2",
        title: "Clean Buildings 102: Energy Benchmarking",
        date: "2026-02-10",
        time: "10:00 AM - 12:00 PM",
        address: "City Hall Room 204",
        description: "Learn the fundamentals of energy benchmarking for multi-family and commercial properties to comply with the Clean Buildings Act.",
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "evt-9",
        title: "City Council Meeting",
        date: "2026-02-10",
        time: "6:00 PM - 8:00 PM",
        address: "City Hall Main Chamber",
        description: "Monthly open city council meeting. Public comments are welcome. Come early to sign up for public speaking time.",
        imageUrl: "https://images.unsplash.com/photo-1577962917302-c873280c9e8e?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "evt-3",
        title: "Clean Buildings 101: Intro to Law, Incentives, & Support",
        date: "2026-02-11",
        time: "1:00 PM - 3:00 PM",
        address: "Online Webinar",
        description: "An introductory session covering the new Clean Buildings Law, available financial incentives, and support for property owners.",
        imageUrl: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "evt-4",
        title: "Sweets & Songs",
        date: "2026-02-13",
        time: "7:00 PM - 9:00 PM",
        address: "Willstone Library Auditorium",
        description: "Join us for an evening of delightful desserts and live acoustic music featuring local artists.",
        imageUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "evt-10",
        title: "Valentine's Day Craft Fair",
        date: "2026-02-14",
        time: "10:00 AM - 3:00 PM",
        address: "Downtown Plaza",
        description: "Support local artisans and find the perfect handmade gift for your loved one. Featuring over 30 vendors!",
        imageUrl: "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "evt-5",
        title: "Valentines Tea-Kart Party with the Super Crew",
        date: "2026-02-14",
        time: "2:00 PM - 4:00 PM",
        address: "Willstone Park Pavilion",
        description: "A fun-filled tea party featuring a go-kart track and meet-and-greets with local heroes!",
        imageUrl: "https://images.unsplash.com/photo-1558231908-41f237f375c3?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "evt-6",
        title: "Presidents Day - City Hall Offices Closed",
        date: "2026-02-16",
        description: "All non-emergency city offices will be closed in observance of Presidents Day.",
    },
    {
        id: "evt-7",
        title: "Meet and Greet - February",
        date: "2026-02-19",
        time: "5:30 PM - 7:00 PM",
        address: "Downtown Plaza",
        description: "Monthly community meet and greet with city council members. Share your thoughts and ideas!",
        imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "evt-8",
        title: "Winter Whimsy",
        date: "2026-02-20",
        time: "10:00 AM - 4:00 PM",
        address: "Civic Center Ice Rink",
        description: "A special winter festival featuring ice skating, hot cocoa, and snow globe making stations.",
        imageUrl: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=400"
    }
];
