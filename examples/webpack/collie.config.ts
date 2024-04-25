import { type BaseConfig } from "@colliejs/core";
import { defaultConfig } from "@colliejs/config";
export const collieConfig = {
  ...defaultConfig,
  breakpoints: [320, 768],
  theme: {
    colors: {
      white01: "rgba(255,255,255,0.1)",
    },
  },
} as const satisfies BaseConfig;
