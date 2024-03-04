import { defaultThemeMap } from "./defaultThemeMap";
import { utils } from "./util";
import type { ConfigType } from "../type";
export const defaultConfig = {
  prefix: "",
  themeMap: defaultThemeMap,
  theme: {},
  breakpoints: [],
  utils,
  layername: "",
} as const satisfies ConfigType["css"];
