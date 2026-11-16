// Small stand-in for config/genres.json in server and route tests (E4 decision: logic tests must not depend
// on the real catalog's names, order or size). Replace the JSON module with:
//   vi.mock("<relative path>/config/genres.json", async () => ({ default: (await import("<…>/tests/fixtures/catalog")).catalogRows }));
export const catalogRows = [
  { genre: "Acid Jazz", playlistId: "7vyHBfRfPOT8Sxy87P5osJ", total: 172 },
  { genre: "Trip Hop", playlistId: "tripHopPlaylist0000001", total: 50 },
  { genre: "Zydeco", playlistId: "zydecoPlaylist00000001", total: 8 },
];
