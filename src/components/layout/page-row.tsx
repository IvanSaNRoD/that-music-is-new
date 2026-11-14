import type { ReactNode } from "react";

/** Main row of a (site) page: 1440px container; columns side by side from lg (ADR-0006). */
export function PageRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8 px-6 pt-14 pb-8 lg:mx-auto lg:w-full lg:max-w-[1440px] lg:flex-row lg:items-stretch lg:px-12">
      {children}
    </div>
  );
}
