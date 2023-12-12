import { defaultThemeMap } from "./defaultThemeMap";
import { utils } from "./util";
import { BaseConfig } from "@colliejs/core";

export const defaultConfig = {
  prefix: "co",
  themeMap: defaultThemeMap,
  media: {
    phone: "(max-width: 767.999px)",
    pad: "(min-width: 768px) and (max-width: 1023.999px)",
    pc: "(min-width: 1024px)",
  },
  breakpoints: [320, 768],
  theme: {
    colors: {},
  },
  utils,
  styledElementProp: "css",
  layername: "",
} as const satisfies BaseConfig;
