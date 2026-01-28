import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  }
};

// module.exports = {
//   experimental: {
//     serverActions: {
//       bodySizeLimit: "2mb",
//     },
//   },
// };

export default nextConfig;
