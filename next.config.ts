import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  ...(isProduction && {
    output: "export",
    distDir: "build",
    basePath: '/app-mdRunner'
  }),
};

export default nextConfig;
