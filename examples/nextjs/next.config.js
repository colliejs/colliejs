const path = require("path");
const defaultConfig = require("@colliejs/config").defaultConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    // console.log("===>config", config);
    config.module.rules.push({
      loader: "@colliejs/webpack",
      options: {
        styledConfig: {
          ...defaultConfig,
          theme: { color: { primary: "red" } },
        },
        entry: path.resolve(__dirname, "./src/app/page.tsx"),
      },
    });
    return config;
  },
};

module.exports = nextConfig;
