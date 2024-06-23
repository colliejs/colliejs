import { s } from "@colliejs/shared";
import { BaseConfig } from "../type";
import { StyledObjectResult } from "./types";
import { getVariantKey, VariantKeyPrefix } from "./variants/variants";

export function getVariantKeyByProp<Config extends BaseConfig>(
  propName: string,
  propVal: any,
  result: StyledObjectResult<Config>
) {
  if (
    typeof propVal === "string" ||
    typeof propVal === "boolean" ||
    typeof propVal === "number"
  ) {
    const key = getVariantKey(propName, s(propVal));
    if (result[key]) {
      return key;
    }
  }
  if (result[`${VariantKeyPrefix}-${propName}-dynamic`]) {
    return `${VariantKeyPrefix}-${propName}-dynamic`;
  }
  return null;
}
export function getVariantKeyType<Config extends BaseConfig>(
  key: string,
  result: StyledObjectResult<Config>
) {
  if (!key) {
    return "unknown";
  }
  if (!key.startsWith(VariantKeyPrefix)) {
    return "unknown";
  }
  if (key.endsWith("-dynamic")) {
    return "dynamic";
  }
  return "static";
}
export function getVariantKeyTypeByProp<Config extends BaseConfig>(
  propName: string,
  propVal: any,
  result: StyledObjectResult<Config>
) {
  const key = getVariantKeyByProp(propName, propVal, result);
  return getVariantKeyType(key, result);
}

export function getVariantResultByProp<Config extends BaseConfig>(
  propName: string,
  propVal: any,
  result: StyledObjectResult<Config>
) {
  const key = getVariantKeyByProp(propName, propVal, result);
  return result[key];
}
