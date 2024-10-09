/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/dashboard',
            destination: '/dashboard/explore',
            permanent: true,
          },
        ]
      },
};

export default nextConfig;
