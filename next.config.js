/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable the 'N' (Next.js build compilation indicator) in the bottom right corner
  devIndicators: false,

  // Tell Webpack to compile ESM-only Spline module correctly for Next.js
  transpilePackages: ['@splinetool/react-spline'],

  images: {
    domains: ['localhost'],
  },

  // Prevent browser from sniffing .spline files as fonts
  // by setting the correct Content-Type and X-Content-Type-Options headers
  async headers() {
    return [
      {
        source: '/(.*).spline',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/octet-stream',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
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