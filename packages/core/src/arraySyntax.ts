import _ from "lodash";
import { CSSPropertiesComplex } from "./type";

/**
 * @param propertyKey: "width"
 * @param valueInArray: [10,20]
 * @param breakpoints: [768]
 * @returns :{'@media (max-width:breakpoints[0])':{width:10},'@media (min-width:(breakpoints[0]+1)px)':{width:20}}
 * 实现：
 * - breakpoints[a,b,c]变为区间[[undefined,a],[a,b],[b,c],[c,undefined]]
 * - 每一个区间对应一个media query
 */
export const arraySyntax = (
  propertyKey: string,
  valueInArray: any[],
  breakpoints: readonly number[]
): Record<`@media ${string}`, object> => {
  const mediaQueries = breakpoints
    .map((bk, index) => {
      if (!valueInArray[index]) {
        return undefined;
      }
      return {
        [`@media (min-width:${bk}px)`]: { [propertyKey]: valueInArray[index] },
      };
    })
    .filter(Boolean);
  return mediaQueries.reduce((acc, cur) => ({ ...acc, ...cur }), {});
};

/**
 *
 * @param cssObj: {width:[10,20],height:[20,40],color:"white"}
 * @param breakpoints: [768]
 * @returns:{
 *  '@media (min-width:breakpoints[0])':{width:10,height:20},
 *  '@media (min-width:(breakpoints[0]+1)px)':{width:20,height:40},
 *   color:"white"
 * }
 */

export const convertCssObjToMediaQuery = (
  cssObj: CSSPropertiesComplex,
  breakpoints: readonly number[]
) => {
  let res = {} as CSSPropertiesComplex;
  Object.keys(cssObj).forEach(key => {
    const value = cssObj[key];
    if (Array.isArray(value)) {
      res = _.merge(res, arraySyntax(key, value, breakpoints));
    } else if (typeof value === "object" && value) {
      res[key] = convertCssObjToMediaQuery(value, breakpoints);
    } else {
      res[key] = value;
    }
  });
  //TODO: 保证breakpoint小的排在前面，否则样式会被覆盖
  return res;
};
