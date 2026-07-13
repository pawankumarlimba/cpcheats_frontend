import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

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
