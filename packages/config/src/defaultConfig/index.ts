import { defaultThemeMap } from "./defaultThemeMap";
import { utils } from "./util";
import type { BaseConfig } from "@colliejs/core";
export const defaultConfig = {
  prefix: "",
  themeMap: defaultThemeMap,
  theme: {},
  breakpoints: [],
  utils,
  layername: "app",
} as const satisfies BaseConfig;
