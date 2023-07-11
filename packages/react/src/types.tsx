import React, { ElementType } from "react";
import { type Styling } from "@colliejs/transform";
// import type Stitches from './types/stitches'
import type * as Config from "./types/config";
import type * as CSSUtil from "./types/css-util";
import type * as StyledComponentX from "./types/styled-component";
import type * as Util from "./types/util";
import Stitches, { RemoveIndex } from "./types/stitches";
import { defaultConfig } from "@colliejs/core";
export type Debug<T> = { [K in keyof T]: T[K] };

export type StyledOption<
  Props,
  InnerAs extends keyof JSX.IntrinsicElements
> = {
  as?: InnerAs;
  wrapper?: keyof JSX.IntrinsicElements;
  attrs?: Partial<Props> & JSX.IntrinsicElements[InnerAs];
};

type MyConfig = typeof defaultConfig;
export type MyCss<T extends typeof defaultConfig> = CSSUtil.CSS<
  T["media"],
  T["theme"],
  T["themeMap"],
  T["utils"]
>;
export type MyStyling<T extends typeof defaultConfig> = MyCss<T> & {
  variants?: { [key: string]: { [v: string]: MyCss<T> } };
  compoundVariants?: any;
  defaultVariants?: any;
};

export type MyStyledComponentProps<
  T extends { variants?: { [name: string]: unknown } }
> = {
  [K in keyof T["variants"]]?: keyof T["variants"][K];
};

export declare const styled: <
  C extends typeof defaultConfig,
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
