import { unitProps } from "@colliejs/core";
export const isNil = (x: unknown): x is null | undefined =>
  x === null || x === undefined;
export const toArray = (x: unknown) => (Array.isArray(x) ? x : [x]);

export const isObject = (x: unknown): x is object =>
  typeof x === "object" && x !== null;

export const isString = (x: unknown): x is string => typeof x === "string";

export const getCSSValue = (key: any, value: string | number) => {
  if (!key) {
    return value;
  }
  if (isNil(value)) {
    return undefined;
  }
  if (key in unitProps) {
    return `${String(value).replace("px", "")}px`;
  }
  return value;
};
