import React, { PropsWithoutRef, RefAttributes } from "react";

import type { Assign, BaseConfig, Widen, CSSObject } from "@colliejs/core";
import { DynamicVariantFnName, DynamicVariantFn } from "@colliejs/transform";
// export type IntrinsicElementsKeys = keyof JSX.IntrinsicElements | (string & {});
export type IntrinsicElementsKeys = keyof JSX.IntrinsicElements;
type IsHostComponent<T> = T extends IntrinsicElementsKeys ? true : false;

export type Debug<T> = { [K in keyof T]: T[K] };

export type StyledOption<Props, InnerAs extends IntrinsicElementsKeys> = {
  as?: InnerAs | undefined;
  wrapper?: IntrinsicElementsKeys;
  attrs?: Partial<Props> & JSX.IntrinsicElements[InnerAs];
};

//===========================================================
// used by function styled
//===========================================================
export type StyledObject<Cfg extends BaseConfig> = CSSObject<Cfg> & {
  variants?: {
    [key in string]: {
      [V in DynamicVariantFnName | (string & {})]?:
        | DynamicVariantFn<Cfg>
        | CSSObject<Cfg>;
    };
  };
  compoundVariants?: any;
  defaultVariants?: any;
};

//===========================================================
// ExtractPropsFromStyling
// - DynamicFn:根据不同函数名，参数类型不同
//===========================================================

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
      | ((Widen<keyof T["variants"][K]> | (string & {})) | number)
        | (
            | (Widen<keyof T["variants"][K]> | (string & {}))
            | number
            | undefined
          )[]
    : Widen<keyof T["variants"][K]> | Widen<keyof T["variants"][K]>[];
};

//===========================================================
// MyStyledComponent
//TODO: 处理variants覆盖的情况
//===========================================================

type ComposeVariant<
  C extends BaseConfig,
  Type extends IntrinsicElementsKeys | React.ComponentType<any>,
  Styling extends StyledObject<C>,
  CurVaraints = ExtractPropsFromStyling<Styling>
> = Type extends IntrinsicElementsKeys
  ? CurVaraints
  : {
      [K in keyof CurVaraints]?: K extends keyof React.ComponentProps<Type>
        ? CurVaraints[K] | React.ComponentProps<Type>[K]
        : CurVaraints[K];
    };

export type MyStyledComponentWithoutAs<
  Config extends BaseConfig,
  Type extends IntrinsicElementsKeys | React.ComponentType<any>,
  Styling extends StyledObject<Config>
> = React.ForwardRefExoticComponent<
  Type extends IntrinsicElementsKeys
    ? JSX.IntrinsicElements[Type] & {
        css?: CSSObject<Config>;
        as?: IntrinsicElementsKeys;
      } & ExtractPropsFromStyling<Styling> &
        RefAttributes<Type>
    : Assign<
        Omit<
          React.ComponentPropsWithRef<Type>,
          keyof ExtractPropsFromStyling<Styling>
        >,
        ComposeVariant<Config, Type, Styling>
      >
>;
type AttrOfAs<T> = T extends IntrinsicElementsKeys
  ? JSX.IntrinsicElements[T]
  : {};

export type MyStyledComponentWithAs<
  Config extends BaseConfig,
  Type extends IntrinsicElementsKeys | React.ComponentType<any>,
  Styling extends StyledObject<Config>,
  As extends IntrinsicElementsKeys | undefined
> = React.ForwardRefExoticComponent<
  PropsWithoutRef<
    Assign<
      As extends IntrinsicElementsKeys
        ? Assign<React.ComponentPropsWithoutRef<Type>, AttrOfAs<As>>
        : React.ComponentPropsWithoutRef<Type>,
      ComposeVariant<Config, Type, Styling> & {
        css?: CSSObject<Config>;
        as?: IntrinsicElementsKeys;
      }
    >
  > &
    RefAttributes<
      As extends undefined
        ? Type extends IntrinsicElementsKeys
          ? Type extends IntrinsicElementsKeys
            ? Type
            : "div"
          : React.ComponentProps<Type>["ref"]["current"]
        : As extends IntrinsicElementsKeys
        ? As extends IntrinsicElementsKeys
          ? As
          : "div"
        : never
    >
>;

export type MyStyledComponent<
  C extends BaseConfig,
  Type extends IntrinsicElementsKeys | React.ComponentType<any>,
  Styling extends StyledObject<C>,
  As extends IntrinsicElementsKeys | undefined
> =
  // As extends undefined
  // ? MyStyledComponentWithoutAs<C, Type, Styling>
  MyStyledComponentWithAs<C, Type, Styling, As>;

//===========================================================
// MakeStyled
//===========================================================
export type MakeStyled<Config extends BaseConfig> = <
  Type extends IntrinsicElementsKeys | React.ComponentType<any>,
  T extends StyledObject<Config>,
  Option extends StyledOption<any, IntrinsicElementsKeys> = { as: undefined }
>(
  type: Type,
  styling: T,
  option?: Option
) => MyStyledComponent<Config, Type, T, Option["as"]>;
