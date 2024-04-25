import { toCamelCase } from "@colliejs/shared";
import {
  ReadOnlyCSSVariable,
  ReadOnlyCSSVariableBp,
  VariantName,
  VariantValue,
  VariantsType,
} from "./type";

export const getVariantClassNameFromCandidates = (
  variantName: VariantName,
  variantValue: VariantValue,
  classNames: string[]
) => {
  const name = `variants-${toCamelCase(variantName)}-${toCamelCase(
    `${variantValue}`
  )}`;
  return classNames.find(e => e.startsWith(name));
};
export const StaticVariantKeyPrefix = "static-variants";
export const DynamicVariantKeyPrefix = "dynamic-variants";
export const CompoundVariantKeyPrefix = "compoundVariants";
export const VariantClassNamePrefix = "variants";
export const CompoundVariantClassNamePrefix = "compoundVariants";
export const getVariantKey = (
  variantName: VariantName,
  variantValue: VariantValue,
  isDynamic = false
) => {
  const variantNameCamelCase = toCamelCase(variantName);
  if (isDynamic) {
    return `${DynamicVariantKeyPrefix}-${variantNameCamelCase}` as VariantsType["dynamicKey"];
  }
  return `${StaticVariantKeyPrefix}-${variantNameCamelCase}-${toCamelCase(
    `${variantValue}`
  )}` as VariantsType["staticKey"];
};

export const getVariantClassName = (
  variantName: VariantName,
  variantValue: VariantValue,
  randomString: string,
  isDynamic = false
) => {
  const variantNameCamelCase = toCamelCase(variantName);
  const variantValueCamelCase = toCamelCase(String(variantValue));
  if (isDynamic) {
    return `${VariantClassNamePrefix}-${variantNameCamelCase}-dynamic-${randomString}` as VariantsType["dynamicClassName"];
  }
  return `${VariantClassNamePrefix}-${variantNameCamelCase}-${variantValueCamelCase}-${randomString}` as VariantsType["staticClassName"];
};

//因为variable只在当前元素生效，所以不需要加上其他限制
export const getCSSVariable = <T extends number | string | undefined>(
  variantName: VariantName,
  breakpointName?: T
): T extends number | string ? ReadOnlyCSSVariable : ReadOnlyCSSVariableBp => {
  const vn = toCamelCase(variantName);
  if (breakpointName === undefined) {
    //TODO: 这里的类型推断有问题
    //@ts-ignore
    return `--variants-${vn}` as ReadOnlyCSSVariable;
  }
  return `--variants-${vn}-at${breakpointName}` as ReadOnlyCSSVariableBp;
};

export const getCSSVariableValue = (
  variantName: VariantName,
  breakpointName?: string | number | undefined
) => {
  return `var(${getCSSVariable(variantName, breakpointName)})` as const;
};
// type x = Null
