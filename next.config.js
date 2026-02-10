/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Enable static file serving for .spline files
  webpack: (config) => {
    config.module.rules.push({
      test: /\.spline$/,
      use: 'file-loader',
    });
    return config;
  },
};

module.exports = nextConfig;