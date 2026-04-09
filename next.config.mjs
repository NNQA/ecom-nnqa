/** @type {import('next').NextConfig} */

import Icons from "unplugin-icons/webpack"
const nextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  webpack(config) {
    config.plugins.push(
      Icons({
        compiler: "jsx",
        jsx: "react",
      })
    )
    return config
  },
}

export default nextConfig
