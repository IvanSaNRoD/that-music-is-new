# Handoff: Crate Flip genre picker (option 3a)

> **Adapted to the project's Seiji-Kinari tokens (2026-11-12).** The original Claude Design export used an "Organic" theme (orange accent, Caprasimo/Figtree). All colors and fonts below are remapped to our tokens; sizes, timing and behavior are unchanged. `CrateFlip.jsx`, `crate-flip.css`, `styles.css` and the `.dc.html` files still show the original Organic theme — treat them as behavior/layout references only.

## Overview
Replaces the "Some genres to get you started…" chip grid on the That Music Is New home page. Genres are record sleeves standing in a crate. Tapping a sleeve lifts it to show its cover (name, origin and era, Play). Randomize, the Space key and History all drive the same selection.

## About the design files
The files here are **design references built in HTML**. They show the intended look and behavior; they are not production code. Recreate them in the target codebase's environment using its existing patterns. `CrateFlip.jsx` + `crate-flip.css` are a clean React reference of the exact behavior and animation, ready to adapt (swap their colors/fonts for the tokens in this README).

## Fidelity
**High-fidelity.** Type, spacing, timing and interactions are final. Colors and fonts: use the token mapping in this README.

## Screens / views
### Home (`Home with Crate Flip.dc.html`)
- 3-column responsive grid (`repeat(auto-fit, minmax(min(100%,300px),1fr))`, gap 28px, max-width 1320px): Hero | **Crate** | History. Below it are 3 step cards (Roll / Listen / Dig deeper).
- The crate panel and the History panel are both fixed at **500px** tall.

### Crate panel (the component)
- Panel: bg `card` #FAF6EE, border 1.5px `border-strong` (Sumi #1C1C1C), radius 16px, padding 26px, column flex, gap 14px, `overflow:hidden` (same card style as History).
- Header row: "The crate" in Inter Tight 800 24px (nowrap) on the left. On the right, a ghost button "Restock" (Inter 600 14px, color `primary-ink` #3B705D, padding 6px 12px, pill; hover bg primary-ink 10%, active 18%).
- Stack: `flex:1; min-height:0`, column, `justify-content:flex-end` (sleeves sit at the bottom), padding `0 14px 54px`.
- **Sleeve (closed)**: height 26px, margin-top −4px (overlap), radius `14px 14px 0 0`, padding `0 16px`, shadow `0 -2px 6px rgba(Sumi,14%)`. The tab label is Inter 700 13px, line-height 26px.
- **Sleeve (open)**: height **170px** (186px in the standalone 3a board). Contents, gap 6px:
  - Name: Inter Tight 800 40px, line-height 1
  - Meta "Origin · Era": Space Mono 14px
  - Pill "▶ Play 10 tracks": bg `background` Kinari #F3EBDA, text `foreground` Sumi #1C1C1C, Inter 700 14px, padding 8px 16px, margin-top 8px
- **Crate front**: absolute, bottom 0, full width, height 50px, bg `muted` #E6DCC6, border 1.5px Sumi, radius 16px, `--shadow-sm`. It has a centered handle 90×14px pill in `border` Matsuba #6E7B6A, 12px from the bottom. It overlaps the bottom 50px of the 54px stack padding.
- Sleeve colors `[bg, text]` are picked by the genre's catalog index % 6 (alternating light/dark; all pairs pass WCAG AA):
  1. `primary` Seiji #8DB6A5 / `foreground` Sumi #1C1C1C (7.60:1)
  2. `foreground` Sumi #1C1C1C / `background` Kinari #F3EBDA (14.37:1)
  3. `card` #FAF6EE / Sumi #1C1C1C (15.81:1)
  4. `primary-ink` #3B705D / Kinari #F3EBDA (4.84:1)
  5. `muted` #E6DCC6 / Sumi #1C1C1C (12.51:1)
  6. `muted-foreground` #4F5A4D / Kinari #F3EBDA (6.10:1)
  - Not used: Matsuba #6E7B6A (3.76:1 on Kinari, 3.82:1 on Sumi — fails AA for 13px text), `destructive` (reads as error).

## Interactions & behavior
- **Click a closed sleeve**: it becomes selected and opens; the previous one closes. The genre is added to the top of History. Clicking the open sleeve should trigger Play (wire it to your player).
- **Animation**: only `height` animates, 26px ↔ 170px, `0.3s cubic-bezier(.3,.7,.3,1)`. Closing and opening run at the same time, so the stack "flips". With `prefers-reduced-motion` the transition is off.
- **Randomize button / Space key**: picks a random genre other than the current one. Space is ignored while focus is in an input, textarea, select or button. If the genre is not in the crate, it takes the place of the top (oldest) sleeve, so the crate always holds 8.
- **Restock**: refills the crate with 8 random genres from the catalog and selects the first.
- **History**: newest first, max 8, no duplicates (re-picking moves an item to the top). Each item has an open action (calls the same `pick`) and ✕ remove. "Clear all history" empties it. The selected genre's row is highlighted with `muted` #E6DCC6.
- **Focus**: `:focus-visible` gets a 2px `primary-ink` #3B705D outline with 2px offset.

## State management
- `stock: string[8]`: genre ids shown in the crate, in order from top to bottom.
- `selected: string`: the open sleeve.
- `history: {id, date}[]`: max 8 items.
- Transitions:
  - `pick(id)` sets `selected`, swaps `id` into `stock` if it's missing, and prepends it to history.
  - `randomize()` calls `pick(random id ≠ selected)`.
  - `restock()` replaces `stock` with 8 shuffled ids, then calls `pick(stock[0])`.
- Data needed per genre: `id, name, origin, era`. Track loading (10 tracks) and Play wiring are up to the app.

## Design tokens (Seiji-Kinari theme)
| Token | Value | Use here |
| --- | --- | --- |
| background (Kinari) | #F3EBDA | page bg, Play pill, text on dark sleeves |
| card | #FAF6EE | crate panel, sleeve 3 |
| foreground / border-strong (Sumi) | #1C1C1C | text, card borders, sleeve 2, shadows |
| primary (Seiji) | #8DB6A5 | sleeve 1 |
| primary-ink | #3B705D | Restock, focus ring, sleeve 4 |
| muted | #E6DCC6 | crate front, History selected row, sleeve 5 |
| muted-foreground | #4F5A4D | secondary text, sleeve 6 |
| border (Matsuba) | #6E7B6A | crate handle |
| divider | #D9CDB4 | History row dividers |

- Fonts (Google Fonts, via `next/font`): Inter Tight 800 for headings; Inter 400/600/700 for UI text; Space Mono for meta/mono text.
- Radius: 8 / 16px; pills use 9999px.
- Strokes: 1.5px Sumi on cards.
- Shadows:
  - sm: `0 1px 2px rgba(28,28,28,.14)`
  - md: `0 3px 10px rgba(28,28,28,.16)`

## Assets
None. The sleeves, crate, vinyl decorations and icons are all CSS. The shuffle and history icons are Lucide at stroke-width 2.75.

## Files
- `CrateFlip.jsx`: React reference (the `useCrate` hook plus the `CrateFlip` component), with Space key, Randomize and Restock logic. Colors in `SLEEVE_COLORS` are Organic — replace with the 6 pairs above.
- `crate-flip.css`: the component's styles with the (Organic) tokens inlined.
- `Home with Crate Flip.dc.html`: full home page prototype (crate + hero + History + steps). Its logic is in the `<script data-dc-script>` block at the bottom.
- `Genre Picker Options.dc.html`: the exploration board. 3a is the standalone version of this component.
- `styles.css`: full Organic theme stylesheet (tokens + `.btn`, `.tag` classes used by the prototype) — reference only.
