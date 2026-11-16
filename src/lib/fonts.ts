import { Inter, Inter_Tight, Space_Mono } from "next/font/google";

// Shared by the root layout and global-error (which renders its own <html>).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

// Space Mono is not a variable font → weights must be listed.
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/** Class names exposing the font CSS variables (--font-inter, --font-inter-tight, --font-space-mono). */
export const fontVariables = `${inter.variable} ${interTight.variable} ${spaceMono.variable}`;
