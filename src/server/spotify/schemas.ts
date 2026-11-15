import "server-only";
import { z } from "zod";

// Only the fields we use; zod strips the rest. Shapes checked against the live API on 2026-11-15.

export const tokenSchema = z.object({
  access_token: z.string().min(1),
  expires_in: z.number().positive(),
});

const trackSchema = z.object({
  type: z.string(),
  id: z.string().nullable(),
  name: z.string(),
  artists: z.array(z.object({ name: z.string() })),
  is_local: z.boolean().optional(),
  // Present only when the request has `market`.
  is_playable: z.boolean().optional(),
});

// Since the Feb 2026 API change each entry carries the track under both `item` and `track`.
// A malformed entry (e.g. an episode without `artists`) becomes `null` instead of failing the whole page.
const entrySchema = z
  .object({
    is_local: z.boolean().optional(),
    item: trackSchema.nullish(),
    track: trackSchema.nullish(),
  })
  .nullable()
  .catch(null);

export const playlistItemsSchema = z.object({
  total: z.number().int().nonnegative(),
  items: z.array(entrySchema),
});

export type PlaylistEntry = z.infer<typeof entrySchema>;
