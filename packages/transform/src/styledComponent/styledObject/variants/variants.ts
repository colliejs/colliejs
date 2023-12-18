import { toCamelCase } from "@c3/utils";
import {
  VariantName,
  VariantValue,
  ReadOnlyCSSVariable,
  ReadOnlyCSSVariableValue,
  VariantsType,
} from "./type";
import { BaseConfig, Prefixed } from "@colliejs/core";

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

export const getVariantKey = (
  variantName: VariantName,
  variantValue: VariantValue,
  isDynamic = false
) => {
  const variantNameCamelCase = toCamelCase(variantName);
  if (isDynamic) {
    return `dynamic-variants-${variantNameCamelCase}` as VariantsType["dynamicKey"];
  }
  return `static-variants-${variantNameCamelCase}-${toCamelCase(
    `${variantValue}`
  )}` as VariantsType["staticKey"];
};

//因为variable只在当前元素生效，所以不需要加上其他限制
export const getCSSVariable = (
  variantName: VariantName,
  breakpointName?: string | number
): ReadOnlyCSSVariable => {
  return `--variants-dynamic-${toCamelCase(
    variantName
  )}-at${breakpointName}` as const;
};

export const getCSSVariableValue = (
  variantName: VariantName,
  breakpointName?: string | number
): ReadOnlyCSSVariableValue => {
  return `var(${getCSSVariable(variantName, breakpointName)})`;
};

// export const getCSSVariableValueByMedia = <Config extends BaseConfig>(
//   variantsName: string,
//   config: Config
// ): ReadOnlyCssValueByMedia<Prefixed<"@", keyof Config["media"]>> => {
//   const res = {} as ReadOnlyCssValueByMedia<
//     Prefixed<"@", keyof Config["media"]>
//   >;
//   Object.keys(config.media).forEach(e => {
//     const mediaName = `@${e}`;
//     res[mediaName] = getCSSVariableValue(variantsName, mediaName);
//   });
//   return res;
// };
