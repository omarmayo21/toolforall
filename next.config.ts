import type { NextConfig } from "next";
import { unitTools } from "./src/lib/generated/units";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async redirects() {
    // Old /unit-converters/<slug> URLs (already indexed) move into the existing categories.
    const live = new Map(unitTools.map((t) => [t.slug, t.category]));
    const dev = [...live].filter(([, cat]) => cat !== "math-converters").map(([slug, cat]) => ({
      source: `/unit-converters/${slug}`,
      destination: `/${cat}/${slug}`,
      permanent: true,
    }));
    return [
      ...dev,
      { source: "/unit-converters", destination: "/math-converters", permanent: true },
      // Remaining old URLs: kept pairs land on the same slug in math-converters. Removed pairs (no search demand) 404.
      { source: "/unit-converters/:slug", destination: "/math-converters/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
