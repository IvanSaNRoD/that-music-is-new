"use client";

import { useRouter } from "next/navigation";
import { CrateFlip, useCrateState } from "@/features/crate";
import { useRandomize } from "@/features/randomizer";
import { GENRES } from "@/mocks/genres";
import { Hero } from "./hero";

/** Home page body: Hero + crate. Randomize and Play on a sleeve both navigate to /{genre}. */
export function HomeView() {
  const crate = useCrateState();
  const randomize = useRandomize();
  const router = useRouter();

  return (
    <>
      <Hero onRandomize={randomize} />
      <CrateFlip
        catalog={GENRES}
        stock={crate.stock}
        selected={crate.selected}
        onSelect={crate.pick}
        onRestock={crate.restock}
        onPlay={(g) => router.push(`/${g.slug}`)}
      />
    </>
  );
}
