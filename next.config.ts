import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src')],
    prependData: `@use "@/styles/mixins" as *;`,
  },
  images: {
    domains: ['images.igdb.com'],
  },
  async redirects() {
    return [
      {
        source: '/home/noLogin',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
