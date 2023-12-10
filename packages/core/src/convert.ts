import _ from "lodash";
import { arraySyntax, isArraySyntax } from "./arraySyntax";
import { CSSPropertiesComplex } from "./type";
import { isObjectSyntax, objectSyntax } from "./objectSyntax";

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
    if (isArraySyntax(value)) {
      res = _.merge(res, arraySyntax(key, value, breakpoints));
    } else if (isObjectSyntax(value)) {
      res = _.merge(res, objectSyntax(key, value));
    } else if (typeof value === "object" && value) {
      res[key] = convertCssObjToMediaQuery(value, breakpoints);
    } else {
      res[key] = value;
    }
  });
  //TODO: 保证breakpoint小的排在前面，否则样式会被覆盖
  return res;
};
