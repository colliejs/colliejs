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
  [K in keyof CSS<Config>]: K extends keyof Config["utils"]
    ? Parameters<Config["utils"][K]>[0] extends object
      ? Parameters<Config["utils"][K]>[0]
      : CSS<Config>[K] | CSS<Config>[K]
    : CSS<Config>[K] | CSS<Config>[K];
};

// const config = {
//   utils: {
//     w: (value: CSSObject<any>) => ({ width: value }),
//     h: (value: CSSProperties['height']) => ({ height: value }),
//     _after: (value?: CSSObject<any>) => ({ '&::after': value }),
//   },
// } as const;
// type A = CSSObject<typeof config>;
// type A1 = A["_after"];
