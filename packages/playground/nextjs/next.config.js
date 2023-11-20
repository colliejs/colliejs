const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    config.module.rules.push({
      loader: path.resolve(
        __dirname,
        "./node_modules/@colliejs/webpack/dist/loader.mjs"
      ),
      options: {},
    });
    return config;
  },
};

module.exports = nextConfig;
