/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.szoniska.pl', 'szoniska.pl', 'lh3.googleusercontent.com', 'cdn.discordapp.com', 'res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
};

export default nextConfig;
