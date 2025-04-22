import dotenv from "dotenv";
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000", // For local development
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_API_URL || "").hostname,
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
