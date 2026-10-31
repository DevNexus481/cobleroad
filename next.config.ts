import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.29.42',
    '192.168.29.42:3000',
    'localhost:3000',
    'localhost',
  ],
  images: {
    qualities: [75, 85, 88, 90, 92],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
