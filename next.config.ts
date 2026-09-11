import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // The capture harness photographs pages; the dev badge would land in the shot.
  devIndicators: false,
};

export default nextConfig;
