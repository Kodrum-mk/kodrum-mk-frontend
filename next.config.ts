import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
