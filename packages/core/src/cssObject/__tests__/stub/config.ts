import { utils } from "./util";
import { defaultThemeMap } from "./defaultThemeMap";
export const config = {
  prefix: "co",
  breakpoints: [320, 768],
  theme: {
    colors: { primary: "blue", secondary: "white" },
  },
  utils: utils,
  themeMap: defaultThemeMap,
};
