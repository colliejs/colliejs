import React, { CSSProperties, ElementType } from "react";
import { type Styling } from "@colliejs/transform";
// import type * as Config from "./types/config";
import type * as CSSUtil from "./types/css-util";
import type * as StyledComponentX from "./types/styled-component";
import * as Util from "./types/util";
import Stitches, { RemoveIndex } from "./types/stitches";
export { Util, CSSUtil, Stitches };
import { defaultConfig } from "@colliejs/core";
import { ConfigType, DefaultThemeMap } from "./types/config";

export type Debug<T> = { [K in keyof T]: T[K] };

export type StyledOption<Props, InnerAs extends keyof JSX.IntrinsicElements> = {
  as?: InnerAs;
  wrapper?: keyof JSX.IntrinsicElements;
  attrs?: Partial<Props> & JSX.IntrinsicElements[InnerAs];
};


export type CollieConfig<
  Prefix extends string = "",
  Media extends {} = {},
  Theme extends {} = {},
  ThemeMap extends {} = DefaultThemeMap,
  Utils extends {} = {}
> = {
  prefix?: ConfigType.Prefix<Prefix>;
  media?: ConfigType.Media<Media>;
  theme?: ConfigType.Theme<Theme>;
  themeMap?: ConfigType.ThemeMap<ThemeMap>;
  utils?: ConfigType.Utils<Utils>;
};

export type MyCss<T extends typeof defaultConfig> = CSSUtil.CSS<
  T["media"],
  T["theme"],
  T["themeMap"],
  T["utils"]
>;
type DynamicFnPara<T extends string> = `var(--variants-dynamic-${T})`;
export type DynamicFn<T extends string> = (
  x: DynamicFnPara<T>
) => CSSProperties;
export type MyStyling<T extends typeof defaultConfig> = MyCss<T> & {
  variants?: {
    [key in string as key]: Partial<
      Record<"dynamic" | (string & {}), MyCss<T> | DynamicFn<key>>
    >;
  };
  compoundVariants?: any;
  defaultVariants?: any;
};

export type MyStyledComponentProps<
  T extends { variants?: { [name: string]: unknown } }
> = {
  [K in keyof T["variants"]]?: Util.Widen<keyof T["variants"][K]>;
};

export type MakeStyled<C extends typeof defaultConfig> = <
  Type extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  T extends MyStyling<C>,
  Media = C["media"]
>(
  type: Type,
  styling: T,
  option?: StyledOption<any, any>
) => StyledComponentX.StyledComponent<
  Type,
  MyStyledComponentProps<T>,
  Media,
  MyCss<C>
>;

export declare const styled: MakeStyled<typeof defaultConfig>;
export declare const makeStyled: <T extends typeof defaultConfig>(
  config: T
) => MakeStyled<T>;

// export type CreateStitches = {
//   <
//     Prefix extends string = "",
//     Media extends {} = {},
//     Theme extends {} = {},
//     ThemeMap extends {} = DefaultThemeMap,
//     Utils extends {} = {}
//   >(config?: {
//     prefix?: ConfigType.Prefix<Prefix>;
//     media?: ConfigType.Media<Media>;
//     theme?: ConfigType.Theme<Theme>;
//     themeMap?: ConfigType.ThemeMap<ThemeMap>;
//     utils?: ConfigType.Utils<Utils>;
//   }): Stitches<Prefix, Media, Theme, ThemeMap, Utils>;
// };
