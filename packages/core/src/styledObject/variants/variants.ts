import { toCamelCase } from "@colliejs/shared";
import {
  ReadOnlyCSSVariable,
  ReadOnlyCSSVariableBp,
  VariantName,
  VariantValue,
  VariantsType,
} from "./type";

export function getVariantClassNameFromCandidates(
  variantName: VariantName,
  variantValue: VariantValue,
  classNames: string[]
) {
  const name = `variants-${toCamelCase(variantName)}-${toCamelCase(
    `${variantValue}`
  )}`;
  return classNames.find(e => e.startsWith(name));
}

export const VariantKeyPrefix = "variants";
export const VariantClassNamePrefix = "variants";

export function getVariantKey(
  variantName: VariantName,
  variantValue: VariantValue
): VariantsType["variantKey"] {
  return `variants-${toCamelCase(variantName)}-${toCamelCase(
    variantValue
  )}` as const;
}

// export function isStaticVariantKey(key: string) {
//   return key.startsWith(StaticVariantKeyPrefix);
// }

export function getVariantClassName(
  variantName: VariantName,
  variantValue: VariantValue,
  randomString: string,
  isDynamic = false
) {
  const variantNameCamelCase = toCamelCase(variantName);
  const variantValueCamelCase = toCamelCase(String(variantValue));
  if (isDynamic) {
    return `${VariantClassNamePrefix}-${variantNameCamelCase}-dynamic-${randomString}` as VariantsType["dynamicClassName"];
  }
  return `${VariantClassNamePrefix}-${variantNameCamelCase}-${variantValueCamelCase}-${randomString}` as VariantsType["staticClassName"];
}

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
