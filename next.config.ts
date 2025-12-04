import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Forzar uso de Webpack (Vital para Wagmi/Viem actualmente)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // 2. Permitir imágenes externas (DiceBear, etc.)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // 3. Ignorar errores estrictos de TypeScript para el Hackathon
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;