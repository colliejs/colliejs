import {
  CSSPropertiesComplex,
  DynamicVariantKey,
  StaticVariantKey,
  VariantName,
  VariantValue,
} from "@colliejs/core";

export type CSSInfo = {
  cssRawObj: CSSPropertiesComplex;
  cssGenText: string;
  className: string; //被渲染的原数的className。当前元素的className
};

export type DynamicVariant = {
  className: string;
  fn: (x: `var(--variants-dynamic-${string})`) => CSSPropertiesComplex;
};

export type VariantParsed = {
  [k in
    | StaticVariantKey
    | DynamicVariantKey
    | `compoundVariants-${string}`]: CSSInfo;
};
export type StylingParsed = {
  baseStyle: CSSInfo;
} & VariantParsed;

export type VariantDeclBlock = Record<
  VariantValue,
  CSSPropertiesComplex | DynamicVariant["fn"]
>;
export type Variants = Record<VariantName, VariantDeclBlock>;

export type CompoundVariants<S extends Styling> = ({
  [Name in keyof S["variants"]]?: S["variants"][Name];
} & {
  css: CSSPropertiesComplex;
})[];

export type Styling = CSSPropertiesComplex & {
  variants?: Variants;
  compoundVariants: CompoundVariants<Styling>; //TODO:
  // defaultVariants: Record<VariantName, string>;//不可能是函数作为默认值
  [x: string]: any;
};
