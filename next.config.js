/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cloudinary.com',
            },
        ],
    },
    // Include data/ directory in serverless function bundle (for Vercel)
    outputFileTracingIncludes: {
        '/api/chat': ['./data/**/*'],
    },
};

module.exports = nextConfig;