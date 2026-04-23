import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  outputFileTracingIncludes: {
    "/*": ["./generated/prisma/**/*", "./node_modules/.prisma/client/**/*"],
    "/**/*": ["./generated/prisma/**/*", "./node_modules/.prisma/client/**/*"]
  }
};

export default nextConfig;
