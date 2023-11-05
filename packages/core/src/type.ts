type Selector = string;
import * as CSS from "csstype";

export interface CSSProperties extends CSS.Properties<string | number> {
  /**
   * The index signature was removed to enable closed typing for style
   * using CSSType. You're able to use type assertion or module augmentation
   * to add properties or an index signature of your own.
   *
   * For examples and more information, visit:
   * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
   */
}
type ConfigUtils = {
  [customPropertyName: string]: (p: any) => CSSPropertiesComplex;
};

// type ConditionRule = Record<`@${string}`, CSSPropertiesComplex>;
type ConditionRule = Partial<{
  [key: `@${string}`]: CSSPropertiesComplex;
}>;

// type SelectorRule = Record<Selector, CSSPropertiesComplex>;
type SelectorRule = Partial<{ [key: Selector]: CSSPropertiesComplex }>;

type CustomPropertyRule = {
  [key in keyof ConfigUtils]?: any;
};

export type CSSPropertiesComplex = CSSProperties &
  CustomPropertyRule &
  ConditionRule;
//   & SelectorRule;

export type Config = {
  utils?: ConfigUtils;
  breakpoints?: readonly number[];
  media?: Record<string, string>; //to remove
  prefix: string;
  theme?: Record<string, any>;
  themeMap: Record<string, any>;
  styledElementProp?: string;
  layername: string;
};

export type ClassNameLiteral = string;
export type VariantName = string;
export type VariantValue = string | number;
export type CSSPropKey = string;

export type StaticVariantKey = `variants-static-${VariantName}-${VariantValue}`;

//以后再静态编译时自动设置CSSPropKey
export type DynamicVariantKey =
  | `variants-dynamic-${VariantName}` //不支持breakpoints
  | `variants-dynamic-${VariantName}-${CSSPropKey}` //不支持breakpoints
  | `variants-dynamic-${VariantName}-at` //支持breakpoints
  | `variants-dynamic-${VariantName}-${CSSPropKey}-at`; //支持breakpoints

export type BreakpointName = `at${string}`;

export type ReadOnlyDynamicVariantVariable =
  | `--variants-dynamic-${string}`
  | `--variants-dynamic-${string}-${BreakpointName}`;

export type ReadOnlyDynamicVariantVariableValue =
  | `var(--variants-dynamic-${string})`
  | `var(--variants-dynamic-${string}-${BreakpointName})`;

//函数名的结构
//dynamic_${CSSPropKey}_at
export type DynamicVariantFnName =
  | `dynamic`
  | `dynamic_${CSSPropKey}`
  | `dynamic_at`
  | `dynamic_${CSSPropKey}_at`;
export type DynamicVariantFn = (
  cssVariableValue:
    | ReadOnlyDynamicVariantVariableValue
    | ReadOnlyDynamicVariantVariableValue[]
) => CSSPropertiesComplex;
