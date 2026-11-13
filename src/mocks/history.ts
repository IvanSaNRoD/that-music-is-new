import type { HistoryItem } from "@/domain/history";

// PLACEHOLDER rows until History persistence lands (fixed dates keep SSR markup stable).
export const SAMPLE_HISTORY: HistoryItem[] = [
  { id: "indie-folk", date: "24 Oct" },
  { id: "zeuhl", date: "23 Oct" },
  { id: "bossa-nova", date: "21 Oct" },
  { id: "krautrock", date: "19 Oct" },
  { id: "afrobeat", date: "17 Oct" },
];
