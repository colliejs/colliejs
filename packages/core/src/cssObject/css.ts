import { type BaseConfig } from "../type";
import { toCssRules } from "../utils/toCssRules";
import { toHash } from "@colliejs/shared";
import { convertCssObjToMediaQuery } from "./convert";
import { type CSSObject } from "./type";

export const getCssText = <C extends BaseConfig>(
  cssObj: CSSObject<C>,
  selectors = [".my-class-name"],
  conditions = [],
  config: C
): string => {
  const newCssObj = convertCssObjToMediaQuery(cssObj, config.breakpoints);
  let res = "";
  toCssRules(newCssObj, selectors, conditions, config, (cssText: string) => {
    res += cssText + "\n";
  });
  return res.slice(0, -1);
};

export function getClassName<Config extends BaseConfig>(
  cssObj: CSSObject<Config>
) {
  //TODO: exclude url-like property
  return toHash(JSON.stringify(cssObj));
}

export const css = <Config extends BaseConfig>(cssObj: CSSObject<Config>) => {
  return `css-${getClassName(cssObj)}`;
};
