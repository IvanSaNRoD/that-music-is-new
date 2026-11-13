import type { Genre } from "@/domain/genre";

// PLACEHOLDER catalog (from the Crate Flip handoff) until the Spotify-backed catalog lands (E1).
export const GENRES: Genre[] = [
  ["Indie Folk", "US", "2000s"],
  ["Psychedelic", "UK", "1960s"],
  ["Afrobeat", "Nigeria", "1970s"],
  ["Post-rock", "UK", "1990s"],
  ["Bossa Nova", "Brazil", "1950s"],
  ["Zamrock", "Zambia", "1970s"],
  ["Chillwave", "US", "2009"],
  ["Synthwave", "US", "2000s"],
  ["Trip hop", "Bristol", "1990s"],
  ["Krautrock", "Germany", "1970s"],
  ["Dream Pop", "UK", "1980s"],
  ["Noise", "Japan", "1980s"],
  ["Shoegaze", "UK", "1990s"],
  ["Math Rock", "US", "1990s"],
  ["Zeuhl", "France", "1970s"],
  ["Post-punk", "UK", "1978"],
  ["New Wave", "UK", "1980s"],
  ["Funk", "US", "1960s"],
  ["Ambient", "UK", "1970s"],
].map(([name, origin, era]) => ({
  id: name.toLowerCase().replace(/\s+/g, "-"),
  name,
  origin,
  era,
}));
