import { defaultThemeMap } from "./defaultThemeMap";
import { utils } from "./util";
import { BaseConfig } from "../type";
export const defaultConfig = {
  prefix: "co",
  themeMap: defaultThemeMap,
  media: {},
  breakpoints: [320, 768],
  theme: {},
  utils,
  styledElementProp: "css",
  layername: "app",
} as const satisfies BaseConfig;
