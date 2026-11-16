import type { HistoryItem } from "@/domain/history";

// PLACEHOLDER rows until History persistence lands (fixed dates keep SSR markup stable).
export const SAMPLE_HISTORY: HistoryItem[] = [
  { id: "indie-folk", name: "Indie Folk", date: "24 Oct" },
  { id: "zeuhl", name: "Zeuhl", date: "23 Oct" },
  { id: "bossa-nova", name: "Bossa Nova", date: "21 Oct" },
  { id: "krautrock", name: "Krautrock", date: "19 Oct" },
  { id: "afrobeat", name: "Afrobeat", date: "17 Oct" },
];
