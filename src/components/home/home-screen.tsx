"use client";

import { GENRES } from "@/domain/genres";
import { useCrate, type HistoryItem } from "@/hooks/use-crate";
import { CrateFlip } from "./crate-flip";
import { Hero } from "./hero";
import { HistoryPanel } from "./history-panel";

// Placeholder rows until History persistence lands (fixed dates keep SSR markup stable).
const SAMPLE_HISTORY: HistoryItem[] = [
  { id: "indie-folk", date: "24 Oct" },
  { id: "zeuhl", date: "23 Oct" },
  { id: "bossa-nova", date: "21 Oct" },
  { id: "krautrock", date: "19 Oct" },
];

// Client island: Randomize, Space, the crate and History all share one selection.
export function HomeScreen() {
  const crate = useCrate(GENRES, SAMPLE_HISTORY);

  return (
    <div className="flex flex-col gap-8 px-6 pt-14 pb-8 lg:flex-row lg:items-stretch lg:px-12 lg:mx-auto lg:w-full lg:max-w-[1440px]">
      <Hero onRandomize={crate.randomize} />
      <CrateFlip
        catalog={GENRES}
        stock={crate.stock}
        selected={crate.selected}
        onSelect={crate.pick}
        onRestock={crate.restock}
        onPlay={(g) => crate.play(g.id)}
      />
      <HistoryPanel
        catalog={GENRES}
        items={crate.history}
        selected={crate.selected}
        onOpen={crate.pick}
        onRemove={crate.removeFromHistory}
        onClear={crate.clearHistory}
      />
    </div>
  );
}
