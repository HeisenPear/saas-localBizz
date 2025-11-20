/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better error handling
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    domains: [
      // Add your Supabase storage domain here
      // Example: 'yourbucket.supabase.co'
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
