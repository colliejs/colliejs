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
