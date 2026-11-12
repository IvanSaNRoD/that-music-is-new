// Crate Flip — reference implementation (React). Recreate in your codebase's conventions.
import { useCallback, useEffect, useState } from "react";
import "./crate-flip.css";

// Sleeve colour pairs [background, text], assigned by the genre's catalog index % 6.
const TONES = [
  ["var(--color-accent-2-300)", "var(--color-accent-2-900)"],
  ["var(--color-accent-200)", "var(--color-accent-900)"],
  ["var(--color-text)", "var(--color-bg)"],
  ["var(--color-accent-2-500)", "var(--color-bg)"],
  ["var(--color-accent)", "var(--color-bg)"],
  ["var(--color-neutral-200)", "var(--color-text)"],
];
const CRATE_SIZE = 8;

/**
 * catalog: [{ id, name, origin, era }]  — full genre list (used for Randomize/Restock)
 * initialStock: string[] of ids (8)     — sleeves shown in the crate
 * onPick(genre)                         — selection changed (add to history, load tracks)
 * onPlay(genre)                         — "Play 10 tracks" pressed
 */
export function useCrate(catalog, initialStock, onPick) {
  const [stock, setStock] = useState(initialStock);
  const [selected, setSelected] = useState(initialStock[0]);

  const pick = useCallback((id) => {
    setSelected(id);
    // If the genre isn't in the crate, it replaces the oldest (top) sleeve.
    setStock((s) => (s.includes(id) ? s : [...s.slice(1), id]));
    onPick?.(catalog.find((g) => g.id === id));
  }, [catalog, onPick]);

  const randomize = useCallback(() => {
    const pool = catalog.filter((g) => g.id !== selected);
    pick(pool[Math.floor(Math.random() * pool.length)].id);
  }, [catalog, selected, pick]);

  const restock = useCallback(() => {
    const next = [...catalog].sort(() => Math.random() - 0.5).slice(0, CRATE_SIZE).map((g) => g.id);
    setStock(next);
    pick(next[0]);
  }, [catalog, pick]);

  // Space = Randomize, except while typing or when a button has focus.
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space" || /INPUT|TEXTAREA|BUTTON|SELECT/.test(e.target.tagName)) return;
      e.preventDefault();
      randomize();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [randomize]);

  return { stock, selected, pick, randomize, restock };
}

export function CrateFlip({ catalog, stock, selected, onSelect, onRestock, onPlay }) {
  return (
    <section className="crate-panel" aria-label="Genre crate">
      <div className="crate-head">
        <h3 className="crate-title">The crate</h3>
        <button className="crate-restock" onClick={onRestock}>Restock</button>
      </div>
      <div className="crate-stack">
        {stock.map((id) => {
          const g = catalog.find((x) => x.id === id);
          const [bg, fg] = TONES[catalog.indexOf(g) % TONES.length];
          const open = id === selected;
          return (
            <button
              key={id}
              className="sleeve"
              aria-expanded={open}
              style={{ "--sleeve-bg": bg, "--sleeve-fg": fg }}
              onClick={() => (open ? onPlay?.(g) : onSelect(id))}
            >
              <span className="sleeve-tab">{g.name}</span>
              {open && (
                <>
                  <span className="sleeve-name">{g.name}</span>
                  <span className="sleeve-meta">{g.origin} · {g.era}</span>
                  <span className="sleeve-play">▶ Play 10 tracks</span>
                </>
              )}
            </button>
          );
        })}
        <div className="crate-front" aria-hidden="true" />
      </div>
    </section>
  );
}

/* Usage
const { stock, selected, pick, randomize, restock } = useCrate(GENRES, INITIAL_STOCK, addToHistory);
<RandomizeButton onClick={randomize} />
<CrateFlip catalog={GENRES} stock={stock} selected={selected} onSelect={pick} onRestock={restock} onPlay={playGenre} />
<History items={history} onOpen={pick} />
*/
