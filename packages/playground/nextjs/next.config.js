const path = require("path");
const defaultConfig = require("@colliejs/react").defaultConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    config.module.rules.push({
      loader: '@colliejs/webpack',
      options: {
        styledConfig: defaultConfig,
      },
    });
    return config;
  },
};

module.exports = nextConfig;
