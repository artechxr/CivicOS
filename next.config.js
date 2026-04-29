/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore ESLint errors during build on Netlify
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during build on Netlify
  typescript: {
    ignoreBuildErrors: true,
  },
  // Standard Next.js output for Netlify compatibility (removes static export override)
};

module.exports = nextConfig;