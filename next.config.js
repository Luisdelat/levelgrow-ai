/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
  // The first stage was renamed from GENOMA to ADN.
  async redirects() {
    return [{ source: '/dashboard/genoma', destination: '/dashboard/adn', permanent: true }];
  },
}

module.exports = nextConfig
