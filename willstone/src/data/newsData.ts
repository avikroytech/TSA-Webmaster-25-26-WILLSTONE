export interface NewsCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon name or emoji? Let's use name to be safe with Lucide.
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  date: string;
  isFeatured?: boolean;
}

export const newsCategories: NewsCategory[] = [
  { id: "all", name: "All News", icon: "LayoutGrid" },
  { id: "government", name: "Local Government", icon: "Landmark" },
  { id: "infrastructure", name: "Infrastructure", icon: "Construction" },
  { id: "health", name: "Public Health", icon: "Stethoscope" },
  { id: "environment", name: "Environment", icon: "Leaf" },
  { id: "community", name: "Community & Recreation", icon: "Users" },
];

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Modernizing Urban Infrastructure: The 2024 Vision",
    slug: "modernizing-urban-infrastructure-2024",
    category: "infrastructure",
    description: "City Council unveils new multi-billion dollar plans for sustainable transit, expanded green spaces, and smart city integration.",
    content: "...",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    date: "2024-03-11",
    isFeatured: true,
  },
  {
    id: "2",
    title: "New Recycling Initiative Launches Next Month",
    slug: "new-recycling-initiative",
    category: "environment",
    description: "The city's zero-waste program is expanding with five new collection points across the downtown district to encourage community-wide sustainability.",
    content: "...",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600",
    date: "2024-03-05",
  },
  {
    id: "3",
    title: "Public Budget Meeting: Have Your Say",
    slug: "public-budget-meeting",
    category: "government",
    description: "Join us this Tuesday at City Hall for a town hall discussion regarding the 2025 fiscal year budget and projected infrastructure projects.",
    content: "...",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600",
    date: "2024-03-02",
  },
  {
    id: "4",
    title: "Free Community Health Screenings Announced",
    slug: "community-health-screenings",
    category: "health",
    description: "In partnership with local clinics, the city will offer free wellness checks and flu vaccinations starting October 15th.",
    content: "...",
    imageUrl: "https://images.unsplash.com/photo-1505751172107-13352932f913?auto=format&fit=crop&q=80&w=600",
    date: "2024-02-28",
  },
  {
    id: "5",
    title: "Valley Trail Extension Completed Ahead of Schedule",
    slug: "valley-trail-extension",
    category: "infrastructure",
    description: "Cyclists and hikers can now enjoy an additional 5 miles of paved trail connecting the east and west park districts.",
    content: "...",
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600",
    date: "2024-02-20",
  },
  {
    id: "6",
    title: "Harvest Festival Schedule Released",
    slug: "harvest-festival-schedule",
    category: "community",
    description: "Get ready for three days of music, food, and family fun at Central Plaza. View the full lineup of local performers.",
    content: "...",
    imageUrl: "https://images.unsplash.com/photo-1467307983825-619715426c70?auto=format&fit=crop&q=80&w=600",
    date: "2024-02-15",
  },
  {
    id: "7",
    title: "Downtown Revitalization Project Wins Design Award",
    slug: "downtown-revitalization-award",
    category: "infrastructure",
    description: "The city's commitment to aesthetic and functional urban design has been recognized by the National Architecture League.",
    content: "...",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=600",
    date: "2024-02-10",
  },
];
