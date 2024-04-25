import type { CSSProperties, BaseConfig, Prefixed } from "../../index";
import { CSSObjectResult, CSSObject } from "../../cssObject/type";
export type VariantName = string;
export type VariantValue = string | number;
export type CSSPropKey = keyof CSSProperties;
export type RandomString = string;

export type VariantsType = {
  staticKey: `static-variants-${VariantName}-${VariantValue}`;
  dynamicKey: `dynamic-variants-${VariantName}`;
  compoundKey: `compoundVariants-${string}`;
  defaultVariantKey: `defaultVariants`;
  staticClassName: `variants-${VariantName}-${VariantValue}-${RandomString}`;
  dynamicClassName: `variants-${VariantName}-dynamic-${RandomString}`;
  compoundClassName: `compoundVariants-${string}`;
};

export type BreakpointName = `at${string}`;

//一个variants下只有一个dynamic函数
export type ReadOnlyCSSVariableBp =
  `--variants-${VariantName}-${BreakpointName}`;
export type ReadOnlyCSSVariable = `--variants-${VariantName}`;

export type ReadOnlyCSSVariableValue = `var(${ReadOnlyCSSVariable})`;
export type ReadOnlyCSSVariableValueBP = `var(${ReadOnlyCSSVariableBp})`;
//函数名的结构
export type DynamicVariantFnName = `dynamic`;
export type DynamicVariantFn<Config extends BaseConfig> = (
  cssVariableValue: ReadOnlyCSSVariableValue | ReadOnlyCSSVariableValueBP[]
) => CSSObject<Config>;
