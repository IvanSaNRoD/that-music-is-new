import Link from "next/link";
import { Vinyl } from "@/components/brand/vinyl";

export function SiteHeader() {
  return (
    <header className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
      {/* Rule spans the content width only (logo → vinyl), not the full screen. */}
      <div className="border-border-strong flex items-center justify-between border-b pt-7 pb-[22px]">
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
