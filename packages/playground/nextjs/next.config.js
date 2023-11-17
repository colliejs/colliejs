const path = require("path");
const CollieWebpackPlugin = require("@colliejs/webpack/plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    config.module.rules.push({
      loader: path.resolve(
        __dirname,
        "./node_modules/@colliejs/webpack/dist/loader.cjs"
      ),
      options: {},
    });
    config.plugins.push(new CollieWebpackPlugin());
    return config;
  },
};

module.exports = nextConfig;
