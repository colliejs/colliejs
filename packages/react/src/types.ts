import React, { PropsWithoutRef, RefAttributes } from "react";

import type { CSS, DefaultThemeMap, Util } from "@colliejs/core";
import type { ConfigType } from "@colliejs/core/config";

import {
  DynamicVariantFnName,
  ReadOnlyDynamicVariantVariableValue,
} from "@colliejs/core";
// export type IntrinsicElementsKeys = keyof JSX.IntrinsicElements | (string & {});
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
  breakpoints?: readonly number[];
  utils: {};
};
export type _MyCss<T extends _Config> = CSS<T>;
export type MyCss<T extends _Config> = {
  [K in keyof _MyCss<T>]: _MyCss<T>[K] | _MyCss<T>[K][];
};

//===========================================================
// ExtractPropsFromStyling
// - DynamicFn:根据不同函数名，参数类型不同
//===========================================================
export type DynamicFn<T extends string, C extends _Config> = (
  x: ReadOnlyDynamicVariantVariableValue | ReadOnlyDynamicVariantVariableValue[]
) => MyCss<C>;

export type MyStyling<C extends _Config> = MyCss<C> & {
  variants?: {
    [key in string]: {
      [V in DynamicVariantFnName | (string & {})]?:
        | DynamicFn<key, C>
        | MyCss<C>;
    };
  };
  compoundVariants?: any;
  defaultVariants?: any;
};
// 判断K1和K2是否有交集，如果有返回true,否则返回false
export type Intersection<K1, K2> = K1 & K2 extends never ? false : true;

export type ExtractPropsFromStyling<
  T extends { variants?: { [name: string]: unknown } }
> = {
  [K in keyof T["variants"]]?: Intersection<
    keyof T["variants"][K],
    DynamicVariantFnName
  > extends true
    ? //TODO: | Util.Widen<Omit<keyof T["variants"][K], DynamicVariantFnName>>
      | ((Util.Widen<keyof T["variants"][K]> | (string & {})) | number)
        | (
            | (Util.Widen<keyof T["variants"][K]> | (string & {}))
            | number
            | undefined
          )[]
    : Util.Widen<keyof T["variants"][K]> | Util.Widen<keyof T["variants"][K]>[];
};

type o = {
  k: "a" | "b" | (string & {});
};
type o1<t extends o["k"]> = "1";
type x = o1<"a2">;
type T = {
  variants: { shape: { round: {}; dynamic: () => {} } };
};
type T1 = {
  variants: { shape: { round: {} } };
};
// type t1 = T1["variants"]["shape"];
// type x1 = ExtractPropsFromStyling<T>;
// type x11 = "xxx" extends x1["shape"] ? true : false;
// type x2 = ExtractPropsFromStyling<T1>;
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
      dynamic: x => {
        return {};
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
  "span",
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
