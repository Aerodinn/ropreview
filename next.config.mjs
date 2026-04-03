/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.rbxcdn.com" },
      { protocol: "https", hostname: "**.roblox.com" },
    ],
  },
};

export default nextConfig;
