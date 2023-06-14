import {
  CSSPropertiesComplex,
  DynamicVariantKey,
  StaticVariantKey,
  VariantName,
  VariantValue,
} from "@border-collie-js/core";

export type CSSInfo = {
  cssText: string;
  className: string; //被渲染的原数的className。当前元素的className
  cssObj: CSSPropertiesComplex;
};

export type DynamicVariant = {
  className: string;
  fn: (x: `var(--variants-dynamic-${string})`) => CSSPropertiesComplex;
};

//TODO:处理dynamic variant

export type VariantParsed = {
  [k in StaticVariantKey | DynamicVariantKey]: CSSInfo;
};
export type StylingParsed = {
  baseStyle: CSSInfo;
} & VariantParsed;

export type VariantDeclBlock = Record<
  VariantValue,
  CSSPropertiesComplex | DynamicVariant["fn"]
>;
export type Variants = Record<VariantName, VariantDeclBlock>;

export type Styling = CSSPropertiesComplex & {
  variants?: Variants;
  // compoundVariants: any; //TODO:
  // defaultVariants: Record<VariantName, string>;//不可能是函数作为默认值
  [x: string]: any;
};
