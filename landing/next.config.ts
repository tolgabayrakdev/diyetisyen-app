import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.diyetka.com",
          },
        ],
        destination: "https://diyetka.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
