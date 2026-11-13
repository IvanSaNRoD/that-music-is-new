export type Genre = {
  id: string;
  /** URL segment, see domain/slug.ts (ADR-0006). */
  slug: string;
  name: string;
  origin: string;
  era: string;
};
