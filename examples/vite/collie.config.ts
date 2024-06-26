import { defaultConfig, type CollieConfig } from "@colliejs/config";
export default {
  build: {
    entry: "src/index.tsx",
    alias: { "@src": "src" },
    include: ["src/**/*.tsx", "src/**/*.ts"],
    exclude: ["**/node_modules"],
  },
  css: {
    ...defaultConfig,
    breakpoints: [320, 768],
    theme: {
      colors: {
        white01: "rgba(255,255,255,0.1)",
        white09: "rgba(255,255,255,0.9)",
        black09: "rgba(0,0,0,0.9)",
        
      },
    },
  },
} as const satisfies CollieConfig;
