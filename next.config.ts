import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-s3.funnelliner.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "funnelliner.s3.ap-southeast-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zadwah.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "eiclgroup.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
    ],
    unoptimized: true, // Set to true to disable all optimization
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  output: "standalone",
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
