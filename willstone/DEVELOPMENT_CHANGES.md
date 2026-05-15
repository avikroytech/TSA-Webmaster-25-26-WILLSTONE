# Willstone Priority Implementation Notes

## Scope

Implemented critical, high, and medium priority improvements from `implementation_plan.md` plus the explicit requested UI additions. PWA support and nice-to-have items were intentionally excluded.

## Changes

- Reworked the visual direction into a calmer civic design system with smaller scale, restrained typography, rectangular municipal controls, and a consistent cream/teal/copper palette.
- Rebuilt the navbar again as a city-style header with a utility strip, clear primary navigation, restrained More menu, dedicated Find Services CTA, and a single Submit Resource action.
- Redesigned the homepage hero as a practical city hub entry point with local imagery, service search, quick links, and more natural copy.
- Reduced subpage hero scale and standardized overlay styling so subpages feel cohesive instead of oversized or generated.
- Restyled homepage stats, spotlight, calendar, newsletter, news, guide, government, and resource surfaces toward cleaner civic cards and less decorative UI.
- Tightened Resource Hub card hierarchy, search input, result count, and empty states for a more usable directory experience.
- Adjusted major mobile breakpoints and card dimensions to reduce crowding and oversized imagery.
- Centralized the navbar in `src/app/layout.tsx`, added a skip link, and removed duplicate page-level navbar usage.
- Rebuilt `Navbar.tsx` as a sticky desktop nav with a reduced primary menu, More dropdown, mobile hamburger, Resource submission CTA, and a restrained Beacon entry point.
- Added standardized subpage hero banners through `src/components/layout/SubpageHero.tsx`.
- Added `About Willstone` with island-by-island sections, stats, timeline lore, and an interactive archipelago presentation.
- Added homepage community impact counters and a newsletter signup section.
- Replaced the Request page's 2,000-element decorative pebble grid with CSS radial background patterns.
- Added client-side request form validation, associated labels, ARIA dropdown semantics, local submission receipt persistence, and clearer errors.
- Upgraded Resource Hub filtering with corrected labels, ARIA listbox roles, result counts, empty states, concise descriptions, mobile-safe cards, and island filter accessibility.
- Enhanced the map with a lighter visual palette, color-coded resource pins, category filters, responsive controls, and footer consistency.
- Added resident auth/dashboard flow using local persisted profile state and saved resource submissions.
- Added local resource reviews and star ratings on resource detail pages.
- Moved Beacon access out of the old top-right floating button and into the nav/home search flow; added contextual prompts, source cards, typing state, and voice input support.
- Added theme, language, and accessibility providers with persistent user preferences.
- Added dark mode variables, high-contrast mode, reduced-motion controls, smooth scrolling, and stronger focus/selection styling.
- Added `next.config.ts` Turbopack root pinning to keep builds scoped to the project directory.
- Removed remote Google font fetching from the build path to avoid network-dependent production builds.
- Updated email sender configuration to use `GMAIL_USER` from environment instead of a hardcoded sender login.

## Verification

- `npm run build` passes.
- `npm run lint` and `npx biome check src --max-diagnostics=80` still fail against the existing Biome baseline, including pre-existing `scripts/ingest.ts`, `src/app/api/chat/route.ts`, Supabase utility formatting, and broad existing `any`/formatting diagnostics.

## Follow-Up

- Decide whether to enforce Biome on all existing files or narrow lint scope before final judging.
- Connect newsletter, auth, and reviews to Supabase tables if persistent multi-device accounts are required.
- Audit Supabase-hosted content directly for spelling and grammar before submission.
