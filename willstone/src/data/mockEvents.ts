export type EventType = 'CULTURAL' | 'CIVIC' | 'SOCIAL' | 'HEALTH';

export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // ISO format YYYY-MM-DD
    time?: string;
    address?: string;
    description: string;
    imageUrl?: string;
    type: EventType;
    isVirtual?: boolean;
    interestedCount?: number;
}

export const mockEvents: CalendarEvent[] = [
    {
        id: "evt-1",
        title: "Kids Invite Someone Special Valentine's Dance",
        date: "2026-02-07",
        time: "6:00 PM - 8:30 PM",
        address: "Community Center, 100 Main St",
        description: "A special Valentine's dance for kids to bring a parent, grandparent, or someone special for an evening of music, dancing, and memories.",
        imageUrl: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=400",
        type: 'SOCIAL',
        interestedCount: 12
    },
    {
        id: "evt-2",
        title: "Clean Buildings 102: Energy Benchmarking",
        date: "2026-02-10",
        time: "10:00 AM - 12:00 PM",
        address: "City Hall Room 204",
        description: "Learn the fundamentals of energy benchmarking for multi-family and commercial properties to comply with the Clean Buildings Act.",
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400",
        type: 'CIVIC',
        interestedCount: 5
    },
    {
        id: "evt-9",
        title: "City Council Meeting",
        date: "2026-02-10",
        time: "6:00 PM - 8:00 PM",
        address: "City Hall Main Chamber",
        description: "Monthly open city council meeting. Public comments are welcome. Come early to sign up for public speaking time.",
        imageUrl: "https://images.unsplash.com/photo-1577962917302-c873280c9e8e?auto=format&fit=crop&q=80&w=400",
        type: 'CIVIC',
        interestedCount: 30
    },
    {
        id: "evt-3",
        title: "Clean Buildings 101: Intro to Law, Incentives, & Support",
        date: "2026-02-11",
        time: "1:00 PM - 3:00 PM",
        address: "Online Webinar",
        description: "An introductory session covering the new Clean Buildings Law, available financial incentives, and support for property owners.",
        imageUrl: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&q=80&w=400",
        type: 'CIVIC',
        isVirtual: true,
        interestedCount: 18
    },
    {
        id: "evt-4",
        title: "Sweets & Songs",
        date: "2026-02-13",
        time: "7:00 PM - 9:00 PM",
        address: "Willstone Library Auditorium",
        description: "Join us for an evening of delightful desserts and live acoustic music featuring local artists.",
        imageUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=400",
        type: 'CULTURAL',
        interestedCount: 42
    },
    {
        id: "evt-10",
        title: "Valentine's Day Craft Fair",
        date: "2026-02-14",
        time: "10:00 AM - 3:00 PM",
        address: "Downtown Plaza",
        description: "Support local artisans and find the perfect handmade gift for your loved one. Featuring over 30 vendors!",
        imageUrl: "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&q=80&w=400",
        type: 'CULTURAL',
        interestedCount: 65
    },
    {
        id: "evt-5",
        title: "Valentines Tea-Kart Party with the Super Crew",
        date: "2026-02-14",
        time: "2:00 PM - 4:00 PM",
        address: "Willstone Park Pavilion",
        description: "A fun-filled tea party featuring a go-kart track and meet-and-greets with local heroes!",
        imageUrl: "https://images.unsplash.com/photo-1558231908-41f237f375c3?auto=format&fit=crop&q=80&w=400",
        type: 'SOCIAL',
        interestedCount: 28
    },
    {
        id: "evt-6",
        title: "Presidents Day - City Hall Offices Closed",
        date: "2026-02-16",
        description: "All non-emergency city offices will be closed in observance of Presidents Day.",
        type: 'CIVIC'
    },
    {
        id: "evt-7",
        title: "Meet and Greet - February",
        date: "2026-02-19",
        time: "5:30 PM - 7:00 PM",
        address: "Downtown Plaza",
        description: "Monthly community meet and greet with city council members. Share your thoughts and ideas!",
        imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400",
        type: 'CIVIC',
        interestedCount: 15
    },
    {
        id: "evt-8",
        title: "Winter Whimsy",
        date: "2026-02-20",
        time: "10:00 AM - 4:00 PM",
        address: "Civic Center Ice Rink",
        description: "A special winter festival featuring ice skating, hot cocoa, and snow globe making stations.",
        imageUrl: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=400",
        type: 'SOCIAL',
        interestedCount: 50
    },

    // MARCH 2026
    {
        id: "evt-11",
        title: "Spring Gardening Workshop",
        date: "2026-03-05",
        time: "10:00 AM - 12:00 PM",
        address: "Community Gardens",
        description: "Get ready for spring! Learn the basics of planting and maintaining a vibrant garden.",
        type: 'HEALTH',
        interestedCount: 22
    },
    {
        id: "evt-12",
        title: "Farmers Market Opening Day",
        date: "2026-03-08",
        time: "9:00 AM - 1:00 PM",
        address: "Town Square",
        description: "The first farmers market of the season. Fresh local produce, baked goods, and crafts.",
        type: 'SOCIAL',
        interestedCount: 110
    },
    {
        id: "evt-13",
        title: "Town Hall Meeting",
        date: "2026-03-10",
        time: "7:00 PM - 9:00 PM",
        address: "City Hall Main Chamber",
        description: "Quarterly town hall meeting to address budget updates and new community initiatives.",
        type: 'CIVIC',
        interestedCount: 45
    },
    {
        id: "evt-14",
        title: "Art Gala",
        date: "2026-03-10",
        time: "6:00 PM - 10:00 PM",
        address: "Willstone Art Museum",
        description: "An elegant evening celebrating local artists with an auction and live performances.",
        type: 'CULTURAL',
        interestedCount: 85
    },
    {
        id: "evt-15",
        title: "Yoga in the Park",
        date: "2026-03-13",
        time: "8:00 AM - 9:00 AM",
        address: "Centennial Park",
        description: "Start your morning with a relaxing, instructor-led yoga session outdoors.",
        type: 'HEALTH',
        interestedCount: 30
    },
    {
        id: "evt-16",
        title: "Wine Tasting & Vineyard Tour",
        date: "2026-03-14",
        time: "2:00 PM - 6:00 PM",
        address: "Willstone Valley Vineyards",
        description: "Tour the local vineyards and enjoy a curated selection of spring wines.",
        type: 'SOCIAL',
        interestedCount: 65
    },
    {
        id: "evt-17",
        title: "Tech Meetup: Web Development",
        date: "2026-03-17",
        time: "6:30 PM - 8:30 PM",
        address: "Online Webinar",
        description: "Join fellow developers for a virtual discussion on modern web framework trends.",
        type: 'CIVIC',
        isVirtual: true,
        interestedCount: 40
    },
    {
        id: "evt-18",
        title: "St. Patrick's Day Parade",
        date: "2026-03-17",
        time: "1:00 PM - 3:00 PM",
        address: "Main Street",
        description: "Annual parade celebrating St. Patrick's Day with floats, marching bands, and more.",
        type: 'CULTURAL',
        interestedCount: 200
    },

    // APRIL 2026
    {
        id: "evt-19",
        title: "City Marathon",
        date: "2026-04-04",
        time: "7:00 AM - 1:00 PM",
        address: "Willstone Stadium",
        description: "Join thousands of runners in the annual Willstone City Marathon. Cheer sections available throughout the route.",
        type: 'HEALTH',
        interestedCount: 350
    },
    {
        id: "evt-20",
        title: "Small Business Fair",
        date: "2026-04-12",
        time: "10:00 AM - 4:00 PM",
        address: "Downtown Convention Center",
        description: "Discover local small businesses, network, and shop for unique local products.",
        type: 'CIVIC',
        interestedCount: 120
    },
    {
        id: "evt-21",
        title: "Spring Concert Series: Jazz Night",
        date: "2026-04-18",
        time: "7:30 PM - 10:00 PM",
        address: "Outdoor Amphitheater",
        description: "Enjoy an evening of smooth jazz under the stars featuring the Willstone Jazz Ensemble.",
        type: 'CULTURAL',
        interestedCount: 88
    },
    {
        id: "evt-22",
        title: "Earth Day Cleanup",
        date: "2026-04-22",
        time: "9:00 AM - 12:00 PM",
        address: "Willstone Riverfront",
        description: "Volunteer to help clean up the riverfront and local parks in celebration of Earth Day.",
        type: 'CIVIC',
        interestedCount: 75
    },
    {
        id: "evt-23",
        title: "Virtual Cooking Class: Spring Recipes",
        date: "2026-04-25",
        time: "5:00 PM - 7:00 PM",
        address: "Online Webinar",
        description: "Learn to cook fresh, seasonal spring recipes from the comfort of your home with Chef Mario.",
        type: 'SOCIAL',
        isVirtual: true,
        interestedCount: 60
    },
    {
        id: "evt-24",
        title: "Public Budget Meeting",
        date: "2026-04-21",
        time: "5:00 PM - 7:00 PM",
        address: "City Hall (Central Island)",
        description: "Learn to cook fresh, seasonal spring recipes from the comfort of your home with Chef Mario.",
        type: 'CIVIC',
        isVirtual: false,
        interestedCount: 67
    },
];
