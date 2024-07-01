import {merge} from "lodash-es";
import { arraySyntax, isArraySyntax } from "./arraySyntax";
import { isObjectSyntax, objectSyntax } from "./objectSyntax";
import { CSSObject } from "./type";
import { BaseConfig } from "../type";
import { CSS } from "../types/index";
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
export const convertCssObjToMediaQuery = <Config extends BaseConfig>(
  cssObj: CSSObject<Config>,
  breakpoints: readonly number[]
): CSS<Config> => {
  let res = {};
  Object.keys(cssObj).forEach(key => {
    const value = cssObj[key];
    if (isArraySyntax(value)) {
      res = merge(res, arraySyntax(key, value, breakpoints));
      // } else if (isObjectSyntax(value)) {
      // res = _.merge(res, objectSyntax(key, value));
    } else if (typeof value === "object" && value) {
      res[key] = convertCssObjToMediaQuery(value, breakpoints);
    } else {
      res[key] = value;
    }
  });
  return res;
};
