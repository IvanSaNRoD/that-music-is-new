import type { ReactNode } from "react";

/** Main row of a (site) page: 1440px container; columns side by side from lg (ADR-0006).
 * Below lg: one centred column (max 720px) so tablets get the phone layout without stretching it. */
export function PageRow({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8 px-6 pt-8 pb-8 lg:max-w-[1440px] lg:flex-row lg:items-stretch lg:px-12 lg:pt-14">
      {children}
    </div>
  );
}
