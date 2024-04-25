import type {
  ReadOnlyCSSVariable,
  ReadOnlyCSSVariableBp,
  VariantName,
  VariantValue,
} from "@colliejs/core";
export const CompoundVariantClassNamePrefix = "compoundVariants";

export const isNil = (x: unknown): x is null | undefined =>
  x === null || x === undefined;
export const toArray = (x: unknown) => (Array.isArray(x) ? x : [x]);

export const isObject = (x: unknown): x is object =>
  typeof x === "object" && x !== null;
export const isPlainObject = (x: unknown): x is object =>
  isObject(x) &&
  (Object.getPrototypeOf(x) === null ||
    Object.getPrototypeOf(x) === Object.prototype);

export const isString = (x: unknown): x is string => typeof x === "string";
export const isNumber = (x: unknown): x is number => typeof x === "number";
export const toCamelCase = (s: string) =>
  s.replace(/[-_](.)/g, (_, m) => m.toUpperCase());

export const getCSSValue = (value: string | number, canAddPx: boolean) => {
  if (isNil(value)) {
    return undefined;
  }
  if (canAddPx && isNumber(value)) {
    return `${String(value).replace("px", "")}px`;
  }
  return value;
};

//TODO:为了不依赖@colliejs/transform.必须复制一份。需要优化
export const getVariantClassNameFromCandidates = (
  variantName: VariantName,
  variantValue: VariantValue,
  classNames: string[]
) => {
  const name = `variants-${toCamelCase(variantName)}-${toCamelCase(
    `${variantValue}`
  )}`;
  return classNames?.find(e => e.startsWith(name)) || "";
};
//TODO:为了不依赖@colliejs/transform.必须复制一份。需要优化
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

/**
 *
 * @param className '
 * @param staticClasses
 * @returns
 */
export const isStaticVariantClass = (
  prop: string,
  value: string | number,
  staticClasses: string[]
) => {
  return !!getVariantClassNameFromCandidates(prop, value, staticClasses);
};

/**
 * 获取可用的compoundVariantsClassName
 * staticVariantsProps: {shape:"round",size:"large",device:'mobile"}
 * compoundClasses: "compoundVariants-shape-round-size-large-device-mobile-${randomString}"
 * @param compoundClasses
 */
export const getCompoundVariantClassNameUsed = (
  compoundClasses: string[],
  staticVariantsProps: Record<string, string | number>
) => {
  const res: string[] = [];
  for (const compoundClass of compoundClasses) {
    const _compoundClass = compoundClass
      .replace(`${CompoundVariantClassNamePrefix}-`, "")
      .replace(/-\w+$/, "");
    const staticVariants = _compoundClass.split("-");
    let isCompoundClassUsed = true;
    for (let i = 0; i < staticVariants.length; i = i + 2) {
      const key = staticVariants[i];
      const value = staticVariants[i + 1];
      if (staticVariantsProps[key] !== value) {
        isCompoundClassUsed = false;
        break;
      }
    }
    if (isCompoundClassUsed) {
      res.push(compoundClass);
    }
  }
  return res;
};
