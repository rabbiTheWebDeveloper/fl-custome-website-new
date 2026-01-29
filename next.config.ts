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
        hostname: "zadwah.com",
        pathname: "/**",
      },
    ],
    domains: ["eiclgroup.com", "via.placeholder.com", "images.unsplash.com"],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
