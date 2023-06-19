//@ts-ignore
import { toCamelCase } from "./utils/toCamelCase";

export type VariantName = string;
export type VariantValue = string | number;

export type StaticVariantKey = `variants-static-${VariantName}-${VariantValue}`;
export type DynamicVariantKey = `variants-dynamic-${VariantName}`;

export const getStaticVariantKey = (
  variantName: VariantName,
  variantValue: VariantValue
): StaticVariantKey => {
  return `variants-static-${toCamelCase(variantName)}-${toCamelCase(
    `${variantValue}`
  )}`;
};
export const getDynamicVariantKey = (
  variantName: VariantName
): DynamicVariantKey => {
  return `variants-dynamic-${toCamelCase(variantName)}`;
};
