import { defaultThemeMap } from "./defaultThemeMap";
import { utils } from "./util";
import { BaseConfig } from "../type";
export const defaultConfig = {
  prefix: "co",
  themeMap: defaultThemeMap,
  media: {},
  theme: {},
  utils,
  layername: "app",
} as const satisfies BaseConfig;
