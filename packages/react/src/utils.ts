import {
  getVariantClassNameFromCandidates,
  getVariantKey,
} from "@colliejs/transform";

export const isNil = (x: unknown): x is null | undefined =>
  x === null || x === undefined;
export const toArray = (x: unknown) => (Array.isArray(x) ? x : [x]);

export const isObject = (x: unknown): x is object =>
  typeof x === "object" && x !== null;

export const isString = (x: unknown): x is string => typeof x === "string";
export const isNumber = (x: unknown): x is number => typeof x === "number";

export const getCSSValue = (value: string | number, canWithoutPx: boolean) => {
  if (isNil(value)) {
    return undefined;
  }
  if (canWithoutPx && isNumber(value)) {
    return `${String(value).replace("px", "")}px`;
  }
  return value;
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
