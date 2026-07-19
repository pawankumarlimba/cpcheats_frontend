import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://cpcheats-backend.vercel.app/";

console.log(`[Next.js Configuration] Proxying API and MCP calls to destination: ${backendUrl}`);

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/mcp/:path*",
        destination: `${backendUrl}/mcp/:path*`,
      },
    ];
  },
};

export default nextConfig;
