import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lopozvtyvrmbbwodfyen.supabase.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: [
        "http://localhost:3000",
        "https://localhost:3000",
        "https://tu-dominio.com",
        "*",
      ],
    },
  },
  reactStrictMode: true,
};

export default nextConfig;
