import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // output: "export",
  distDir: "build",
};

export default nextConfig;
