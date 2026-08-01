/** @type {import('next').NextConfig} */

import Icons from "unplugin-icons/webpack"
const nextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  images: {
    domains: ["images.unsplash.com"],
  },
}

export default nextConfig
