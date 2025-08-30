import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server external packages (moved from experimental)
  serverExternalPackages: ["mongoose"],

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // TypeScript config - Skip errors in production/Vercel builds
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "production" || !!process.env.VERCEL,
  },

  // ESLint config - Only run in development
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === "production" || !!process.env.VERCEL,
  },
};

export default nextConfig;
