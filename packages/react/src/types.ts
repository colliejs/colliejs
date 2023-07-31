import React, { CSSProperties, ElementType } from "react";
import { type Styling } from "@colliejs/transform";
// import type * as Config from "./types/config";
import type * as CSSUtil from "./types/css-util";
// import type * as StyledComponentX from "./types/styled-component";
import * as Util from "./types/util";
import Stitches, { RemoveIndex } from "./types/stitches";
export { Util, CSSUtil, Stitches };
import { defaultConfig } from "@colliejs/core";
import { ConfigType, DefaultThemeMap } from "./types/config";
import { JSXElement } from "@babel/types";

export type Debug<T> = { [K in keyof T]: T[K] };

type Union<A, B> = {
  [K in keyof (A & B)]: K extends keyof A
    ? A[K] | (K extends keyof B ? B[K] : never)
    : K extends keyof B
    ? B[K]
    : never;
};

type A = { a: number; b?: number; c: boolean };
type B = { a: string; d: string };
type K23 = Union<A, B>;

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

//===========================================================
// ExtractPropsFromStyling
//===========================================================
type DynamicFnPara<T extends string> = `var(--variants-dynamic-${T})`;
export type DynamicFn<T extends string, C extends typeof defaultConfig> = (
  x: DynamicFnPara<T>
) => MyCss<C>;

export type MyStyling<T extends typeof defaultConfig> = MyCss<T> & {
  variants?: {
    [key in string as key]: Partial<
      Record<"dynamic" | (string & {}), MyCss<T> | DynamicFn<key, T>>
    >;
  };
  compoundVariants?: any;
  defaultVariants?: any;
};

export type ExtractPropsFromStyling<
  T extends { variants?: { [name: string]: unknown } }
> = {
  [K in keyof T["variants"]]?: keyof T["variants"][K] extends "dynamic"
    ? string | number
    : Util.Widen<keyof T["variants"][K]>;
};
type x = "a" extends string ? "0" : 1;

type IsHostComponent<T> = T extends keyof JSX.IntrinsicElements ? true : false;

//===========================================================
// MyStyledComponent
//TODO: 处理variants覆盖的情况
//===========================================================
export type MyStyledComponent<
  C extends typeof defaultConfig,
  Type extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  Styling extends MyStyling<C>,
  As extends keyof JSX.IntrinsicElements
> = React.FC<
  Union<
    Util.Assign<React.ComponentProps<Type>, React.ComponentProps<As>>,
    ExtractPropsFromStyling<Styling>
  > & {
    css?: MyCss<C>;
    as?: keyof JSX.IntrinsicElements;
  }
>;

type a1x = { a: number } & object;
//===========================================================
// MakeStyled
//===========================================================
export type MakeStyled<C extends typeof defaultConfig> = <
  Type extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  T extends MyStyling<C>,
  Option extends StyledOption<any, keyof JSX.IntrinsicElements>,
  Media = C["media"]
>(
  type: Type,
  styling: T,
  option?: Option
) => MyStyledComponent<C, Type, T, Option["as"]>;

export declare const styled: MakeStyled<typeof defaultConfig>;
export declare const makeStyled: <T extends typeof defaultConfig>(
  config: T
) => MakeStyled<T>;

//===========================================================
// FIXME:
//===========================================================
const Box = styled("div", {
  variants: {
    shape: {
      circle: {
        borderRadius: "50%",
      },
      rect: {
        borderRadius: 0,
      },
    },
  },
});
const Image = styled(
  Box,
  {
    variants: {
      shape: {
        round: {
          borderRadius: 10,
        },
      },
      size: {
        small: {
          width: 100,
          height: 100,
        },
      },
    },
  },
  { as: "img" }
);

type Prop = React.ComponentPropsWithRef<typeof Box>;
type x1 = Prop["shape"];

type IProps = React.ComponentPropsWithRef<typeof Image>;
type x2 = IProps["shape"];
// type x3 = IProps['sr'];
// React.Cre
type K = Debug<IProps>;
// const x = <Image shape="circle" />;
