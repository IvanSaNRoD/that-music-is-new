---
name: That Music Is New
description: One click to a rare music genre — a record crate on warm paper.
colors:
  kinari: "#F3EBDA"
  card: "#FAF6EE"
  sumi: "#1C1C1C"
  seiji: "#8DB6A5"
  seiji-hover: "#7AA593"
  seiji-ink: "#3B705D"
  muted: "#E6DCC6"
  muted-ink: "#4F5A4D"
  matsuba: "#6E7B6A"
  divider: "#D9CDB4"
  destructive: "#B3412F"
typography:
  display:
    fontFamily: "Inter Tight, Inter, sans-serif"
    fontSize: "80px"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter Tight, Inter, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter Tight, Inter, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.3
  mono:
    fontFamily: "Space Mono, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.seiji}"
    textColor: "{colors.sumi}"
    rounded: "{rounded.xl}"
    padding: "22px 40px"
  button-primary-hover:
    backgroundColor: "{colors.seiji-hover}"
  button-ghost:
    textColor: "{colors.seiji-ink}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
    padding: "26px"
  kbd:
    textColor: "{colors.sumi}"
    rounded: "6px"
    padding: "4px 10px"
  history-row:
    textColor: "{colors.sumi}"
    padding: "16px 16px 16px 20px"
  history-row-selected:
    backgroundColor: "{colors.muted}"
  sleeve-open:
    rounded: "14px 14px 0 0"
    height: "170px"
    padding: "0 16px"
---

# Design System: That Music Is New

## Overview

**Creative North Star: "The Record Crate"**

A second-hand record shop on warm paper. The page is kinari stock, every container is outlined in sumi ink like a printed object, and the music lives in things you can pull out: sleeves standing in a crate, vinyl discs, a stack of finds. Discovery should feel physical and a little analog, never like a streaming dashboard.

Density is calm: three columns on desktop (pitch, crate, history), generous gutters, one loud headline. Color is restrained: paper neutrals carry the page, Seiji green is the single accent, and the record sleeves are the one place where the full palette shows at once. Type pairs a heavy, tight grotesk for voice with a monospace for catalog data (origins, eras, dates, counts), the way a shop labels its bins.

**Key Characteristics:**
- Warm paper background with a fine paper grain, ink outlines (1.5px Sumi) instead of shadows.
- One accent (Seiji) for the primary action; Seiji Ink for text-level links and focus.
- Display type: Inter Tight 800, tight tracking; data and labels in Space Mono.
- Physical metaphors are geometry, not illustration: vinyl SVGs, sleeves, crate.
- Light theme only.

## Colors

Paper, ink and one celadon green; everything else is a tint of the paper.

### Primary
- **Seiji Celadon** (seiji): the primary action fill (Randomize button), step badges, vinyl labels, sparkles, text selection. Never used as text color (1.89:1 on paper).
- **Seiji Ink** (seiji-ink): the accent when it must be read: ghost buttons (Restock), "Clear all history", focus rings, hand-drawn underline. 4.84:1 on paper.
- **Seiji Celadon, pressed** (seiji-hover): hover fill of the primary button.

### Neutral
- **Kinari Paper** (kinari): page background; text on dark sleeves; the Play pill.
- **Card Stock** (card): all containers (crate, history, step cards). Never a sleeve color.
- **Sumi Ink** (sumi): all text, every card outline, the header rule, vinyl discs, dark sleeves.
- **Aged Paper** (muted): selected/hovered history row, crate front, kbd-free tints.
- **Faded Ink** (muted-ink): secondary text (subtitles, meta, descriptions). 6.10:1 on paper.
- **Matsuba Pine** (matsuba): non-text marks only (crate handle). Fails AA as text; never use it for copy.
- **Pencil Rule** (divider): hairlines between history rows and above footers.

### Tertiary
- **Shu Red** (destructive): errors and destructive confirmation only.

### Named Rules
**The One Accent Rule.** Seiji is the only fill color outside the sleeves. If something else wants color, it gets ink or paper.

**The Ink-Readable Rule.** Any accent that is read as text uses Seiji Ink, never Seiji. Every text pair must pass WCAG AA (4.5:1; 3:1 for ≥24px).

**The Sleeve Palette Rule.** Record sleeves rotate through five AA-safe pairs by catalog index % 5: Seiji/Sumi, Sumi/Kinari, Aged Paper/Sumi, Seiji Ink/Kinari, Faded Ink/Kinari. No Card (white) sleeve: it blends into the crate panel. Each open sleeve shows a die-cut hole in a contrasting color (Kinari on Seiji and Seiji Ink, Seiji on Sumi and Faded Ink, Seiji Ink on Aged Paper).

## Typography

**Display Font:** Inter Tight (with Inter, sans-serif)
**Body Font:** Inter (with sans-serif)
**Label/Mono Font:** Space Mono (with monospace)

**Character:** A dense, poster-weight grotesk shouts the one idea per screen; a typewriter mono files everything else like shop labels.

### Hierarchy
- **Display** (800, 80px desktop / 56px mobile, 0.95, -0.02em): the home headline only. Balanced wrap.
- **Headline** (800, 24–40px, 1–1.1, -0.02em): card titles ("History" 30px, "The crate" 24px) and the open sleeve's genre name (40px).
- **Title** (800, 22px, 1.2): step card titles.
- **Body** (400, 17px, 1.5): subtitle in mono; UI body in Inter 14–17px. Max ~30em per line.
- **Label** (600–700, 13–26px): buttons (Randomize 26px bold), sleeve tabs (13px bold), history names (17px bold), links (15px semibold).
- **Mono** (Space Mono 400/700, 13–24px): logo (24 bold), eyebrow (15 uppercase), meta "10 tracks · 24 Oct" (13), origin · era (14), kbd (15).

### Named Rules
**The Catalog Label Rule.** Facts about music (origin, era, track count, date) are set in Space Mono. Persuasion and names are set in Inter / Inter Tight.

## Layout

Desktop (≥1024px): header with 48px side padding and a full-width Sumi rule; a main row with 56px top padding and 32px gaps: Hero (480px fixed) | Crate (fills) | History (320px fixed), all stretched to equal height (min 500px). Below, the "how it works" row is indented 240px on the left to clear the decorative vinyl (360px disc whose centre hole sits on the left screen edge).

Mobile (<1024px): single column, 24px side padding, same order (hero, crate, history, steps); step connectors become vertical.

**Status:** only the desktop home is final. Loading, result, error, history-clear dialog and all mobile screens are still to be designed; Penpot (page "Screens") holds only preliminary, non-authoritative drafts of them. Extend this system to those screens rather than copying the drafts.

Spacing rhythm uses 8px steps (8 / 16 / 24 / 32 / 48 / 56).

## Elevation & Depth

Flat by default. The page carries a fine paper grain (fractal noise in Sumi, multiplied over the whole viewport at low opacity, fixed, non-interactive) so the kinari reads as stock rather than flat color. Separation comes from the 1.5px Sumi outline and from paper tints (kinari → card → muted), not from shadows. Shadows exist only on physical objects that stack or sit on something.

### Shadow Vocabulary
- **Sleeve lift** (`box-shadow: 0 -2px 6px rgb(28 28 28 / 0.14)`): sleeves overlapping each other in the crate.
- **Crate rest** (`box-shadow: 0 1px 2px rgb(28 28 28 / 0.14)`): the crate front sitting on the panel.

### Named Rules
**The Ink-Outline Rule.** Containers are defined by a 1.5px Sumi border, never by a shadow. Never both on the same element.

## Shapes

Generously rounded, ink-outlined objects. Cards 16px; step cards 14px; sleeves 14px top corners only (open bottom, they stand in the crate); pills (9999px) for small controls (Restock, Play, history ✕); kbd 6px. Circles for vinyl and step badges. The only hand-drawn line is the Seiji Ink underline under "Discover something new".

## Components

### Buttons
- **Shape:** gently rounded (16px) for the primary; pills for small ghost actions.
- **Primary (Randomize):** Seiji fill, Sumi text and 1.5px Sumi outline, 22px/40px padding, Inter 26px bold with a 28px shuffle icon. Hover → Seiji pressed; active → 1px nudge down.
- **Ghost (Restock):** Seiji Ink text, no fill; hover 10% Seiji Ink tint, active 18%.
- **Text link (Clear all history):** Seiji Ink, 15px semibold, underline on hover; 50% opacity when disabled.
- **Focus:** 2px Seiji Ink outline, 2px offset.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** Card Stock.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1.5px Sumi.
- **Internal Padding:** 20–26px.

### Keyboard hint (kbd)
Sumi 1.5px outline, 6px radius, Space Mono 15px, next to "or press".

### History list
Rows separated by Pencil Rule hairlines; vinyl icon (44px), name (Inter 17 bold) over mono meta (13px, Faded Ink), chevron on the right. Hover and selected rows tint to Aged Paper; on hover/focus the chevron is replaced by a ✕ remove pill. Footer: hairline + "Clear all history".

### Record Crate (signature)
A card titled "The crate" with a Restock ghost button. Eight sleeves stand bottom-aligned, overlapping by 4px, each a 26px tab showing the genre name. The selected sleeve rises to 170px, drops its tab label and shows the genre name (Inter Tight 40) and a Kinari "Play 10 tracks" pill, with an 88px die-cut hole centred just above its bottom edge (lower part clipped, 8px spindle dot visible). Playing a sleeve, not opening it, adds the genre to History (last 5). Only height animates (0.3s, cubic-bezier(0.3, 0.7, 0.3, 1)); opening and closing run together so the stack flips. Off with `prefers-reduced-motion`. A 50px Aged Paper crate front with a Matsuba handle covers the sleeves' feet.

### Step cards
290×110px cards joined by 1.5px Sumi connectors; a 44px Seiji circle badge with Sumi outline holds the number.

## Do's and Don'ts

### Do:
- **Do** outline every container with 1.5px Sumi and keep it flat.
- **Do** use Seiji as a fill and Seiji Ink whenever the accent must be read.
- **Do** set catalog data (origin, era, counts, dates, shortcuts) in Space Mono.
- **Do** draw music objects (vinyl, sleeves, crate) as exact vector geometry.
- **Do** verify every text pair at WCAG AA and keep visible Seiji Ink focus rings.
- **Do** keep the paper grain subtle: texture you notice up close, never a pattern that competes with text.

### Don't:
- **Don't** use the Spotify logo as decoration; the vinyl is the brand mark.
- **Don't** use Seiji or Matsuba as text color.
- **Don't** combine a border and a drop shadow on the same container.
- **Don't** introduce a second accent hue; the red is reserved for errors.
