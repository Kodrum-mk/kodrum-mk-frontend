import type { NextConfig } from "next";

// No CSP: the pages use inline JSON-LD and Google Analytics. Camera, microphone and location are not used.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "ecourses.kodrum.mk" }],
        destination: "https://ecourses.kodrum.dev/:path*",
        permanent: false,
      },
      {
        source: "/ig",
        destination:
          "/?utm_source=instagram&utm_medium=social&utm_campaign=instagram_bio",
        permanent: false,
      },
      {
        source: "/ad",
        destination:
          "/?utm_source=instagram&utm_medium=paid_social&utm_campaign=instagram_ad",
        permanent: false,
      },
      {
        source: "/uci",
        destination: "https://ecourses.kodrum.dev",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
