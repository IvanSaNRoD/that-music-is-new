import { z } from "zod";

/** History shows the last 5 played genres (docs/prd.md; older entries = open question). */
export const HISTORY_MAX = 5;

const historyItemSchema = z.object({ id: z.string().min(1), name: z.string().min(1), date: z.iso.date() });

/** A played genre in History: its slug (`id`), display name and the day it was played (ISO, e.g. "2026-11-16"). */
export type HistoryItem = z.infer<typeof historyItemSchema>;

/** Stored History (untrusted `localStorage` JSON) → valid entries, newest copy of each genre, at most 5. */
export function parseHistory(raw: unknown): HistoryItem[] {
  if (!Array.isArray(raw)) return [];
  const items: HistoryItem[] = [];
  for (const x of raw) {
    // One bad entry (old format, manual edit) shouldn't wipe the whole History.
    const item = historyItemSchema.safeParse(x);
    if (item.success && !items.some((i) => i.id === item.data.id)) items.push(item.data);
  }
  return items.slice(0, HISTORY_MAX);
}
