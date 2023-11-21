//@ts-ignore
import { type } from "os";
import {
  CSSPropertiesComplex,
  DynamicVariantFnName,
  DynamicVariantKey,
  ReadOnlyDynamicVariantVariable,
  ReadOnlyDynamicVariantVariableValue,
  StaticVariantKey,
  VariantName,
  VariantValue,
} from "./type";
import { toCamelCase } from "./utils/toCamelCase";

export const getStaticVariantKey = (
  variantName: VariantName,
  variantValue: VariantValue
): StaticVariantKey => {
  return `variants-static-${toCamelCase(variantName)}-${toCamelCase(
    `${variantValue}`
  )}`;
};
export const getDynamicVariantKey = (
  variantName: VariantName, //'shape'
  fnName?: DynamicVariantFnName
): DynamicVariantKey => {
  if (!fnName || typeof fnName !== "string") {
    return `variants-dynamic-${toCamelCase(variantName)}`;
  }
  const cssPropKey = fnName.replace(/_?at$|dynamic_?/g, "");

  if (/_at$/.test(fnName)) {
    if (!cssPropKey) {
      return `variants-dynamic-${toCamelCase(variantName)}-at`;
    }
    return `variants-dynamic-${toCamelCase(variantName)}-${toCamelCase(
      cssPropKey
    )}-at`;
  }
  if (!cssPropKey) {
    return `variants-dynamic-${toCamelCase(variantName)}`;
  }
  return `variants-dynamic-${toCamelCase(variantName)}-${toCamelCase(
    cssPropKey
  )}`;
};

//因为variable只在当前元素生效，所以不需要加上其他限制
export const getDynamicVariable = (
  variantName: VariantName,
  breakpointName?: string | number
): ReadOnlyDynamicVariantVariable => {
  if (!breakpointName) {
    return `--variants-dynamic-${toCamelCase(variantName)}` as const;
  }
  return `--variants-dynamic-${toCamelCase(
    variantName
  )}-at${breakpointName}` as const;
};

export const getDynamicVariableValue = (
  variantName: VariantName,
  breakpointName?: string | number
): ReadOnlyDynamicVariantVariableValue => {
  return `var(${getDynamicVariable(variantName, breakpointName)})`;
};

export const isSupportBreak = (fnName: string) => {
  return /_at$/.test(fnName);
};
