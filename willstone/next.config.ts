import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: __dirname,
    resolveAlias: {
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss"),
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pixabay.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.freepik.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**"
      }
    ],
  },
};

export default nextConfig;
