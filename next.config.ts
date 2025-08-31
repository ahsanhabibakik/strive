import type { NextConfig } from "next";

// Minimal config for development speed
const nextConfig: NextConfig = {
  // Basic settings only
  serverExternalPackages: ["mongoose"],
  
  // Skip all validations for speed
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  
  // Basic image config
  images: {
    unoptimized: true, // Skip optimization
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // Allow all HTTPS images
    ],
  },
};

export default nextConfig;