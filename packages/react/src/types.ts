import React, {
  ClassAttributes,
  ElementRef,
  ElementType,
  PropsWithoutRef,
  RefAttributes,
} from "react";

import { Assign, BaseConfig, Widen, CSSObject } from "@colliejs/core";
import { DynamicVariantFnName, DynamicVariantFn } from "@colliejs/transform";

// export type IntrinsicElementsKeys = keyof JSX.IntrinsicElements | (string & {});
export type IntrinsicElementsKeys = keyof JSX.IntrinsicElements;
type IsHostComponent<T> = T extends IntrinsicElementsKeys ? true : false;
export type Debug<T> = { [K in keyof T]: T[K] };

export type BaseTypePropsWithAs<
  BaseComponent extends ElementType<any>,
  As extends IntrinsicElementsKeys
> = As extends undefined
  ? React.ComponentProps<BaseComponent>
  : React.ComponentProps<BaseComponent> & {
      as: As;
    } & React.ComponentProps<As>;

type VariantValue<
  NStyledObject extends { variants?: object },
  K extends keyof NStyledObject["variants"]
> = Widen<Exclude<keyof NStyledObject["variants"][K], "dynamic">>;

//===========================================================
// used by function styled
//===========================================================
type Variants<Config extends BaseConfig> = {
  [key in string]?: {
    [k: string]: CSSObject<Config> | DynamicVariantFn<Config> | undefined;
    dynamic?: DynamicVariantFn<Config>;
  };
};
type CompoundVariant<
  Config extends BaseConfig,
  NVariants extends { variants?: Variants<Config> }
> = {
  [k in keyof NVariants["variants"]]?: keyof NVariants["variants"][k];
} & {
  css: CSSObject<Config>;
};

export type StyledObject<
  Config extends BaseConfig,
  T extends StyledObject<Config, T>
> = CSSObject<Config> & {
  variants?: Variants<Config>;
  compoundVariants?: CompoundVariant<Config, T>[];
  defaultVariants?: {
    [key in keyof T["variants"]]?: keyof T["variants"][key];
  };
};

//===========================================================
// ExtractPropsFromStyling
// - DynamicFn:根据不同函数名，参数类型不同
//===========================================================

export type ExtractPropsFromStyledObject<
  NStyledObject extends { variants?: object }
> = {
  [K in keyof NStyledObject["variants"]]?: DynamicVariantFnName extends keyof NStyledObject["variants"][K]
    ?
        | ((VariantValue<NStyledObject, K> | (string & {})) | number)
        | (
            | VariantValue<NStyledObject, K>
            | (string & {})
            | number
            | undefined
          )[]
    : VariantValue<NStyledObject, K> | VariantValue<NStyledObject, K>[];
};

//===========================================================
// MyStyledComponent
//TODO: 处理variants覆盖的情况
//===========================================================

type ComposedVariant<
  TypeOfDeped extends IntrinsicElementsKeys | React.ComponentType<any>,
  VariantsOfCurType extends object
> = TypeOfDeped extends IntrinsicElementsKeys
  ? VariantsOfCurType
  : {
      [K in keyof VariantsOfCurType]?: K extends keyof React.ComponentProps<TypeOfDeped>
        ? VariantsOfCurType[K] | React.ComponentProps<TypeOfDeped>[K] //组合Type的variants和组件自带的CurVaraints
        : VariantsOfCurType[K];
    };

type AttrOfAs<T> = T extends IntrinsicElementsKeys
  ? JSX.IntrinsicElements[T]
  : {};

export type MyStyledComponent<
  Config extends BaseConfig,
  Type extends IntrinsicElementsKeys | React.ComponentType<any>,
  NStyledObject extends object,
  As extends IntrinsicElementsKeys | undefined = undefined
> = React.ForwardRefExoticComponent<
  PropsWithoutRef<
    Assign<
      As extends IntrinsicElementsKeys
        ? Assign<React.ComponentPropsWithoutRef<Type>, AttrOfAs<As>>
        : React.ComponentPropsWithoutRef<Type>,
      ComposedVariant<Type, ExtractPropsFromStyledObject<NStyledObject>> & {
        css?: CSSObject<Config>;
        as?: As;
        children?: React.ReactNode;
      }
    >
  > &
    ClassAttributes<ElementRef<As extends IntrinsicElementsKeys ? As : Type>>
>;

//===========================================================
// Styled
//===========================================================
export type Styled<Config extends BaseConfig> = <
  BaseComponent extends ElementType<any>,
  const NStyledObject extends StyledObject<Config, NStyledObject>
>(
  baseComponent: BaseComponent,
  styledObject: NStyledObject,
  propsOfBaseComponent?: React.ComponentProps<BaseComponent>
) => MyStyledComponent<Config, BaseComponent, NStyledObject>;

//===========================================================
// MakeStyled
//===========================================================
export type MakeStyled = <const Config extends BaseConfig>(
  config: Config
) => Styled<Config>;

// export declare const makeStyled: MakeStyled;
