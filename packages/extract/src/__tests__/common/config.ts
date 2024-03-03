import { defaultConfig } from "@colliejs/config";
export const config = {
  ...defaultConfig,
  layername: "app",
  prefix: "co",
  breakpoints: [320, 768],
  theme: {
    colors: { primary: "blue", secondary: "white" },
  },
};
