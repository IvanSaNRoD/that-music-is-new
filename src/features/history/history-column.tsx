"use client";

import { useParams, useRouter } from "next/navigation";
import { useCrateState } from "@/features/crate";
import { GENRES } from "@/mocks/genres";
import { HistoryPanel } from "./history-panel";
import { useHistoryState } from "./history-provider";

/**
 * History panel wired to the app: opening a row navigates to that genre's page (never touches the crate).
 * Highlight = the genre on screen (result page) or the open sleeve (home).
 */
export function HistoryColumn() {
  const history = useHistoryState();
  const crate = useCrateState();
  const router = useRouter();
  const params = useParams<{ genre?: string }>();
  const current = params.genre ? GENRES.find((g) => g.slug === params.genre)?.id : crate.selected;

  return (
    <HistoryPanel
      catalog={GENRES}
      items={history.items}
      selected={current ?? ""}
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
