"use client";

import { CrateFlip, useCrate } from "@/features/crate";
import { HistoryPanel, useGenreHistory } from "@/features/history";
import { GENRES } from "@/mocks/genres";
import { SAMPLE_HISTORY } from "@/mocks/history";
import { Hero } from "./hero";

// Home screen composition: Hero + crate + History. Randomize, Space, the crate and History share one selection.
export function HomeScreen() {
  const crate = useCrate(GENRES);
  const history = useGenreHistory(SAMPLE_HISTORY);

  return (
    <div className="flex flex-col gap-8 px-6 pt-14 pb-8 lg:mx-auto lg:w-full lg:max-w-[1440px] lg:flex-row lg:items-stretch lg:px-12">
      <Hero onRandomize={crate.randomize} />
      <CrateFlip
        catalog={GENRES}
        stock={crate.stock}
        selected={crate.selected}
        onSelect={crate.pick}
        onRestock={crate.restock}
        onPlay={(g) => history.add(g.id)}
      />
      <HistoryPanel
        catalog={GENRES}
        items={history.items}
        selected={crate.selected}
        onOpen={crate.pick}
        onRemove={history.remove}
        onClear={history.clear}
        lastRemoved={history.lastRemoved}
        onUndo={history.undoRemove}
        onDismissUndo={history.dismissUndo}
      />
    </div>
  );
}
