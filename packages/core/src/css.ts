import { CSSObject, BaseConfig } from "./type";
import { toCssRules } from "./utils/toCssRules";
import { toHash } from "@c3/utils";
import { convertCssObjToMediaQuery } from "./convert";

export const css = <C extends BaseConfig>(
  cssObj: CSSObject<C>,
  selectors = [".my-class-name"],
  conditions = [],
  config: C
): string => {
  const newCssObj = convertCssObjToMediaQuery(cssObj, []);
  let res = "";
  toCssRules(newCssObj, selectors, conditions, config, (cssText: string) => {
    res += cssText + "\n";
  });
  return res.slice(0, -1);
};

export const makeCss = <Config extends BaseConfig>(config: Config) => {
  return (cssObj: CSSObject<Config>) => {
    const className = toHash(JSON.stringify(cssObj));
    return { className, cssText: css(cssObj, [`.${className}`], [], config) };
  };
};
