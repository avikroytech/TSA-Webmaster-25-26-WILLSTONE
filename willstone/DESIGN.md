---
name: Willstone City
description: Official civic brand system for a calm, modern resident services hub.
colors:
  civic-teal: "#173b3f"
  harbor-green: "#3f6256"
  civic-copper: "#b98d63"
  meeting-gold: "#d5b08c"
  parchment-bg: "#f8f4ec"
  civic-paper: "#fbfaf7"
  soft-stone: "#f5f0eb"
  field-stone: "#efece6"
  rule-stone: "#ded6c9"
  muted-text: "#48605b"
  night-bg: "#142323"
  night-paper: "#203838"
  success-green: "#496A49"
  form-teal: "#264D52"
typography:
  display:
    fontFamily: "Source Sans 3, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(2.7rem, 6vw, 5.4rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "0"
  headline:
    fontFamily: "Source Sans 3, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "0"
  title:
    fontFamily: "Source Sans 3, Segoe UI, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 900
    lineHeight: 1.12
    letterSpacing: "0"
  body:
    fontFamily: "Inter, Segoe UI, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.75
    letterSpacing: "0"
  label:
    fontFamily: "Inter, Segoe UI, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "0.16em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "14px"
  xl: "16px"
  panel: "24px"
  feature: "32px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "72px"
components:
  button-primary:
    backgroundColor: "{colors.civic-teal}"
    textColor: "{colors.parchment-bg}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.harbor-green}"
    textColor: "{colors.parchment-bg}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "48px"
  button-accent:
    backgroundColor: "{colors.civic-copper}"
    textColor: "{colors.parchment-bg}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  card-civic:
    backgroundColor: "{colors.civic-paper}"
    textColor: "{colors.civic-teal}"
    rounded: "{rounded.lg}"
    padding: "20px"
  input-search:
    backgroundColor: "{colors.civic-paper}"
    textColor: "{colors.civic-teal}"
    rounded: "{rounded.md}"
    padding: "16px 56px 16px 24px"
    height: "56px"
---

# Design System: Willstone City

## 1. Overview

**Creative North Star: "The Civic Harbor"**

Willstone should feel like a well-run municipal office beside the water: practical, quiet, and unmistakably official. The system uses deep civic teal as the authority color, parchment surfaces for public readability, and copper-gold accents for resident actions. Imagery and the four-island structure carry the brand, while task routes stay visible.

This is a brand-led civic site, but residents still need to get things done. The homepage can make an impression, yet the Resource Hub, map, calendar, request form, and Beacon entry points must stay fast, calm, and legible.

**Key Characteristics:**
- Image-led civic identity with dark teal overlays.
- Rectangular municipal controls, not pill-heavy startup UI.
- Soft paper surfaces with restrained shadows and clear borders.
- Heavy, compact headings balanced by readable service copy.
- Accessibility settings reinforce the brand promise, they do not excuse inaccessible defaults.

## 2. Colors

The palette is restrained civic warmth: deep teal for authority, muted green for support, copper and gold for civic action, and parchment neutrals for trust.

### Primary
- **Civic Teal**: The core authority color. Use it for headers, active navigation, primary buttons, hero overlays, map stages, and major civic surfaces.
- **Harbor Green**: The supporting civic green. Use it for hover states, secondary labels, low-emphasis icons, and trust-building detail.

### Secondary
- **Civic Copper**: The resident action accent. Use it for submit actions, important CTAs, and small emphasis marks.
- **Meeting Gold**: The warm public-meeting accent. Use it on dark teal surfaces for eyebrow labels, hero CTAs, progress marks, and focus glows.

### Neutral
- **Parchment Background**: The main page canvas. Use it for broad sections and quiet civic continuity.
- **Civic Paper**: The raised surface color. Use it for cards, dropdowns, utility panels, and high-readability form areas.
- **Soft Stone**: The alternate section surface. Use it for subpage bodies and form pages.
- **Field Stone**: The recessed input surface, especially in Beacon.
- **Rule Stone**: The standard border and divider color.
- **Muted Text**: The secondary text color on light backgrounds.
- **Night Background** and **Night Paper**: Dark mode surfaces. Use sparingly and keep contrast high.

### Named Rules
**The Official Color Rule.** Civic Teal must appear on every major page as a structural color, not as decoration.

**The Copper Rarity Rule.** Civic Copper is for resident action. Do not scatter it across passive icons or decorative flourishes.

## 3. Typography

**Display Font:** Source Sans 3 with Segoe UI and Arial fallback
**Body Font:** Inter with Segoe UI and Arial fallback
**Label/Mono Font:** Inter with Segoe UI and Arial fallback

**Character:** The type system is civic, direct, and slightly institutional. Display text is heavy and compact for confidence; body text stays familiar and readable for residents scanning services.

### Hierarchy
- **Display** (900, clamp(2.7rem, 6vw, 5.4rem), 0.95): Hero and subpage page titles only.
- **Headline** (900, clamp(2rem, 4vw, 3rem), 1): Section headings and major feature blocks.
- **Title** (900, 1.5rem, 1.12): Cards, panels, event titles, and form section titles.
- **Body** (600, 1rem, 1.75): Service explanations, resource descriptions, and civic copy. Keep prose near 65 to 75 characters per line where possible.
- **Label** (900, 0.75rem, 0.16em, uppercase): Eyebrows, metadata, counters, and compact civic labels.

### Named Rules
**The Municipal Label Rule.** Uppercase tracking is allowed for short labels only. Never use all-caps body copy.

**The No Reflex Font Rule.** Do not add decorative serif, mono, or trendy display families unless they serve the municipal voice.

## 4. Elevation

Willstone uses a hybrid of tonal layering, thin borders, and soft shadows. Surfaces should feel paper-like and dependable, not glossy. Shadows are ambient and shallow at rest, becoming slightly clearer on hover or in overlays.

### Shadow Vocabulary
- **Civic Card Rest** (`0 12px 36px rgba(23, 59, 63, 0.07)`): Default reusable card shadow.
- **Civic Card Hover** (`0 18px 46px rgba(23, 59, 63, 0.11)`): Hover lift for interactive cards only.
- **Dropdown Panel** (`0 18px 45px rgba(23, 59, 63, 0.14)`): Menus and floating panels.
- **Beacon Drawer** (`-20px 0 60px rgba(0, 0, 0, 0.10)`): The assistant side panel.
- **Deep Panel** (`0 25px 50px -12px rgba(0, 0, 0, 0.25)`): Forms, accessibility panels, and high-priority overlays.

### Named Rules
**The Paper Lift Rule.** A surface may lift when it is interactive or layered above the page. Static civic information should rely on borders and spacing first.

## 5. Components

### Buttons
- **Shape:** Rectangular with modest civic rounding (8px to 12px). Use full pills only for small utility controls or chips.
- **Primary:** Civic Teal background, parchment text, bold weight, 44px to 48px minimum height.
- **Accent:** Civic Copper or Meeting Gold only for high-value resident actions such as Submit Resource or hero CTA.
- **Hover / Focus:** Hover darkens or shifts to Harbor Green. Focus uses a visible Meeting Gold outline or ring.
- **Secondary / Ghost:** Use a Rule Stone border with Civic Paper background. Keep labels short and functional.

### Chips
- **Style:** Small rounded pills with Civic Paper background, thin teal-tint border, and bold 11px to 12px labels.
- **State:** Selected chips may invert to Civic Teal with parchment text. Unselected chips stay quiet.

### Cards / Containers
- **Corner Style:** Civic cards use 14px rounding. Larger panels may use 24px or 32px only when they frame a full tool or overlay.
- **Background:** Civic Paper on Parchment Background, or light translucent paper over image-led surfaces.
- **Shadow Strategy:** Use Civic Card Rest at default and Civic Card Hover only on clickable cards.
- **Border:** Rule Stone or low-opacity Civic Teal border. Avoid colored side stripes.
- **Internal Padding:** 20px for compact cards, 24px to 32px for resource cards and forms.

### Inputs / Fields
- **Style:** Civic Paper or Field Stone backgrounds, 1px to 2px border, 8px to 16px rounding, bold resident-readable text.
- **Focus:** Border shifts to Civic Teal or Harbor Green with a Meeting Gold or teal-tint ring.
- **Error / Disabled:** Error copy is explicit and placed next to the field. Disabled controls reduce opacity but keep labels readable.

### Navigation
- **Style, typography, default/hover/active states, mobile treatment.** The header is a two-tier civic bar: a dark utility strip above a paper navigation row. Active links invert to Civic Teal. The More menu uses a Civic Paper dropdown with icons, 14px bold labels, and clear current-page states. Mobile navigation opens inline under the header with the same link vocabulary.

### Signature Component: Beacon

Beacon is the resident assistant. It should feel like a civic help desk, not a chatbot novelty. The drawer uses Field Stone inputs, rounded message bubbles, source cards, and plain language prompts. Keep Beacon visually connected to the main site through Civic Teal and Harbor Green, not through glow or sci-fi effects.

## 6. Do's and Don'ts

### Do:
- **Do** make the city feel official before it feels promotional.
- **Do** keep resident routes visible: Services, Calendar, Map, Government, About, Submit Resource, and Beacon.
- **Do** use the four-island identity as structure through maps, locations, filters, and civic storytelling.
- **Do** use real imagery or map assets on brand surfaces. A civic homepage without imagery feels unfinished.
- **Do** preserve WCAG AA defaults, visible focus states, reduced motion support, and high contrast mode.
- **Do** use Civic Teal as the visual anchor and Civic Copper only for important resident actions.

### Don't:
- **Don't** create generic AI slop: template landing-page sections, vague inspirational copy, identical card grids, ornamental gradients, excessive glow effects, glassmorphism as decoration, or generic SaaS aesthetics.
- **Don't** use fantasy-game styling, overly whimsical city lore, cluttered government portal visuals, or corporate startup visuals.
- **Don't** hide practical services behind decorative storytelling.
- **Don't** use gradient text, colored side-stripe borders, or glass cards as default styling.
- **Don't** repeat tiny uppercase tracked labels above every section unless the label adds real civic context.
- **Don't** add decorative motion that delays a resident from completing a task.
