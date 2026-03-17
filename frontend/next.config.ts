import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      noTurbo: true,
    },
  },
};

export default nextConfig;
