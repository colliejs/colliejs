import { Config } from "../type";
import { defaultThemeMap } from "./defaultThemeMap";
import { utils } from "./util";

export const defaultConfig = {
  prefix: "co",
  themeMap: defaultThemeMap,
  media: {
    phone: "(max-width: 767.999px)",
    pad: "(min-width: 768px) and (max-width: 1023.999px)",
    pc: "(min-width: 1024px)",
    mobile: "(max-width: 1023.999px)",
  },
  breakpoints: [768],
  theme: {
    colors: {},
  },
  utils: utils,
  styledElementProp: "css",
  layername: "app",
} as const satisfies Config;
