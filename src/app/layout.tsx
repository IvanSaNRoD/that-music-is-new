import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { OPEN_GRAPH_BASE, SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

const DESCRIPTION =
  "One click picks a random rare genre from near 7,000 and plays 10 of its tracks. Keep a trail of your finds.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${SITE_NAME} — hear a genre you’ve never heard of`, template: `%s · ${SITE_NAME}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: { ...OPEN_GRAPH_BASE, url: "/" },
  twitter: { card: "summary_large_image" },
};

// Browser UI (mobile address bar) in Kinari, the page colour.
export const viewport: Viewport = { themeColor: "#f3ebda" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
