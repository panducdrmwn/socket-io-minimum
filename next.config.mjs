/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
   reactStrictMode: false,
  trailingSlash: true,
  assetPrefix: isProd ? '/socket-io-minimum/' : '',
  basePath: isProd ? '/socket-io-minimum' : '',
  output: 'export',
}

export default nextConfig
