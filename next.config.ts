import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only apply static export during build — turbopack dev mode has known issues with it
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  // Skip redundant checks during build — lint and type-check run as separate CI steps before this
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
