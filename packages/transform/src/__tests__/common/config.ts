import { defaultConfig } from "@colliejs/shared";
export const config = {
  ...defaultConfig,
  prefix: "co",
  breakpoints: [320, 768],
  theme: {
    colors: { primary: "blue", secondary: "white" },
  },
};
