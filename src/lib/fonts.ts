import { Inter, Inter_Tight, Space_Mono } from "next/font/google";

// Shared by the root layout and global-error (which renders its own <html>).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Inter Tight and Space Mono use our own fallback faces (globals.css, #80): next/font's automatic ones are sized for
// regular text, so the 800 headline and the mono text took a different width until the web font arrived (CLS).
// Inter keeps the automatic fallback: its widths already match.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  adjustFontFallback: false,
  fallback: ["Inter Tight Bold Fallback", "Arial", "sans-serif"],
});

// Space Mono is not a variable font → weights must be listed.
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  adjustFontFallback: false,
  fallback: ["Space Mono Courier Fallback", "monospace"],
});

/** Class names exposing the font CSS variables (--font-inter, --font-inter-tight, --font-space-mono). */
export const fontVariables = `${inter.variable} ${interTight.variable} ${spaceMono.variable}`;
