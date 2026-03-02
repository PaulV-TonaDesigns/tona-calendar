import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/pdf": [
      "./node_modules/@sparticuz/chromium/**",
      "./node_modules/@sparticuz/chromium-min/**",
    ],
  },
};

export default nextConfig;