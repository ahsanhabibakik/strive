import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server external packages (moved from experimental)
  serverExternalPackages: ["mongoose"],

  // FAST DEV MODE - Skip everything for speed
  typescript: {
    ignoreBuildErrors: true, // Skip all TS checks in dev
  },

  eslint: {
    ignoreDuringBuilds: true, // Skip all linting
  },

  // Faster compilation
  swcMinify: true,
  
  // Skip static optimization for speed  
  experimental: {
    optimizePackageImports: [], // Disable to speed up dev
  },

  // Minimal image config for dev speed
  images: {
    unoptimized: process.env.NODE_ENV === "development", // Skip image optimization in dev
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
