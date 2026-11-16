"use client";

import { useRouter } from "next/navigation";
import { useCrateState } from "@/features/crate";
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
      items={history.items}
      loaded={history.loaded}
      selected={crate.selected}
      onOpen={(slug) => router.push(`/${slug}`)}
      onRemove={history.remove}
      onClear={history.clear}
      lastRemoved={history.lastRemoved}
      onUndo={history.undoRemove}
    />
  );
}
