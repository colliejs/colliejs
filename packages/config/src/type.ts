import type { CSSProperties, Prefixed } from "@colliejs/core";
type Alias = {};
export type UtilsFn = (value: any) => CSSProperties | any;
export type CSSConfig = {
  prefix?: string;
  theme?: object;
  breakpoints?: readonly number[];
  themeMap?: object;
  utils?: {
    [key: string]: UtilsFn;
  };
  layername?: string;
};

export type ConfigType = {
  css: CSSConfig;
  build?: {
    includes?: string;
    entry?: string;
    alias?: Alias;
  };
};
