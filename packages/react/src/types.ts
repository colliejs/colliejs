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
// import { defaultConfig } from "@colliejs/core";
import { ConfigType, DefaultThemeMap } from "./types/config";
import { JSXElement } from "@babel/types";
export type IntrinsicElementsKeys = keyof JSX.IntrinsicElements;
export type HTMLTags = keyof HTMLElementTagNameMap;
type IsHostComponent<T> = T extends IntrinsicElementsKeys ? true : false;

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

export type StyledOption<Props, InnerAs extends IntrinsicElementsKeys> = {
  as?: InnerAs | undefined;
  wrapper?: IntrinsicElementsKeys;
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
    [key in string]: Partial<
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

//===========================================================
// MyStyledComponent
//TODO: 处理variants覆盖的情况
//===========================================================

type ComposeVariant<
  C extends _Config,
  Type extends IntrinsicElementsKeys | React.ComponentType<any>,
  Styling extends MyStyling<C>,
  CurVaraints = ExtractPropsFromStyling<Styling>
> = Type extends IntrinsicElementsKeys
  ? CurVaraints
  : {
      [K in keyof CurVaraints]?: K extends keyof React.ComponentProps<Type>
        ? CurVaraints[K] | React.ComponentProps<Type>[K]
        : CurVaraints[K];
    };

export type MyStyledComponentWithoutAs<
  C extends _Config,
  Type extends IntrinsicElementsKeys | React.ComponentType<any>,
  Styling extends MyStyling<C>
> = React.ForwardRefExoticComponent<
  Type extends IntrinsicElementsKeys
    ? JSX.IntrinsicElements[Type] & {
        css?: MyCss<C>;
        as?: IntrinsicElementsKeys;
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
type AttrOfAs<T> = T extends IntrinsicElementsKeys
  ? JSX.IntrinsicElements[T]
  : {};

export type MyStyledComponentWithAs<
  C extends _Config,
  Type extends IntrinsicElementsKeys | React.ComponentType<any>,
  Styling extends MyStyling<C>,
  As extends IntrinsicElementsKeys | undefined
> = React.ForwardRefExoticComponent<
  PropsWithoutRef<
    Util.Assign<
      As extends IntrinsicElementsKeys
        ? Util.Assign<React.ComponentPropsWithoutRef<Type>, AttrOfAs<As>>
        : React.ComponentPropsWithoutRef<Type>,
      ComposeVariant<C, Type, Styling> & {
        css?: MyCss<C>;
        as?: IntrinsicElementsKeys;
      }
    >
  > &
    RefAttributes<
      As extends undefined
        ? Type extends IntrinsicElementsKeys
          ? Type extends HTMLTags
            ? HTMLElementTagNameMap[Type]
            : HTMLElementTagNameMap["div"]
          : React.ComponentProps<Type>["ref"]["current"]
        : As extends IntrinsicElementsKeys
        ? As extends HTMLTags
          ? HTMLElementTagNameMap[As]
          : HTMLElementTagNameMap["div"]
        : never
    >
>;

export type MyStyledComponent<
  C extends _Config,
  Type extends IntrinsicElementsKeys | React.ComponentType<any>,
  Styling extends MyStyling<C>,
  As extends IntrinsicElementsKeys | undefined
> =
  // As extends undefined
  // ? MyStyledComponentWithoutAs<C, Type, Styling>
  MyStyledComponentWithAs<C, Type, Styling, As>;

type a1x = { a: number } & object;
//===========================================================
// MakeStyled
//===========================================================
export type MakeStyled<C extends _Config> = <
  Type extends IntrinsicElementsKeys | React.ComponentType<any>,
  T extends MyStyling<C>,
  Option extends StyledOption<any, IntrinsicElementsKeys> = { as: undefined }
>(
  type: Type,
  styling: T,
  option?: Option
) => MyStyledComponent<C, Type, T, Option["as"]>;

export declare const styled: MakeStyled<_Config>;
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
type Prop = React.ComponentPropsWithRef<typeof Box>;
type x21 = Prop["ref"];
type x1 = Prop["shape"];
type x221 = Prop["css"];
type x3 = Prop["onClick"];
type x4 = JSX.IntrinsicElements["div"]["onClick"];
const Image = styled(
  'span',
  {
    variants: {
      shape: {
        roundxx: {
          borderRadius: 10,
        },
      },
    },
  },
  { as: "img" }
);
type ImageProps = React.ComponentPropsWithRef<typeof Image>;
type x2 = ImageProps["shape"];
type x211 = ImageProps["ref"];
type kk1 = ImageProps["onClick"];

const Box2 = styled(Box, {
  variants: {
    shape: {
      round: {
        borderRadius: 10,
      },
    },
  },
});
const Box3 = styled(Box2, {});

type IProps2 = React.ComponentPropsWithRef<typeof Box2>;
type x22 = IProps2["shape"];
type x2112 = IProps2["ref"];
// type x21123 = IProps2["css"]['flex'];

type Iprops3 = React.ComponentPropsWithRef<typeof Box3>;
type x23 = Iprops3["shape"];
type x21123 = Iprops3["ref"];
// type x3 = IProps['sr'];
// React.Cre
type K = Debug<IProps>;
