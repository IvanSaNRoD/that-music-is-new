import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Clients that ask for the legacy icon paths directly (Slack, RSS readers, old iOS) would otherwise hit
  // /[genre] and get a 200 HTML page. Temporary (307), so a real .ico can replace them later.
  async redirects() {
    return ["/favicon.ico", "/apple-touch-icon.png", "/apple-touch-icon-precomposed.png"].map((source) => ({
      source,
      destination: "/apple-icon",
      permanent: false,
    }));
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
