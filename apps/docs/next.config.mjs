import createMDX from '@next/mdx';

const withMDX = createMDX({});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  // The workspace packages ship ESM/CJS dual builds; let Next transpile them.
  transpilePackages: ['@prediction-kit/core', '@prediction-kit/react'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default withMDX(nextConfig);
