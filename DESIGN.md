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
  mono-small:
    fontFamily: "Space Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  button-large:
    fontFamily: "Inter, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.2
  display-mobile:
    fontFamily: "Inter Tight, Inter, sans-serif"
    fontSize: "56px"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  sleeve: "14px"
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
  sleeve-closed:
    rounded: "{rounded.sleeve}"
    height: "42px"
    padding: "0 16px"
  sleeve-open:
    rounded: "{rounded.sleeve}"
    height: "180px"
    padding: "0 16px"
  step-card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.sleeve}"
    height: "96px"
---

# Design System: That Music Is New

## Overview

**Creative North Star: "The Record Crate"**

A second-hand record shop on warm paper. The page is kinari stock, every container is outlined in sumi ink like a printed object, and the music lives in things you can pull out: sleeves standing in a crate, vinyl discs, a stack of finds. Discovery should feel physical and a little analog, never like a streaming dashboard.

Density is calm: three columns on desktop (pitch, crate, history) inside a 1440px container, generous gutters, one loud headline. Color is restrained: paper neutrals carry the page, Seiji green is the single accent, and the record sleeves are the one place where the full palette shows at once. Type pairs a heavy, tight grotesk for voice with a monospace for catalog data (origins, eras, dates, counts), the way a shop labels its bins.

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
- **Aged Paper** (muted): selected history row (full), hovered row (50%), crate front, sleeve color.
- **Faded Ink** (muted-ink): secondary text (subtitles, meta, descriptions). 6.10:1 on paper.
- **Matsuba Pine** (matsuba): non-text marks only (crate handle, step connectors). Fails AA as text; never use it for copy.
- **Pencil Rule** (divider): hairlines between history rows and above footers.

### Tertiary
- **Shu Red** (destructive): errors and destructive confirmation only (e.g. "Clear" in the clear-all confirm, 5.25:1 on card).

### Named Rules
**The One Accent Rule.** Seiji is the only fill color outside the sleeves. If something else wants color, it gets ink or paper.

**The Ink-Readable Rule.** Any accent that is read as text uses Seiji Ink, never Seiji. Every text pair must pass WCAG AA (4.5:1; 3:1 for ≥24px).

**The Sleeve Palette Rule.** Record sleeves rotate through five AA-safe pairs by catalog index % 5: Seiji/Sumi, Sumi/Kinari, Aged Paper/Sumi, Seiji Ink/Kinari, Faded Ink/Kinari. No Card (white) sleeve: it blends into the crate panel. Each open sleeve shows a die-cut hole in a contrasting color (Kinari on Seiji and Seiji Ink, Seiji on Sumi and Faded Ink, Seiji Ink on Aged Paper), outlined 1px Sumi, with a Sumi spindle dot.

## Typography

**Display Font:** Inter Tight (with Inter, sans-serif)
**Body Font:** Inter (with sans-serif)
**Label/Mono Font:** Space Mono (with monospace)

**Character:** A dense, poster-weight grotesk shouts the one idea per screen; a typewriter mono files everything else like shop labels.

### Hierarchy
- **Display** (800, 80px desktop / 56px mobile, 0.95, -0.02em): the home headline only. Balanced wrap.
- **Headline** (800, 30–40px, 1–1.1, -0.02em): card titles ("The crate" and "History", both 30px; the crate is never smaller) and the open sleeve's genre name (40px).
- **Title** (800, 18px, 1.2): step card titles, kept quiet.
- **Body** (400, 17px, 1.5): subtitle in mono; UI body in Inter 14–17px. Max ~30em per line.
- **Label** (600–700, 13–26px): buttons (Randomize 26px bold), sleeve tabs (13px bold), history names (17px bold), links (15px semibold).
- **Mono** (Space Mono 400/700, 13–24px): logo (24 bold), eyebrow (15 uppercase), subtitle (17), meta "10 tracks · 24 Oct" (13), kbd (15).

### Named Rules
**The Catalog Label Rule.** Facts about music (origin, era, track count, date) are set in Space Mono. Persuasion and names are set in Inter / Inter Tight.

## Layout

Desktop (≥1024px): everything sits in a centred 1440px container with 48px side padding. Header: logo left, tagline + vinyl right, Sumi rule spanning the content width only. Main row (56px top, 32px gaps, equal-height columns, min 500px): Hero 36% | Crate (fills, 3% left margin) | History 27%; all three shrink together. Below, the "how it works" row is a grid in the same container: three equal step columns joined by 32px connectors, tagline on the right (56px gap). On tall screens the content block is centred vertically. The decorative vinyl (360px, 11 grooves, sheen just above 2 o'clock) sits with its centre on the left screen edge and its lower part cut off by the page bottom.

Tablet (768–1023px): main row stacks; the step cards + tagline form one centred group (cards max 26vw).

Mobile (<768px): single column, 24px side padding, same order (hero, crate, history, steps); step connectors become vertical. Touch layouts are not designed yet.

**Status:** only the desktop home is final (refined via live + critique, 2026-11-12/13). Loading, result, error, history-clear dialog and all mobile screens are still to be designed; Penpot (page "Screens") holds only preliminary, non-authoritative drafts of them. Extend this system to those screens rather than copying the drafts.

Spacing rhythm uses 8px steps (8 / 16 / 24 / 32 / 48 / 56).

## Elevation & Depth

Flat by default. The page carries a fine paper grain (fractal noise in Sumi, multiplied over the whole viewport at low opacity, fixed, non-interactive) so the kinari reads as stock rather than flat color. Separation comes from the 1.5px Sumi outline on primary containers and from paper tints (kinari → card → muted) on secondary ones, not from shadows. Shadows exist only on physical objects that stack or sit on something.

### Shadow Vocabulary
- **Sleeve lift** (`box-shadow: 0 -2px 6px rgb(28 28 28 / 0.14)`): sleeves overlapping each other in the crate.
- **Crate rest** (`box-shadow: 0 1px 2px rgb(28 28 28 / 0.14)`): the crate front sitting on the panel.

### Named Rules
**The Ink-Outline Rule.** Primary containers (crate, History) are defined by a 1.5px Sumi border, never by a shadow; never both on the same element. Secondary containers (step cards) drop the outline and sit as tonal Card Stock so they never compete with the crate.

## Shapes

Generously rounded, ink-outlined objects. Cards 16px; step cards 14px; sleeves 14px top corners only (open bottom, they stand in the crate; each sleeve overlaps the one behind by exactly its 14px radius, so the corners show the sleeve behind, not the panel); pills (9999px) for small controls (Restock, Play, history ✕); kbd 6px. Circles for vinyl and step badges. The only hand-drawn line is the Seiji Ink underline under "Discover something new".

## Components

### Buttons
- **Shape:** gently rounded (16px) for the primary; pills for small ghost actions.
- **Primary (Randomize):** Seiji fill, Sumi text and 1.5px Sumi outline, 22px/40px padding, Inter 26px bold with a 28px shuffle icon. Hover → Seiji pressed; active → 1px nudge down.
- **Ghost (Restock):** Seiji Ink text, no fill; hover 10% Seiji Ink tint, active 18%.
- **Text link (Clear all history, Undo):** Seiji Ink, 15px semibold, underline on hover; 50% opacity when disabled.
- **Pointer clicks drop focus** (`blurIfPointer`) so the global Space shortcut keeps working; keyboard activation keeps focus.
- **Focus:** 2px Seiji Ink outline, 2px offset.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** Card Stock.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1.5px Sumi.
- **Internal Padding:** 20–26px.

### Keyboard hint (kbd)
Sumi 1.5px outline, 6px radius, Space Mono 15px, next to "or press". Desktop only (≥1024px): Space = Randomize on hover-capable devices, ignored while focus is on a button, link or field; disabled on touch.

### History list
Last 5 played genres (added on Play, not on open). Rows separated by Pencil Rule hairlines; vinyl icon (44px, 4 grooves), name (Inter 17 bold) over mono meta (13px, Faded Ink), chevron on the right. Selected row = Aged Paper, hover = 50% Aged Paper; on hover/focus the chevron is replaced by a ✕ remove pill. Footer (aria-live): "Clear all history" → inline confirm "Clear all history? Cancel / Clear"; after a ✕, "Removed <name> · Undo" for 6s. Empty state: "Nothing here yet. Play a genre and it lands here."

### Record Crate (signature)
A card titled "The crate" (30px) with a Restock ghost button and ~40px of air above the stack. Eight sleeves stand bottom-aligned; each is 42px tall and overlaps the previous by 14px (visible tab 28px: 13px bold label, 3px vertical padding). All sleeves are positioned, so later sleeves always paint over earlier ones. The selected sleeve rises to 180px (166px visible): the tab label fades out, the genre name (Inter Tight 40) and a Kinari "Play 10 tracks" pill fade in, and an 88px die-cut hole (anchored to the sleeve top, centre at 154px) is revealed progressively as the sleeve rises; its lower part is clipped by the next sleeve and the spindle dot stays fully visible. Height animates 0.6s on the lift curve, text fades 0.2–0.35s, all off with `prefers-reduced-motion`. Playing a sleeve, not opening it, adds the genre to History. A 50px Aged Paper crate front (1.5px Sumi) with a Matsuba handle covers the last sleeve's feet by 14px.

### Step cards
Quiet and secondary: tonal Card Stock, no outline, 14px radius, 96px tall; equal grid columns on desktop (290px, max 26vw, on tablet), joined by 1px Matsuba connectors; a 40px Seiji badge (no outline) holds the number; title Inter Tight 18px.

## Do's and Don'ts

### Do:
- **Do** outline primary containers with 1.5px Sumi and keep them flat; let secondary ones sit as tonal Card Stock.
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
