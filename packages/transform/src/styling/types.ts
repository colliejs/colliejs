import type {
  DynamicVariantFn,
  DynamicVariantKey,
  StaticVariantKey,
  VariantName,
  CSSObject,
  BaseConfig,
  VariantValue,
} from "@colliejs/core";

export type CSSInfo<Config extends BaseConfig> = {
  cssRawObj: CSSObject<Config>;
  cssGenText: string;
  className: string; //被渲染的原数的className。当前元素的className
};

export type DynamicVariant = {
  className: string;
  fn: DynamicVariantFn;
};

export type VariantParsed<Config extends BaseConfig> = {
  [k in
    | StaticVariantKey
    | DynamicVariantKey
    | `compoundVariants-${string}`]: CSSInfo<Config>;
};
export type StylingParsed<Config extends BaseConfig> = {
  baseStyle: CSSInfo<Config>;
} & VariantParsed<Config>;

export type VariantDeclBlock<Config extends BaseConfig> = Record<
  VariantValue,
  CSSObject<Config> | DynamicVariant["fn"]
>;
export type Variants<Config extends BaseConfig> = Record<VariantName, VariantDeclBlock<Config>>;

export type CompoundVariants<Config extends BaseConfig> = ({
  [Name in keyof Styling<Config>["variants"]]?: Styling<Config>["variants"][Name];
} & {
  css: CSSObject<Config>;
})[];

//it is StyledObject
export type Styling<Config extends BaseConfig> = CSSObject<Config> & {
  variants?: Variants<Config>;
  compoundVariants: CompoundVariants<Config>; //TODO:
  // defaultVariants: Record<VariantName, string>;//不可能是函数作为默认值
  [x: string]: any;
};
