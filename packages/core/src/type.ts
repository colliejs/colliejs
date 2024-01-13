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
export type UtilsParams<
  Config extends BaseConfig,
  K extends keyof Config["utils"]
> = Parameters<Config["utils"][K]>;

export type UtilsParams0<
  Config extends BaseConfig,
  K extends keyof Config["utils"]
> = Parameters<Config["utils"][K]>[0];
export type CSSObject<Config extends BaseConfig> = {
  [K in keyof CSS<Config>]: K extends keyof Config["utils"]
    ? UtilsParams0<Config, K> extends CSSObject<any>
      ? CSSObject<Config>
      : UtilsParams0<Config, K> | UtilsParams0<Config, K>[]
    : CSS<Config>[K] | CSS<Config>[K][];
};

// const config = {
//   utils: {
//     h: (value: CSSProperties["height"]) => ({ height: value }),
//     pl: (value: CSSProperties["paddingLeft"]) => ({ paddingLeft: value }),
//     _after: (value?: CSSObject<any>) => ({ "&::after": value }),
//   },
// } as const;
// type A = CSSObject<typeof config>;
// type A1 = A["h"];
// type PL = A["pl"];
// type _after = A["_after"];
// type x = CSSProperties["paddingLeft"] extends Record<string,any> ? true : false;
// //TODO:WHY is true?
// type x3 = OnlyStringNumeric extends Record<string,any> ? true : false;
// export type OnlyObject = Record<never,never>

// export type OnlyNumber = number & OnlyObject

// export type OnlyString = string & OnlyObject

// export type OnlyStringNumeric = (number | string) & OnlyObject
// type x1 = CSSProperties["paddingLeft"] extends OnlyObject ? true : false;
// type x2 = number extends OnlyObject ? true : false;
// type x13 = number extends object ? true : false;
