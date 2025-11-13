import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.scorebat.com',
      },
      {
        protocol: 'https',
        hostname: 'logos-world.net',
      },
    ],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'cloudflare-worker'];
    return config;
  },
};

export default nextConfig;
