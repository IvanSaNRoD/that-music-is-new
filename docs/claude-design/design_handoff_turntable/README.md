# Handoff: Turntable results screen (option 1b)

## Overview
This is the That Music Is New results screen, shown after **Randomize**. The rolled genre plays on a turntable. Pressing play starts the vinyl spinning and drops the tonearm onto the record. On the right are the genre name, its meta and the 10-track list. The **History** column keeps its current design and sits to the right; it is not included here.

## About the design files
These are **design references built in HTML**. They are not production code. Recreate them in your codebase with its own patterns. `Turntable.jsx` + `turntable.css` are a clean React reference of the exact layout, states and animation. `Results Options.dc.html` is the live prototype (option **1b**; its logic is in the `<script data-dc-script>` block).

## Fidelity
**High-fidelity.** The colors, type, sizes, timing and interactions are final.

## Layout
- **Screen:** padding 28px 36px. It is a column with gap 24px:
  - a top bar
  - a body row with gap 40px, aligned to the top
- **Top bar:**
  - Left: "← Back to the crate" (Figtree 600 14px, #8f4f25, no underline).
  - Right, gap 12px: "Listen more on Spotify ↗" (link), then a secondary pill button "⤮ Roll again".
- **Deck column (fixed 420px):**
  - **Plinth:** 420×400, radius 28px, bg #d8cfc0, shadow-sm.
  - **Vinyl:** 330px, positioned at left 24, top 35.
  - **Pivot:** a 48px circle in #a39a8a at right 26, top 24.
  - **Tonearm:** 10×250 bar in #645c50 (pill ends), at right 45, top 48, `transform-origin: 5px 0`. Its head is a 24×34 rounded rectangle (radius 8) in #201e1d, at bottom −14 and left −7.
  - **"33⅓":** Figtree 700 12px, #645c50, bottom-right 20/22.
  - **Controls under the plinth:** gap 10, 16px below. ⏮ (secondary, flex 1), ▶ Play / ❚❚ Pause (primary, flex 2), ⏭ (secondary, flex 1).
- **Info column (flex 1):**
  - Genre name: Caprasimo 48px, line-height 1.
  - Meta line: "Origin · Era · 10 of N tracks", Figtree 14px, #645c50.
  - Tracklist with 10 pill rows (radius 999, padding 6px 16px, gap 2px). Each row:
    - Number, 22px wide: Figtree 700 13px in #8f4f25. It shows ▶ while the row is playing and ❚❚ while it is paused.
    - Title: 700 14px.
    - Artist: 12px, #645c50.
    - Duration: 12px, right-aligned.

## Vinyl (pure CSS)
- **Grooves:** `repeating-radial-gradient` alternating #201e1d and a mix of 84% text with bg, at 2px/1px.
- **Label:** a centre circle filling up to 31% radius, with a 2.5% bg-coloured spindle hole. Its colour comes from the genre (`--label`).
- **Rim:** a thin dark ring at 31.5–34%.
- **Sheen:** a `::after` `conic-gradient` with two soft highlights, so the rotation is visible.

## Interactions & animation
- **Play / Pause:**
  - The vinyl spins at `vinylspin 1.8s linear infinite`. It runs only while playing (`animation-play-state`), so pausing freezes it where it is instead of snapping back.
  - The tonearm rotates 0° → **24°** (onto the record) over **0.7s, cubic-bezier(.3,.7,.3,1)**. It goes back to 0° on pause.
- **First Play** with no track selected starts track 1.
- **Clicking a row:**
  - Another track: plays it.
  - The current track: toggles play/pause.
  - The playing row gets a #dde7cc fill (the same colour as hover).
- **⏮ / ⏭:** wrap around the 10 tracks and auto-play.
- **Roll again:** stops playback, lifts the arm, clears the selection, then loads a new random genre. The label colour changes with it.
- **Focus:** `:focus-visible` shows a 2px #c67139 outline with 2px offset.
- **Reduced motion:** with `prefers-reduced-motion`, the record doesn't spin and the arm doesn't animate.

## State
`current: number | null` and `playing: boolean`, both inside `useDeck`. The genre and its tracks come from the app; `onRoll` swaps them. Wire `onPlayTrack` / `onPause` to the Spotify embed or SDK.

## Data
- **Genre:** `{ id, name, origin, era, count, label }`
- **Track:** `{ id, title, artist, dur }`
- **Label colours used** (by genre), each from the theme's colour scale:
  - #c67139
  - #ccdbb2
  - #8fa073
  - #ffe1d0

## Tokens (Organic)
- **Colours:**
  - bg #f5ead8
  - surface #ebddc5
  - text #201e1d
  - accent #c67139
  - accent-700 #8f4f25
  - accent-2-200 #dde7cc
  - neutral-300 #d8cfc0
  - neutral-500 #a39a8a
  - neutral-700 #645c50
- **Fonts:** Caprasimo (headings) and Figtree 400/600/700 (body), both from Google Fonts.
- **Radius:** 28px for containers, 999px for pills.
- **Shadows:**
  - sm: `0 1px 2px rgba(46,43,37,.14)`
  - md: `0 3px 10px rgba(46,43,37,.16)`

## Files
- `Turntable.jsx`: `useDeck` hook, `Vinyl` and `TurntableResults` components.
- `turntable.css`: the component styles, with the tokens inlined.
- `Results Options.dc.html`: the prototype board (1b is the turntable).
- `styles.css`: the full Organic theme stylesheet.
