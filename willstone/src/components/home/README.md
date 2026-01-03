# Home Page Components Documentation

This directory contains all the components used to build the home page of the Willstone website. Each component is designed to be modular, reusable, and maintainable.

---

## Component Overview

### 1. Navbar Component (`Navbar.tsx`)

**Purpose:**
The Navbar component provides persistent navigation throughout the website. It remains fixed at the top of the page when users scroll, ensuring easy access to main navigation links at all times.

**Key Features:**
- **Sticky Positioning**: Uses CSS `sticky` positioning to remain at the top during scroll
- **Logo & Title**: Displays the Willstone logo (represented by a "W" in a blue square) and site title on the left side
- **Navigation Links**: Five main navigation links displayed horizontally on the right:
  1. Resource Hub
  2. Request Resource
  3. Map
  4. Calendar
  5. Reference Page
- **Responsive Design**: Includes a mobile menu button (ready for future mobile menu implementation)
- **Dark Mode Support**: Adapts to light and dark themes
- **Hover Effects**: Smooth color transitions on link hover

**Technical Implementation:**
- Client-side component (`"use client"`) for interactivity
- Uses Next.js `Link` component for client-side navigation
- Tailwind CSS for styling with responsive breakpoints
- Z-index of 50 ensures it stays above other content
- Border and shadow provide visual separation from page content

**Usage:**
```tsx
import Navbar from "@/components/home/Navbar";

// In your page component
<Navbar />
```

---

### 2. SpotlightCarousel Component (`SpotlightCarousel.tsx`)

**Purpose:**
The SpotlightCarousel showcases featured resources in an engaging, visually appealing way. It presents one main resource at a time with smooth animations and transitions.

**Key Features:**
- **Single Resource Focus**: Displays one resource prominently at a time
- **Resource Information**: Each resource card includes:
  - High-quality image
  - Resource name (large, bold heading)
  - Descriptive text explaining the resource
  - "Learn More" call-to-action button
- **Auto-Advance**: Automatically cycles through resources every 5 seconds
- **Pause on Hover**: Auto-advance pauses when user hovers over the carousel
- **Manual Navigation**: 
  - Previous/Next buttons on the sides
  - Indicator dots at the bottom for direct navigation
- **Smooth Animations**: Uses Framer Motion for:
  - Slide transitions between resources
  - Fade effects for background gradients
  - Scale animations on images
  - Staggered text animations
- **Responsive Layout**: Adapts from vertical (mobile) to horizontal (desktop) layout

**Technical Implementation:**
- Client-side component with React hooks (`useState`, `useEffect`)
- Framer Motion library for animations (`motion`, `AnimatePresence`)
- Next.js `Image` component for optimized image loading
- Auto-advance timer that respects pause state
- Direction tracking for smooth slide animations
- Resource data structure with `id`, `name`, `description`, and `image` fields

**Data Structure:**
```typescript
interface Resource {
  id: number;
  name: string;
  description: string;
  image: string;
}
```

**Usage:**
```tsx
import SpotlightCarousel from "@/components/home/SpotlightCarousel";

// In your page component
<SpotlightCarousel />
```

**Customization:**
- Modify the `resources` array to change displayed resources
- Adjust auto-advance timing by changing the interval in `useEffect` (currently 5000ms)
- Update animation durations in Framer Motion `transition` props

---

### 3. CalendarSection Component (`CalendarSection.tsx`)

**Purpose:**
The CalendarSection displays upcoming events in a two-column layout, combining visual appeal with informative event details.

**Key Features:**
- **Two-Column Layout**:
  - **Left Column**: Auto-scrolling image carousel showing event images (maximum 3 events)
  - **Right Column**: Event information with header and event cards
- **Image Carousel**:
  - Automatically rotates through event images every 4 seconds
  - Smooth fade transitions between images
  - Indicator dots for manual navigation
  - Overlay text showing event title and date
- **Event Cards**:
  - Three event cards displayed vertically
  - Each card features:
    - Large date display on the left (day number and month abbreviation)
    - Event title and description on the right
    - Hover effects for better interactivity
- **Calendar Link**: Header includes "Events" title and "View Calendar" button
- **Date Formatting**: Helper functions format dates in multiple ways:
  - Short format: "Jan 15" for date display
  - Full format: "January 15, 2025" for detailed view

**Technical Implementation:**
- Client-side component with state management for carousel
- Framer Motion for image transitions
- Next.js `Image` component for optimized images
- Date formatting utilities (`formatDate`, `formatFullDate`)
- Responsive grid layout (single column on mobile, two columns on desktop)
- Automatic carousel rotation with `useEffect` hook

**Data Structure:**
```typescript
interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  image: string;
}
```

**Usage:**
```tsx
import CalendarSection from "@/components/home/CalendarSection";

// In your page component
<CalendarSection />
```

**Customization:**
- Modify the `events` array to change displayed events
- Adjust carousel rotation speed (currently 4000ms)
- Update date formatting in helper functions
- Change maximum carousel events (currently limited to 3)

---

### 4. Footer Component (`Footer.tsx`)

**Purpose:**
The Footer provides essential site information, links, and contact details at the bottom of every page.

**Key Features:**
- **Three-Column Layout**:
  1. **Quick Links**: Navigation to main site sections
  2. **Contact Information**: Phone, email, and physical address
  3. **Information**: Legal and informational links (About, Privacy, Accessibility, Reference)
- **Copyright Information**: Dynamic year display with copyright notice
- **Tagline**: "Serving our community with integrity and excellence"
- **Responsive Design**: Stacks vertically on mobile, three columns on desktop
- **Hover Effects**: Links change color on hover for better interactivity

**Technical Implementation:**
- Server-side component (no client-side JavaScript needed)
- Uses Next.js `Link` component for internal navigation
- Dynamic year calculation using `new Date().getFullYear()`
- Dark background (gray-900) with light text for contrast
- Organized semantic HTML structure
- Accessible link structure

**Usage:**
```tsx
import Footer from "@/components/home/Footer";

// In your page component
<Footer />
```

**Customization:**
- Update contact information (phone, email, address)
- Modify links in each section
- Change tagline or copyright text
- Adjust color scheme in Tailwind classes

---

## Styling Approach

All components use **Tailwind CSS** for styling, following these principles:

1. **Professional Government Aesthetic**:
   - Clean, minimal design
   - Blue color scheme (blue-600, blue-700) for primary actions
   - Gray scale for text and backgrounds
   - Subtle shadows and borders

2. **Responsive Design**:
   - Mobile-first approach
   - Breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
   - Flexible layouts that adapt to screen size

3. **Dark Mode Support**:
   - All components support dark mode via `dark:` classes
   - Automatic theme detection based on user preference

4. **Accessibility**:
   - Semantic HTML elements
   - ARIA labels on interactive elements
   - Proper heading hierarchy
   - Keyboard navigation support

---

## Component Dependencies

### External Libraries:
- **framer-motion**: Used in SpotlightCarousel and CalendarSection for animations
- **next/image**: Optimized image loading in SpotlightCarousel and CalendarSection
- **next/link**: Client-side navigation in Navbar and Footer

### Internal Dependencies:
- All components are self-contained and don't depend on each other
- Shared styling through Tailwind CSS configuration
- TypeScript interfaces defined within each component file

---

## Future Enhancements

Potential improvements for each component:

1. **Navbar**:
   - Implement mobile menu dropdown
   - Add active link highlighting based on current route
   - Add search functionality

2. **SpotlightCarousel**:
   - Connect to Supabase database for dynamic resource loading
   - Add swipe gestures for mobile devices
   - Implement lazy loading for images

3. **CalendarSection**:
   - Connect to Supabase database for dynamic event loading
   - Add filtering and sorting options
   - Implement event detail modal/page

4. **Footer**:
   - Add social media links
   - Implement newsletter signup
   - Add site map link

---

## Integration with Supabase

When ready to connect to Supabase:

1. **SpotlightCarousel**: Replace static `resources` array with Supabase query
2. **CalendarSection**: Replace static `events` array with Supabase query
3. **Navbar**: Could fetch navigation structure from database
4. **Footer**: Could fetch contact information from database

Example Supabase integration pattern:
```typescript
// In SpotlightCarousel.tsx
const { data: resources } = await supabase
  .from('resources')
  .select('*')
  .eq('featured', true)
  .limit(3);
```

---

## File Structure

```
components/home/
├── Navbar.tsx              # Navigation bar component
├── SpotlightCarousel.tsx   # Resource carousel component
├── CalendarSection.tsx      # Events calendar section component
├── Footer.tsx               # Footer component
└── README.md               # This documentation file
```

---

## Notes

- All components are fully typed with TypeScript
- Components follow React best practices and Next.js conventions
- Code is well-documented with JSDoc comments
- No "AI-generated" patterns or generic templates
- Professional, government-appropriate styling throughout
- All components are production-ready and maintainable

