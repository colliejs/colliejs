import type { CSSProperties, Theme } from "./types";
import { CSS } from "./types";

//===========================================================
// BaseConfig Type,not the Actual Type
//===========================================================
export type BaseConfig = {
  prefix?: string;
  media?: object;
  theme?: Theme;
  themeMap?: object;
  utils?: {
    [key: string]: (value: any) => CSSProperties | any; //CSSObject<Config>
  };
  //additions
  breakpoints?: readonly number[];
  styledElementProp?: string;
  layername: string;
};

//===========================================================
// used by function css()
//===========================================================
export type CSSObject<Config extends BaseConfig> = {
  [K in keyof CSS<Config>]: CSS<Config>[K] | CSS<Config>[K][];
};

export type DynamicFn<T extends string, Config extends BaseConfig> = (
  x: ReadOnlyDynamicVariantVariableValue | ReadOnlyDynamicVariantVariableValue[]
) => CSSObject<Config>;

//===========================================================
//
//===========================================================
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
export type DynamicVariantFn = <Cfg extends BaseConfig>(
  cssVariableValue:
    | ReadOnlyDynamicVariantVariableValue
    | ReadOnlyDynamicVariantVariableValue[]
) => CSSObject<Cfg>;
