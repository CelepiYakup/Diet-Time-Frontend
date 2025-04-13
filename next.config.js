/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  sassOptions: {
    includePaths: ['./src/app/styles'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'http://backend:5000/api/:path*' 
          : 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 