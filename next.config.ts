import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // H21: do NOT ignore TypeScript build errors — ship type-safe code.
  // (Removed `typescript.ignoreBuildErrors: true`.)
  reactStrictMode: true, // H22: enable strict mode
  poweredByHeader: false,

  // C5: explicit allowed origins for Server Actions (CSRF protection).
  // Add your production domain(s) here.
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "numeriainstitute.vercel.app",
        // Add preview/production domains as needed
      ],
    },
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self), geolocation=()",
          },
        ],
      },
    ];
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
