import { defaultThemeMap } from "./defaultThemeMap";
import { utils } from "./util";
import type { CollieConfig } from "../type";

export const defaultConfig = {
  prefix: "",
  themeMap: defaultThemeMap,
  theme: {},
  breakpoints: [],
  utils,
  layername: "",
} as const satisfies CollieConfig["css"];
