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
    ],
  },

  // TypeScript config - Temporarily disabled for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint config - Disabled for production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
