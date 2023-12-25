import type { CSSProperties, Prefixed } from "./types";
import type { CSS } from "./types";
export type { Prefixed, CSSProperties, Widen, Assign } from "./types";
export * from "./types/css";
//===========================================================
// BaseConfig Type,not the Actual Type
//===========================================================
export type UtilsFn = (value: any) => CSSProperties | any;
export type BaseConfig = {
  prefix?: string;
  theme?: object;
  breakpoints?: readonly number[];
  themeMap?: object;
  utils?: {
    [key: string]: UtilsFn;
  };
  layername?: string;
};

//===========================================================
// used by function css()
//===========================================================
export type CSSObject<Config extends BaseConfig> = {
  [K in keyof CSS<Config>]: CSS<Config>[K] | CSS<Config>[K][];
};

// export declare const css: <Config extends BaseConfig>(
//   cssObj: CSSObject<Config>,
//   selector: string[],
//   pseudoSelector: string[],
//   config: Config
// ) => string;

// export declare const createTheme: <Config extends BaseConfig>(
//   prefix: string,
//   theme: object
// ) => string;

// export declare const defaultConfig: BaseConfig;
