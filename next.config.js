/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  sassOptions: {
    includePaths: ['./src/app/styles'],
  },
};

module.exports = nextConfig; 