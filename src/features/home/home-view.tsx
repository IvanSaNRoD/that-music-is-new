"use client";

import { useRouter } from "next/navigation";
import { CrateFlip, useCrateState } from "@/features/crate";
import { HistoryColumn } from "@/features/history";
import { useRandomize } from "@/features/randomizer";
import { Hero } from "./hero";

/** Home page body: Hero + crate + History. Randomize and Play on a sleeve both navigate to /{genre}. */
export function HomeView() {
  const crate = useCrateState();
  const randomize = useRandomize();
  const router = useRouter();

  return (
    <>
      <Hero onRandomize={randomize} />
      <CrateFlip
        genres={crate.genres}
        status={crate.status}
        selected={crate.selected}
        onSelect={crate.pick}
        onRestock={crate.restock}
        onPlay={(g) => router.push(`/${g.slug}`)}
      />
      <HistoryColumn />
    </>
  );
}
