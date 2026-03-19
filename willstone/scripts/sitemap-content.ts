/**
 * Willstone Site-Map Content
 *
 * Hand-written descriptions of every page on the site.
 * Used by the RAG ingestion pipeline to give the AI agent
 * knowledge about *where things are* on the website.
 *
 * Update this file whenever pages are added, removed, or restructured.
 */

export interface SiteMapEntry {
  path: string;
  title: string;
  description: string;
  features: string[];
  relatedData: string[];
}

export const siteMapContent: SiteMapEntry[] = [
  {
    path: "/",
    title: "Home",
    description:
      "The landing page for Willstone, a community resource hub. Features a full-screen hero section with a parallax city skyline background and an AI-powered search bar where users can ask natural-language questions. Below the hero is a Spotlight Carousel showcasing the top 3 featured community resources pulled from the database. Further down is a Calendar Preview section showing upcoming community events.",
    features: [
      "AI-powered search bar",
      "Spotlight Carousel with featured resources",
      "Calendar preview with upcoming events",
    ],
    relatedData: ["community_resources", "events"],
  },
  {
    path: "/resource-hub",
    title: "Resource Hub",
    description:
      "Browse and search all community resources in Willstone. The page has a left sidebar with filters and a main grid of resource cards. Users can filter by Resource Type (e.g. Public Library, Community Center, Parks & Rec, Health Services), by Category, and by Island Location using an interactive map showing the four islands: Emerald, Coastal, Central, and Talon. Resources can be sorted alphabetically. Each card links to a detail page with a full image gallery, description, address, phone number, and related resources.",
    features: [
      "Full-text search bar",
      "AI-assisted search button",
      "Resource Type dropdown filter",
      "Category dropdown filter",
      "Interactive island map filter (Emerald, Coastal, Central, Talon)",
      "Sort by alphabetical order",
      "Resource cards with images, category, and island badges",
    ],
    relatedData: ["community_resources"],
  },
  {
    path: "/resource-hub/[slug]",
    title: "Resource Detail Page",
    description:
      "Individual page for a specific community resource. Shows a full image gallery using a spotlight carousel, the resource title, a detailed description, and a Quick Info panel with Resource Type, Island Location, Physical Address, and Phone Number. Below this section are Related Resources showing up to 3 resources from the same category.",
    features: [
      "Spotlight carousel image gallery",
      "Quick Info panel (type, island, address, phone)",
      "Related resources section",
    ],
    relatedData: ["community_resources"],
  },
  {
    path: "/calendar",
    title: "Calendar",
    description:
      "A full interactive calendar showing all community events in Willstone. Events are color-coded by type: Cultural (green), Civic (dark teal), Social (tan), and Health (forest green). Users can filter by event type using icon buttons, toggle a 'Virtual Events Only' filter, and navigate between months and years. Clicking an event shows a floating popover with its title, time, address, and an 'I'm interested' button. There is also a sidebar with a 'Book Something' card linking to the event coordination office.",
    features: [
      "Monthly calendar grid view",
      "Color-coded event categories (Cultural, Civic, Social, Health)",
      "Event type filter buttons",
      "Virtual events toggle",
      "Month/year navigation with dropdown",
      "Event detail popover on click",
      "Interested button for events",
      "Book Something contact card",
    ],
    relatedData: ["events"],
  },
  {
    path: "/government",
    title: "Government",
    description:
      "Displays Willstone's government officials. The Mayor appears prominently at the top with a large circular profile photo, followed by a 4-column grid of 8 other representatives. Clicking any official opens a full-screen overlay with their profile photo, role, name, mission statement, and official email address.",
    features: [
      "Mayor spotlight section",
      "Representatives grid (4x2)",
      "Click-to-open detail overlay with mission and email",
    ],
    relatedData: ["government"],
  },
  {
    path: "/news",
    title: "News",
    description:
      "Community news and announcements for Willstone. The most recent article is displayed as a full-viewport hero section with a parallax background image. Below is a search bar and a grid of news article cards, each showing an image, title, description, date, and a 'Read More' link. Articles are ordered by date, newest first.",
    features: [
      "Full-screen featured article hero",
      "Search bar for filtering articles",
      "News article card grid",
    ],
    relatedData: ["news"],
  },
  {
    path: "/news/[slug]",
    title: "News Article Detail",
    description:
      "Individual page for a single news article. Shows the article title, publication date, a hero image, and the full article content. Includes a back link to the news listing page.",
    features: [
      "Full article content view",
      "Hero image",
      "Publication date",
    ],
    relatedData: ["news"],
  },
  {
    path: "/guides",
    title: "Guides",
    description:
      "Browse community guides organized by category. Categories include Sustainability, Transit, Community, Culture, Business, and Civic. Each guide card shows an image, title, category badge, and description in a horizontal layout. Users can search by keyword or filter by category using pill buttons. An AI Assist button is available for intelligent searching.",
    features: [
      "Search bar with AI Assist button",
      "Category pill filters",
      "Horizontal guide cards with image and description",
    ],
    relatedData: ["guides"],
  },
  {
    path: "/guides/[slug]",
    title: "Guide Detail Page",
    description:
      "Individual guide page showing step-by-step instructions. Displays a title, description, hero image, and a numbered list of steps with a vertical connecting line. Each step has a title and content paragraph.",
    features: [
      "Step-by-step numbered layout with connecting line",
      "Hero image",
      "Guide description",
    ],
    relatedData: ["guides"],
  },
  {
    path: "/map",
    title: "Interactive Map",
    description:
      "An interactive map of Willstone's islands and transit routes. Users can explore the geography of the four islands — Emerald, Coastal, Central, and Talon — and view transit routes connecting them. Route cards provide details about each transit connection.",
    features: [
      "Interactive island map",
      "Transit route visualization",
      "Multi-route selection",
      "Route detail cards",
    ],
    relatedData: [],
  },
  {
    path: "/request",
    title: "Submit a Resource",
    description:
      "A form page where community members can suggest new resources to add to Willstone's directory. The form collects: first name, last name, email, phone number, resource title, category (selected from a dropdown of existing categories or 'Other'), location/address, and a description (max 500 characters). Upon successful submission, the user sees a confirmation summary and receives a confirmation email.",
    features: [
      "Resource submission form",
      "Dynamic category dropdown from database",
      "Custom category option",
      "Email confirmation on submission",
      "Submission summary display",
    ],
    relatedData: ["community_resources"],
  },
  {
    path: "/reference",
    title: "References",
    description:
      "A reference page containing project documentation including: Worklog (PDF viewer), Copyright Checklist (PDF viewer), Code Stack (technology stack breakdown including Next.js, React, TypeScript, Tailwind CSS, Supabase, Framer Motion, Lucide Icons, and Vercel), Image Links (sources for images used on the site), and Research Links (sources for content research).",
    features: [
      "Accordion sections",
      "PDF viewer for worklog and copyright checklist",
      "Code stack breakdown",
      "Image and research link lists",
    ],
    relatedData: [],
  },
];
