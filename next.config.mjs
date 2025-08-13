import pkg from '@next/env';
const { loadEnvConfig } = pkg;

// Load environment variables from .env file
loadEnvConfig(process.cwd());

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongoose'],
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  }
};

export default nextConfig;
