import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 빌드 중 ESLint 오류를 무시
  },
  typescript: {
    ignoreBuildErrors: true, // 빌드 중 TypeScript 오류를 무시
  },
  reactStrictMode: true, // React Strict Mode 활성화
  swcMinify: true, // SWC 기반의 빠른 Minify 활성화
};

export default nextConfig;