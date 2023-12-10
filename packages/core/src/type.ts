type Selector = string;
import type { CSSProperties } from "./types";
import type { ConfigType } from "./types/config";

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

export type Config<
  Media = {},
  ThemeMap = {},
  Theme = {},
  Utils = {},
  Prefix = string
> = {
  media?: ConfigType.Media<Media>;
  prefix: ConfigType.Prefix<Prefix>;
  theme?: ConfigType.Theme<Theme>;
  themeMap: ConfigType.ThemeMap<ThemeMap>;
  utils?: ConfigType.Utils<Utils>;
  breakpoints?: readonly number[];
  styledElementProp?: string;
  layername: string;
};

export type ClassNameLiteral = string;
export type VariantName = string;
export type VariantValue = string | number;
export type CSSPropKey = keyof CSSProperties;

export type StaticVariantKey = `variants-static-${VariantName}-${VariantValue}`;

//以后在静态编译时自动设置CSSPropKey
export type DynamicVariantKey =
  | `variants-dynamic-${VariantName}` //不支持breakpoints//TODO:去掉
  | `variants-dynamic-${VariantName}-at` //支持breakpoints //TODO:去掉
  | `variants-dynamic-${VariantName}-${CSSPropKey}` //不支持breakpoints
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
  | `dynamic` //TODO:去掉
  | `dynamic_at` //TODO:去掉
  | `dynamic_${CSSPropKey}` //携带css属性(CSSPropKey)是为了可以省略掉px单位
  | `dynamic_${CSSPropKey}_at`;
export type DynamicVariantFn = (
  cssVariableValue:
    | ReadOnlyDynamicVariantVariableValue
    | ReadOnlyDynamicVariantVariableValue[]
) => CSSPropertiesComplex;
