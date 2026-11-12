import Link from "next/link";
import { Vinyl } from "./vinyl";

export function SiteHeader() {
  return (
    <header className="border-border-strong border-b px-6 lg:px-12">
      <div className="flex items-center justify-between pt-7 pb-[22px]">
        <Link href="/" className="font-mono text-2xl font-bold tracking-tight">
          That Music Is New
        </Link>
        <p className="text-muted-foreground hidden items-center gap-3 font-mono text-[15px] sm:flex">
          Discover rare genres —
          <Vinyl size={28} />
        </p>
      </div>
    </header>
  );
}
