const nextConfig = {
  images: { unoptimized: true },
  transpilePackages: ['@radix-ui/react-alert-dialog'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
};

module.exports = nextConfig;