// Turntable results screen (option 1b): a React reference. Adapt it to your codebase.
import { useCallback, useState } from "react";
import "./turntable.css";

/**
 * genre:  { id, name, origin, era, count, label }  (label = CSS colour for the vinyl centre)
 * tracks: [{ id, title, artist, dur }]  (10 items)
 * onRoll():           Roll again (fetch a new random genre)
 * onBack():           Back to the crate
 * onPlayTrack(track): wire to your Spotify player
 * onPause():
 * spotifyUrl
 */
export function useDeck(tracks, { onPlayTrack, onPause } = {}) {
  const [current, setCurrent] = useState(null); // index | null
  const [playing, setPlaying] = useState(false);

  const play = useCallback((i) => { setCurrent(i); setPlaying(true); onPlayTrack?.(tracks[i]); }, [tracks, onPlayTrack]);
  const toggle = useCallback(() => {
    if (current == null) return play(0);              // first press starts at track 1
    if (playing) { setPlaying(false); onPause?.(); } else play(current);
  }, [current, playing, play, onPause]);
  const prev = useCallback(() => play(((current ?? 0) + tracks.length - 1) % tracks.length), [current, tracks, play]);
  const next = useCallback(() => play(((current ?? -1) + 1) % tracks.length), [current, tracks, play]);
  const select = useCallback((i) => (i === current ? toggle() : play(i)), [current, toggle, play]);
  const reset = useCallback(() => { setCurrent(null); setPlaying(false); }, []);

  return { current, playing, toggle, prev, next, select, reset };
}

export function Vinyl({ size, label, playing }) {
  return <div className="vinyl" data-playing={playing} style={{ width: size, height: size, "--label": label }} aria-hidden="true" />;
}

export function TurntableResults({ genre, tracks, onRoll, onBack, spotifyUrl, onPlayTrack, onPause }) {
  const deck = useDeck(tracks, { onPlayTrack, onPause });
  const roll = () => { deck.reset(); onRoll?.(); };   // a new genre stops the record and lifts the arm

  return (
    <section className="tt-screen" aria-label={`${genre.name} results`}>
      <div className="tt-top">
        <a href="#" className="tt-link tt-back" onClick={(e) => { e.preventDefault(); onBack?.(); }}>← Back to the crate</a>
        <div className="tt-top-actions">
          <a href={spotifyUrl} target="_blank" rel="noreferrer" className="tt-link">Listen more on Spotify ↗</a>
          <button className="tt-btn tt-btn-secondary" onClick={roll}>⤮ Roll again</button>
        </div>
      </div>

      <div className="tt-body">
        <div className="tt-deck">
          <div className="tt-plinth">
            <div className="tt-platter"><Vinyl size={330} label={genre.label} playing={deck.playing} /></div>
            <div className="tt-pivot" />
            <div className="tt-arm" data-playing={deck.playing}>
              <div className="tt-arm-bar" /><div className="tt-arm-head" />
            </div>
            <span className="tt-speed">33⅓</span>
          </div>
          <div className="tt-controls">
            <button className="tt-btn tt-btn-secondary" onClick={deck.prev} aria-label="Previous track">⏮</button>
            <button className="tt-btn tt-btn-primary" onClick={deck.toggle}>{deck.playing ? "❚❚ Pause" : "▶ Play"}</button>
            <button className="tt-btn tt-btn-secondary" onClick={deck.next} aria-label="Next track">⏭</button>
          </div>
        </div>

        <div className="tt-info">
          <div>
            <h2 className="tt-title">{genre.name}</h2>
            <span className="tt-meta">{genre.origin} · {genre.era} · 10 of {genre.count} tracks</span>
          </div>
          <ol className="tt-tracks">
            {tracks.map((t, i) => {
              const on = i === deck.current;
              return (
                <li key={t.id}>
                  <button className="tt-track" aria-current={on} onClick={() => deck.select(i)}>
                    <span className="tt-num">{on ? (deck.playing ? "▶" : "❚❚") : String(i + 1).padStart(2, "0")}</span>
                    <span className="tt-name"><b>{t.title}</b><small>{t.artist}</small></span>
                    <span className="tt-dur">{t.dur}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
