import type { CSSProperties, Prefixed } from "./types";
import type { CSS } from "./types";
export type { Prefixed, CSSProperties, Widen, Assign } from "./types";
export * from "./types/css";
//===========================================================
// BaseConfig Type,not the Actual Type
//===========================================================
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

export type BaseConfig = CSSConfig;
