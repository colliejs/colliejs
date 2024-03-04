import { defaultThemeMap } from "./defaultThemeMap";
import { utils } from "./util";
import type { BaseConfig } from "@colliejs/core";
export const defaultConfig = {
  prefix: "",
  themeMap: defaultThemeMap,
  theme: {},
  breakpoints: [],
  utils,
  layername: "",
} as const satisfies BaseConfig;
