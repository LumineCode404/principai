import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Sandbox has 4GB RAM; uncapped Turbopack dev-server RSS grows to ~2.7GB and
  // gets OOM-killed. Cap it so it GCs instead of dying.
  experimental: {
    turbopackMemoryLimit: 1536,
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
