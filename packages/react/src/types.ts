import React, {
  CSSProperties,
  ElementType,
  PropsWithoutRef,
  RefAttributes,
} from "react";
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
type B = { a: string; d?: string };
type K23 = Union<A, B>;
type K22 = A["b"];

// const x:A={a:1,b:undefined,c:2}

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
export type _Config = {
  media: {};
  theme: {};
  themeMap: {};
  utils: {};
};
export type MyCss<T extends _Config> = CSSUtil.CSS<
  T["media"],
  T["theme"],
  T["themeMap"],
  T["utils"]
>;
//===========================================================
// ExtractPropsFromStyling
//===========================================================
type DynamicFnPara<T extends string> = `var(--variants-dynamic-${T})`;
export type DynamicFn<T extends string, C extends _Config> = (
  x: DynamicFnPara<T>
) => MyCss<C>;

export type MyStyling<C extends _Config> = MyCss<C> & {
  variants?: {
    [key in string as key]: Partial<
      Record<"dynamic" | (string & {}), MyCss<C> | DynamicFn<key, C>>
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

type IsHostComponent<T> = T extends keyof JSX.IntrinsicElements ? true : false;

//===========================================================
// MyStyledComponent
//TODO: 处理variants覆盖的情况
//===========================================================

type ComposeVariant<
  C extends _Config,
  Type extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  Styling extends MyStyling<C>,
  CurVaraints = ExtractPropsFromStyling<Styling>
> = Type extends keyof JSX.IntrinsicElements
  ? CurVaraints
  : {
      [K in keyof CurVaraints]?: K extends keyof React.ComponentProps<Type>
        ? CurVaraints[K] | React.ComponentProps<Type>[K]
        : CurVaraints[K];
    };

export type MyStyledComponentWithoutAs<
  C extends _Config,
  Type extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  Styling extends MyStyling<C>
> = React.ForwardRefExoticComponent<
  Type extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[Type] & {
        css?: MyCss<C>;
        as?: keyof JSX.IntrinsicElements;
      } & ExtractPropsFromStyling<Styling> &
        RefAttributes<Type>
    : Util.Assign<
        Omit<
          React.ComponentPropsWithRef<Type>,
          keyof ExtractPropsFromStyling<Styling>
        >,
        ComposeVariant<C, Type, Styling>
      >
>;

export type MyStyledComponentWithAs<
  C extends _Config,
  Type extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  Styling extends MyStyling<C>,
  As extends keyof JSX.IntrinsicElements
> = React.ForwardRefExoticComponent<
  PropsWithoutRef<
    (Type extends keyof JSX.IntrinsicElements
      ? Util.Assign<JSX.IntrinsicElements[Type], JSX.IntrinsicElements[As]> & {
          css?: MyCss<C>;
          as?: keyof JSX.IntrinsicElements;
        }
      : Util.Assign<
          Omit<
            React.ComponentPropsWithRef<Type>,
            keyof ExtractPropsFromStyling<Styling>
          >,
          JSX.IntrinsicElements[As]
        >) &
      ComposeVariant<C, Type, Styling>
  > &
    RefAttributes<
      As extends undefined
        ? Type extends keyof JSX.IntrinsicElements
          ? Type
          : React.ComponentProps<Type>["ref"]
        : As
    >
>;

export type MyStyledComponent<
  C extends _Config,
  Type extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  Styling extends MyStyling<C>,
  As extends keyof JSX.IntrinsicElements | undefined
> =
  // As extends undefined
  // ? MyStyledComponentWithoutAs<C, Type, Styling>
  MyStyledComponentWithAs<C, Type, Styling, As>;

type a1x = { a: number } & object;
//===========================================================
// MakeStyled
//===========================================================
export type MakeStyled<C extends _Config> = <
  Type extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  T extends MyStyling<C>,
  Option extends StyledOption<any, keyof JSX.IntrinsicElements>
>(
  type: Type,
  styling: T,
  option?: Option
) => MyStyledComponent<C, Type, T, Option["as"]>;

export declare const styled: MakeStyled<typeof defaultConfig>;
export declare const makeStyled: <T extends _Config>(
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
type x21 = Prop["css"]["color"];

type IProps = React.ComponentPropsWithRef<typeof Image>;
type x2 = IProps["shape"];
// type x3 = IProps['sr'];
// React.Cre
type K = Debug<IProps>;
// const x = <Image shape="circle" />;
