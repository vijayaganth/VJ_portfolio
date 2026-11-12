import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // ~5 KB of CSS on a single page: inlining removes the render-blocking request.
    inlineCss: true,
  },
};

export default nextConfig;
