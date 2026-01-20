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
      
    ],
      domains: ["via.placeholder.com" ,"images.unsplash.com"],
       //
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
