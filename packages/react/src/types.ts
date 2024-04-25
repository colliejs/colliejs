import React, {
  ClassAttributes,
  ElementRef,
  ElementType,
  LegacyRef,
  PropsWithoutRef,
  RefAttributes,
} from "react";

import { Assign, BaseConfig, Widen, CSSObject } from "@colliejs/core";
import { DynamicVariantFnName, DynamicVariantFn } from "@colliejs/core";

// export type IntrinsicElementsKeys = keyof JSX.IntrinsicElements | (string & {});
export type IntrinsicElementsKeys = keyof JSX.IntrinsicElements;
export type Debug<T> = { [K in keyof T]: T[K] };

export type DefaultProps<
  BaseComponentProps extends React.ComponentProps<any>,
  As extends IntrinsicElementsKeys | undefined
> = As extends IntrinsicElementsKeys
  ? React.ComponentProps<As>
  : BaseComponentProps;

type A = DefaultProps<React.ComponentProps<"div">, "button">;

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
  As extends IntrinsicElementsKeys | undefined
> = React.ForwardRefExoticComponent<
  Assign<
    As extends IntrinsicElementsKeys
      ? Assign<React.ComponentPropsWithoutRef<Type>, AttrOfAs<As>>
      : React.ComponentPropsWithoutRef<Type>,
    {
      css?: CSSObject<Config>;
      as?: IntrinsicElementsKeys; //TODO: infer As ,这里的As如果为真，那么应该支持更多属性。但是未实现
      children?: React.ReactNode;
      ref?: LegacyRef<ElementRef<As extends IntrinsicElementsKeys ? As : Type>>;
    } & ComposedVariant<Type, ExtractPropsFromStyledObject<NStyledObject>> 
  >
>;

//===========================================================
// Styled
//===========================================================
export type Styled<Config extends BaseConfig> = <
  BaseComponent extends ElementType<any>,
  const NStyledObject extends StyledObject<Config, NStyledObject>,
  const NDefaultProps extends DefaultProps<
    React.ComponentProps<BaseComponent>,
    As
  >,
  As extends IntrinsicElementsKeys | undefined = undefined
>(
  baseComponent: BaseComponent,
  styledObject: NStyledObject,
  props?: NDefaultProps & { as?: As }
) => MyStyledComponent<Config, BaseComponent, NStyledObject, As>;

//===========================================================
// MakeStyled
//===========================================================
export type MakeStyled = <const Config extends BaseConfig>(
  config: Config
) => Styled<Config>;

// export declare const makeStyled: MakeStyled;
