import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

function getBackendUrl(): string {
  if (process.env.INTERNAL_BACKEND_URL) {
    return process.env.INTERNAL_BACKEND_URL;
  }
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  // In production / Vercel deployment, proxy to the deployed backend server
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return "https://land-tech-server.vercel.app";
  }
  try {
    const portFilePath = path.resolve(process.cwd(), "../server/.port.json");
    if (fs.existsSync(portFilePath)) {
      const data = JSON.parse(fs.readFileSync(portFilePath, "utf8"));
      if (data?.port) {
        return `http://localhost:${data.port}`;
      }
    }
  } catch (e) {
    // fallback
  }
  return "http://localhost:8001";
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    const backendUrl = getBackendUrl();
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
