export const collieConfigTs = `
import { defaultThemeMap, utils } from "@colliejs/config";
import type { BaseConfig } from "@colliejs/core";

export default {
  prefix: "",
  themeMap: defaultThemeMap,
  theme: {
    colors: {},
  },
  breakpoints: [768],
  utils,
  layername: "",
  build: {
    watch: "src/**/*.tsx",
    entry: "entry.css",
  },
} as const satisfies BaseConfig;
`;

export const styled = `
  import { makeStyled } from "@colliejs/react";
  import { CSSObject, css as _css } from "@colliejs/core";
  import config from "../collie.config";
  export type MyConfig = typeof config;
  export const styled = makeStyled(config);  
`;
