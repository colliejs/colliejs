import type { BaseConfig } from "@colliejs/core";
import { defaultConfig } from "@colliejs/config";
export default {
  ...defaultConfig,
  breakpoints: [320, 768],
  theme: {
    colors: {
      white01: "rgba(255,255,255,0.1)",
      white09: "rgba(255,255,255,0.9)",
      black09: "rgba(0,0,0,0.9)",
    },
  },
} as const satisfies BaseConfig;
