import { CSSPropertiesComplex, Config } from "./type";
//@ts-ignore
import { toCssRules } from "./utils/toCssRules";
/**
 * 写个函数把
 * const  o = {
 * '& > div':{
 *      width:[10,20]
 *  }
 * }
 * 转换为
 * const o = {
 * "& > div":{
 *   "@media (max-width:breakpoints[0])":{
 *         width:10
 *      },
 *  "@media (min-width:(breakpoints[0]+1)px)":{
 *        width:20
 *   }
 *  }
 * }
 * 函数定义为convertToMediaQuery(o,breakpoints)
 * @param style
 */
// [768, 1024, 1280]
export const arraySyntax = (
  propertyKey: string,
  valueInArray: any[],
  breakpoints: readonly number[]
): Record<`@media ${string}`, object> => {
  const ranges: [number | undefined, number | undefined][] = [];
  const bks = [0, ...breakpoints];
  bks.forEach((e, idx) => {
    const start = bks[idx] || undefined;
    const end = bks[idx + 1] ? bks[idx + 1] - 0.0001 : undefined;
    ranges.push([start, end]);
  });
  const mediaQuery = ranges.map((range, index) => {
    const qry =
      range[0] === undefined
        ? `@media (max-width:${range[1]}px)`
        : range[1] === undefined
        ? `@media (min-width:${range[0]}px)`
        : `@media (min-width:${range[0]}px) and (max-width:${range[1]}px)`;
    return {
      [qry]: { [propertyKey]: valueInArray[index] },
    };
  });
  return mediaQuery.reduce((acc, cur) => ({ ...acc, ...cur }), {});
};

export const convertCssObjToMediaQuery = (
  cssObj: CSSPropertiesComplex,
  breakpoints: readonly number[]
) => {
  const res = {} as CSSPropertiesComplex;
  Object.keys(cssObj).forEach(key => {
    const value = cssObj[key];
    if (Array.isArray(value)) {
      Object.assign(res, arraySyntax(key, value, breakpoints));
    } else if (typeof value === "object" && value) {
      res[key] = convertCssObjToMediaQuery(value, breakpoints);
    } else {
      res[key] = value;
    }
  });
  return res;
};

export const css = (
  cssObj: CSSPropertiesComplex,
  selectors = [".my-class-name"],
  conditions = [],
  config: Config
) => {
  const newCssObj = config.breakpoints
    ? convertCssObjToMediaQuery(cssObj, config.breakpoints!)
    : cssObj;
  let res = "";
  toCssRules(newCssObj, selectors, conditions, config, (cssText: string) => {
    res += cssText + "\n";
  });
  return res.slice(0, -1);
};
export const cx = css;
