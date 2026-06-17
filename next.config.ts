import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Skip redundant checks during build — lint and type-check run as separate CI steps before this
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
