import { utils } from "./util";
import { defaultThemeMap } from "./defaultThemeMap";
import { Config } from "../type";

export const defaultConfig: Config = {
  prefix: "ust",
  themeMap: defaultThemeMap,
  media: {
    phone: "(max-width: 767.999px)",
    pad: "(min-width: 768px) and (max-width: 1023.999px)",
    pc: "(min-width: 1024px)",
    mobile: "(max-width: 1023.999px)",
  },
  breakpoints: [768],
  theme: {
    colors: {
      primary: "blue",
      secondary: "white",
    },
  },
  utils: utils as any,
};
