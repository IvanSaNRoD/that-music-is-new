"use client";

import { useRouter } from "next/navigation";
import { useCrateState } from "@/features/crate";
import { GENRES } from "@/mocks/genres";
import { HistoryPanel } from "./history-panel";
import { useHistoryState } from "./history-provider";

/**
 * History panel wired to the app (home page only; genre pages show RecentFinds): opening a row navigates
 * to that genre's page (never touches the crate). Highlight = the open sleeve.
 */
export function HistoryColumn() {
  const history = useHistoryState();
  const crate = useCrateState();
  const router = useRouter();

  return (
    <HistoryPanel
      catalog={GENRES}
      items={history.items}
      selected={crate.selected}
      onOpen={(id) => {
        const g = GENRES.find((x) => x.id === id);
        if (g) router.push(`/${g.slug}`);
      }}
      onRemove={history.remove}
      onClear={history.clear}
      lastRemoved={history.lastRemoved}
      onUndo={history.undoRemove}
      onDismissUndo={history.dismissUndo}
    />
  );
}
