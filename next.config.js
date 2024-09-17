/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["media.rawg.io"],
  },
  env: {
    NEXT_PUBLIC_RAWG_API_KEY: process.env.NEXT_PUBLIC_RAWG_API_KEY,
  },
};

module.exports = nextConfig;
