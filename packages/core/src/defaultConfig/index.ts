import { defaultThemeMap } from "./defaultThemeMap";
import { utils } from "./util";
import type { BaseConfig } from "../type";
export const defaultConfig = {
  prefix: "",
  themeMap: defaultThemeMap,
  theme: {},
  breakpoints: [],
  utils,
  layername: "app",
} as const satisfies BaseConfig;
