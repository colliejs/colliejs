import type {
  CSSProperties,
  BaseConfig,
  CSSObject,
  Prefixed,
} from "@colliejs/core";
export type VariantName = string;
export type VariantValue = string | number;
export type CSSPropKey = keyof CSSProperties;
export type RandomString = string;

export type VariantsType = {
  staticKey: `static-variants-${VariantName}-${VariantValue}`;
  dynamicKey: `dynamic-variants-${VariantName}`;
  compoundKey: `compoundVariants-${string}`;
  staticClassName: `variants-${VariantName}-${VariantValue}-${RandomString}`;
  dynamicClassName: `variants-${VariantName}-dynamic-${RandomString}`;
  compoundClassName: `compoundVariants-${string}`;
};

export type BreakpointName = `at${string}`;

//一个variants下只有一个dynamic函数
export type ReadOnlyCSSVariable = `--variants-${VariantName}-${BreakpointName}`;
export type ReadOnlyCSSVariableValue = `var(${ReadOnlyCSSVariable})`;

//函数名的结构
export type DynamicVariantFnName = `dynamic`;
export type DynamicVariantFn<Config extends BaseConfig> = (
  cssVariableValue: ReadOnlyCSSVariableValue[]
) => CSSObject<Config>;
