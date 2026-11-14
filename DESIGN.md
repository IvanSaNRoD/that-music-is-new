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
    fontSize: "18px"
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
  display-genre:
    fontFamily: "Inter Tight, Inter, sans-serif"
    fontSize: "64px"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline-large:
    fontFamily: "Inter Tight, Inter, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  track-title:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.4
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
  button-secondary:
    textColor: "{colors.sumi}"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
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
  turntable:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
    width: "440px"
    height: "400px"
  track-row:
    textColor: "{colors.sumi}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    typography: "{typography.track-title}"
  finds-pill:
    rounded: "{rounded.full}"
    padding: "4px 16px 4px 4px"
    typography: "{typography.label}"
  player-slot:
    rounded: "{rounded.xl}"
    height: "80px"
    width: "440px"
---

# Design System: That Music Is New

## Overview

**Creative North Star: "The Record Crate"**

A second-hand record shop on warm paper. The page is kinari stock, every container is outlined in sumi ink like a printed object, and the music lives in things you can pull out: sleeves standing in a crate, vinyl discs, a stack of finds. Discovery should feel physical and a little analog, never like a streaming dashboard.

Density is calm: three columns on the desktop home (pitch, crate, history) and two on a genre page (turntable, tracks) inside a 1440px container, generous gutters, one loud headline. Color is restrained: paper neutrals carry the page, Seiji green is the single accent, and the record sleeves are the one place where the full palette shows at once. Type pairs a heavy, tight grotesk for voice with a monospace for catalog data (origins, eras, dates, counts), the way a shop labels its bins.

**Key Characteristics:**
- Warm paper background with a fine paper grain, ink outlines (1.5px Sumi) instead of shadows.
- One accent (Seiji) for the primary action; Seiji Ink for text-level links and focus.
- Display type: Inter Tight 800, tight tracking; data and labels in Space Mono.
- Physical metaphors are geometry, not illustration: vinyl SVGs, sleeves, crate, turntable.
- A genre carries its sleeve tone from the crate to its own page.
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
**The One Accent Rule.** Seiji is the only fill color outside the sleeves (and what carries a sleeve tone, see the Genre Tone Rule). If something else wants color, it gets ink or paper.

**The Ink-Readable Rule.** Any accent that is read as text uses Seiji Ink, never Seiji. Every text pair must pass WCAG AA (4.5:1; 3:1 for ≥24px).

**The Sleeve Palette Rule.** Record sleeves rotate through five AA-safe pairs by catalog index % 5: Seiji/Sumi, Sumi/Kinari, Aged Paper/Sumi, Seiji Ink/Kinari, Faded Ink/Kinari. No Card (white) sleeve: it blends into the crate panel. Each open sleeve shows a die-cut hole in a contrasting color (Kinari on Seiji and Seiji Ink, Seiji on Sumi and Faded Ink, Seiji Ink on Aged Paper), outlined 1px Sumi, with a Sumi spindle dot.

**The Genre Tone Rule.** A genre's sleeve tone travels with it: on its genre page the turntable plinth, the playing track row and its "Your finds" pill wear that tone (same AA pair, full-strength foreground for secondary text, never alpha). No new hues: variety comes only from the five sleeve tones.

## Typography

**Display Font:** Inter Tight (with Inter, sans-serif)
**Body Font:** Inter (with sans-serif)
**Label/Mono Font:** Space Mono (with monospace)

**Character:** A dense, poster-weight grotesk shouts the one idea per screen; a typewriter mono files everything else like shop labels.

### Hierarchy
- **Display** (800, 80px desktop / 56px mobile, 0.95, -0.02em): the home headline only. Balanced wrap.
- **Genre title** (800, 64px ≥1280px / 56px 1024–1279px, 0.95, -0.02em): the genre name on its page, balanced wrap. Names longer than 22 characters step down to 48px so they stay within ~2 lines. 48px (line-height 1) for the not-found title.
- **Headline** (800, 30–40px, 1–1.1, -0.02em): card titles ("The crate" and "History", both 30px; the crate is never smaller) and the open sleeve's genre name (40px).
- **Title** (800, 18px, 1.2): step card titles and the "Your finds" heading, kept quiet.
- **Body** (400, 17px, 1.5): subtitle in mono; UI body in Inter 14–17px. Max ~30em per line.
- **Label** (600–700, 13–26px): buttons (Randomize 26px bold), sleeve tabs (13px bold), history names (17px bold), track titles (16px bold over 14px artists), links (15px semibold), Roll again (17px bold, secondary outline).
- **Mono** (Space Mono 400/700, 13–24px): logo (24 bold), eyebrow (15 uppercase), subtitle (17), meta "10 tracks · 24 Oct" (13), track numbers (13), "N tracks in the playlist" (15), "33⅓" (13), kbd (15).

### Named Rules
**The Catalog Label Rule.** Facts about music (origin, era, track count, date) are set in Space Mono. Persuasion and names are set in Inter / Inter Tight.

## Layout

Desktop (≥1024px): everything sits in a centred 1440px container with 48px side padding. Header: logo left, tagline + vinyl right, Sumi rule spanning the content width only. Main row (56px top, 32px gaps, equal-height columns, min 500px): Hero 36% | Crate (fills, 3% left margin) | History 27%; all three shrink together. Below, the "how it works" row is a grid in the same container: three equal step columns joined by 32px connectors, tagline on the right (56px gap). On tall screens the content block is centred vertically. The decorative vinyl (360px, 11 grooves, sheen just above 2 o'clock) sits with its centre on the left screen edge and its lower part cut off by the page bottom.

Genre page (`/{slug}`, ≥1024px): same container; two columns, deck | fluid info, 48px gap; the deck is 440px from 1280px and 360px between 1024 and 1279px. Deck column: "Back to the crate" link, turntable (scales down with the column, fixed 440:400 ratio), player slot. Info column: genre title with Listen more on Spotify + Roll again on the same line (right, wrapping below when tight), Space Mono meta, tracks (two columns of five from 1024px), then a Pencil Rule hairline and "Your finds". No steps band: an invisible, inert copy keeps its height so the page height (and the corner vinyl) match the home at 1440×900. History management lives on the home only.

Tablet (768–1023px): main row stacks; the step cards + tagline form one centred group (cards max 26vw).

Mobile (<768px): single column, 24px side padding, same order (hero, crate, history, steps); step connectors become vertical. Touch layouts are not designed yet.

**Open for the mobile/tablet pass** (collected 2026-11-13 from the genre-page audit; resolve with `/impeccable adapt`, then move the answers into this section):
- **Genre title** has no small-screen size: 64px "Psychedelic" already takes 353px at 390px wide; longer one-word names will overflow. Needs a mobile step (≈44–48px) and a check with ~40-char names.
- **Order on the genre page:** the turntable (full column width) comes before the tracks, so at 390px the list starts below the fold (page ≈1,540px tall). Playing a track is the primary action: consider tracks first, a smaller deck, or the deck beside the title.
- **Page actions:** "Listen more on Spotify" and "Back to the crate" are ≈34px tall (fine with a pointer); on touch they need ≥44px. Decide where Roll again lives for thumbs (top, or a bottom bar).
- **Hover-only affordances:** "Your finds" hover lift and the History row ✕ (shown on hover/focus) have no touch equivalent; the ✕ must be reachable without hover.
- **"Your finds" pills** wrap onto several lines on narrow screens; consider one scrollable row.
- **Tablet (768–1023px):** the genre page falls back to one column below 1024px; design it explicitly instead of inheriting the stack.
- **Unchanged by design:** the corner vinyl and the invisible steps spacer exist only ≥1024px; the Space shortcut and kbd hint stay off on touch.

**Status:** final on desktop: home (2026-11-12/13) and genre page with its loading, error, busy and empty states (2026-11-13, turntable). History-clear stays inline on the home. Tablet, mobile and touch layouts are still to be designed; Penpot (page "Screens") holds only preliminary, non-authoritative drafts of them. Extend this system to those screens rather than copying the drafts.

Spacing rhythm uses 8px steps (8 / 16 / 24 / 32 / 48 / 56).

## Elevation & Depth

Flat by default. The page carries a fine paper grain (fractal noise in Sumi, multiplied over the whole viewport at low opacity, fixed, non-interactive) so the kinari reads as stock rather than flat color. Separation comes from the 1.5px Sumi outline on primary containers and from paper tints (kinari → card → muted) on secondary ones, not from shadows. Shadows exist only on physical objects that stack or sit on something.

### Shadow Vocabulary
- **Sleeve lift** (`box-shadow: 0 -2px 6px rgb(28 28 28 / 0.14)`): sleeves overlapping each other in the crate.
- **Crate rest** (`box-shadow: 0 1px 2px rgb(28 28 28 / 0.14)`): the crate front sitting on the panel.
- **Record rest** (`box-shadow: 0 2px 6px rgb(28 28 28 / 0.18)`): the record on the turntable's platter. Set on a static wrapper so it never rotates with the disc.

### Named Rules
**The Ink-Outline Rule.** Primary containers (crate, History) are defined by a 1.5px Sumi border, never by a shadow; never both on the same element. Secondary containers (step cards) drop the outline and sit as tonal Card Stock so they never compete with the crate.

## Shapes

Generously rounded, ink-outlined objects. Cards 16px; step cards 14px; sleeves 14px top corners only (open bottom, they stand in the crate; each sleeve overlaps the one behind by exactly its 14px radius, so the corners show the sleeve behind, not the panel); pills (9999px) for small controls (Restock, Play, history ✕); kbd 6px. Circles for vinyl, platter, tonearm pivot and step badges. Track rows and "Your finds" are full pills; the turntable plinth is a 16px card; the tonearm is a pill bar with a 4px-radius head. The only hand-drawn line is the Seiji Ink underline under "Discover something new".

## Components

### Buttons
- **Shape:** gently rounded (16px) for the primary; pills for small ghost actions.
- **Primary (Randomize):** Seiji fill, Sumi text and 1.5px Sumi outline, 22px/40px padding, Inter 26px bold with a 28px shuffle icon. Hover → Seiji pressed; active → 1px nudge down.
- **Secondary (Roll again on a genre page):** no fill, 1.5px Sumi outline, Sumi text, 12px radius, 10px/20px padding, Inter 17px bold with a 20px shuffle icon; hover 50% Aged Paper, active 1px nudge. Secondary on purpose: on a genre page the task is playing a track, and Roll again discards the genre; Seiji fill there would also collide with the Seiji sleeve tone.
- **Ghost (Restock):** Seiji Ink text, no fill; hover 10% Seiji Ink tint, active 18%.
- **Text link (Clear all history, Undo):** Seiji Ink, 15px semibold, underline on hover; 50% opacity when disabled.
- **Pointer clicks drop focus** (`blurIfPointer`) so the global Space shortcut keeps working; keyboard activation keeps focus.
- **Focus:** 2px Seiji Ink outline, 2px offset. On a genre page focus moves to the title on arrival; it shows the same ring (4px offset, hugging the text) only when the visitor came by keyboard (lib/input-modality).

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

### Turntable (signature)
The genre page's record player, purely decorative (`aria-hidden`), geometry in % of a 440×400 plinth so it scales. Plinth: 16px radius, 1.5px Sumi outline, filled with the genre's sleeve tone (Card Stock while the route resolves); "33⅓" in Space Mono 13px in the tone's foreground, bottom right. A Card Stock platter (1.5px Sumi) sits under the record so the disc reads on every tone, Sumi included. Record: the detailed vinyl (340px) with the genre's hole colour as label, Record rest shadow. Tonearm: Aged Paper pill bar (8px, 1.5px Sumi) from a 44px Aged Paper pivot (Sumi centre dot), with an 18×28px head.

- **Arrive:** the record lands on the platter on mount (0.7s lift curve, from -32px / -90° and transparent). While the route resolves, the platter shows an empty dashed Pencil Rule circle.
- **Spin:** 1.8s linear per turn while loading or while a track plays; paused in place otherwise (never snaps back).
- **Track bands:** the record shows one band per track (3 fine grooves each, separated by a smooth dark gap, like a real LP), track 1 at the rim and the last next to the label.
- **Arm:** while a track plays it drops into that track's band (≈16° for track 1 → ≈33° for track 10, computed so the needle sits mid-band) and glides to the new band when the track changes (0.7s lift curve); up while loading.
- **Failure states:** error and busy (429) show the empty platter (no record could be pulled); empty keeps a still record ("This record is blank").
- All motion off with `prefers-reduced-motion`.

### Track list
Up to 10 rows, full pills (8px/16px padding, 2px gap): Space Mono number (13px, Faded Ink) or an Audio Lines icon on the playing row, title (Inter 16 bold) over artists (14px, Faded Ink), both truncated. Hover = 50% Aged Paper and the number turns into a filled ▶ (also on keyboard focus), so rows read as play buttons; playing row = the genre's sleeve tone, every text in the tone's foreground; on the light tones (Seiji 1.89:1 and Aged Paper 1.15:1 against the page) it also gets a 1.5px inset Sumi edge. Until the first play, row 01 is cued (a 14% tint of the genre tone, of Sumi on the light tones, and a resting ▶; no ring, rings are reserved for keyboard focus) and the meta line adds "· pick one to start listening" (Inter, same line, fixed 24px line height so nothing shifts when it goes). Focus: 2px Seiji Ink outline outside the pill. Loading = 10 skeleton rows pulsing in Aged Paper.

### Your finds
The compact History trail on a genre page, below a Pencil Rule hairline: "Your finds" (Inter Tight 18) and the last 5 played genres as pill links. Each pill wears its genre's sleeve tone (1.5px Sumi outline, 28px vinyl with that tone's hole colour as label, 15px semibold name). Current genre = 2px Sumi ring with 2px offset. Hover lifts 2px (0.2s lift curve). A genre added while on its page rolls in (0.5s: slide 12px + disc turning 180°). Empty: "Play a track and this genre lands here."

### Player slot
Placeholder for the single compact Spotify Embed (~80px, 440px wide) under the turntable: dashed 1.5px Matsuba outline, 16px radius, 36px vinyl, now-playing title/artists or "Nothing playing yet.". Before the first play a Space Mono "Spotify player" label; once a track plays it becomes the hand-off: a secondary Sumi-outlined pill "Dig deeper on Spotify ↗" (14px semibold; "Dig deeper ↗" visible on the 360px deck, same accessible name). Replaced by the embed in E4.3; the turntable then follows the embed's playback state. Last in the DOM (read after title, tracks and finds); the grid places it under the deck. Always occupies its slot (invisible outside the ready state), so the page height never changes between loading, ready and failure states.

### Step cards
Home only. Quiet and secondary: tonal Card Stock, no outline, 14px radius, 96px tall; equal grid columns on desktop (290px, max 26vw, on tablet), joined by 1px Matsuba connectors; a 40px Seiji badge (no outline) holds the number; title Inter Tight 18px.

## Do's and Don'ts

### Do:
- **Do** outline primary containers with 1.5px Sumi and keep them flat; let secondary ones sit as tonal Card Stock.
- **Do** use Seiji as a fill and Seiji Ink whenever the accent must be read.
- **Do** set catalog data (origin, era, counts, dates, shortcuts) in Space Mono.
- **Do** draw music objects (vinyl, sleeves, crate) as exact vector geometry.
- **Do** verify every text pair at WCAG AA and keep visible Seiji Ink focus rings.
- **Do** keep the paper grain subtle: texture you notice up close, never a pattern that competes with text.
- **Do** let a genre's sleeve tone travel with it (turntable plinth, playing row, its "Your finds" pill), with full-strength tone foreground for all text on it.

### Don't:
- **Don't** use the Spotify logo as decoration; the vinyl is the brand mark.
- **Don't** use Seiji or Matsuba as text color.
- **Don't** combine a border and a drop shadow on the same container.
- **Don't** introduce a second accent hue; the red is reserved for errors. Colour variety comes only from the five sleeve tones.
