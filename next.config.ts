import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable proxy for Next.js 16+ (replaces middleware)
  experimental: {
    proxy: true,
  },
  // Security headers for all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://generativelanguage.googleapis.com https://api.groq.com https://api.openai.com; frame-ancestors 'none'; object-src 'none'; base-uri 'none'; upgrade-insecure-requests;",
          },
        ],
      },
    ]
  },
  // @ts-ignore: In Next.js 16.1.6, this is a top-level property
  allowedDevOrigins: ["myapp.nport.link"],
};

export default nextConfig;
