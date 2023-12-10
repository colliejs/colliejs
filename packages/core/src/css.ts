import { CSSPropertiesComplex, Config } from "./type";
import _ from "lodash";
import { toCssRules } from "./utils/toCssRules.js";
import { toHash } from "./utils/toHash.js";
import { convertCssObjToMediaQuery } from "./convert";

export const css = (
  cssObj: CSSPropertiesComplex,
  selectors = [".my-class-name"],
  conditions = [],
  config: Config
): string => {
  const newCssObj = convertCssObjToMediaQuery(cssObj, config.breakpoints!);
  let res = "";
  toCssRules(newCssObj, selectors, conditions, config, (cssText: string) => {
    res += cssText + "\n";
  });
  return res.slice(0, -1);
};

export const cx = (cssObj: CSSPropertiesComplex, config: Config) => {
  const className = toHash(cssObj);
  return { className, cssText: css(cssObj, [`.${className}`], [], config) };
};
