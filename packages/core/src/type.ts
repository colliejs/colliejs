import type { CSSProperties, Prefixed } from "./types";
import { CSS } from "./types";
export type { Prefixed, CSSProperties, Widen, Assign } from "./types";
//===========================================================
// BaseConfig Type,not the Actual Type
//===========================================================
export type BaseConfig = {
  prefix?: string;
  theme?: object;
  breakpoints?: number[];
  themeMap?: object;
  utils?: {
    [key: string]: (value: any) => CSSProperties | any; //CSSObject<Config>
  };
  layername?: string;
};

//===========================================================
// used by function css()
//===========================================================
export type CSSObject<Config extends BaseConfig> = {
  [K in keyof CSS<Config>]: CSS<Config>[K] | CSS<Config>[K][];
};

export declare const css: <Config extends BaseConfig>(
  cssObj: CSSObject<Config>,
  selector: string[],
  pseudoSelector: string[],
  config: Config
) => string;

export declare const createTheme: <Config extends BaseConfig>(
  prefix: string,
  theme: object
) => string;

export declare const defaultConfig: BaseConfig;
