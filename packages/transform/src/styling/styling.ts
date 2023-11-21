import {
  CSSPropertiesComplex,
  Config,
  css,
  getDynamicVariableValue,
  getDynamicVariantKey,
  getStaticVariantKey,
  toHash,
  ReadOnlyDynamicVariantVariableValue,
  DynamicVariantFnName,
  DynamicVariantFn,
} from "@colliejs/core";
import _ from "lodash";
import {
  CSSInfo,
  Styling,
  StylingParsed,
  VariantDeclBlock,
  VariantParsed,
} from "./types";
import { s } from "@c3/utils";
import { isSupportBreak } from "@colliejs/core";

export type Props = { [k: string]: any };

//===========================================================================
// function
//===========================================================================

export const getBaseStyleSelector = (prefix: string, hash: string) => {
  if (prefix) {
    return `baseStyle-${prefix}-${hash}`;
  }
  return `baseStyle-${hash}`;
};

export const parseStyling = (
  styling: Styling,
  config: Config,
  baseStylePrefix = ""
): StylingParsed => {
  const res = {} as StylingParsed;
  //===========================================================
  // 1.处理variants
  //===========================================================
  const variants = styling["variants"];
  for (const variantName in variants) {
    const variantDeclBlock: VariantDeclBlock = variants[variantName];
    for (const variantValue in variantDeclBlock) {
      let variantKey: string;
      let cssObj = {} as CSSPropertiesComplex;
      let cssObjOrDynamicFn = variantDeclBlock[variantValue];
      const isDynamicVariantFn = typeof cssObjOrDynamicFn === "function";
      if (isDynamicVariantFn) {
        const dynFn = cssObjOrDynamicFn as DynamicVariantFn;
        variantKey = getDynamicVariantKey(
          variantName,
          variantValue as DynamicVariantFnName
        );
        const supportBreaksPoints = isSupportBreak(variantValue);
        if (supportBreaksPoints) {
          cssObj = dynFn(
            config.breakpoints.map(e => getDynamicVariableValue(variantName, e))
          );
        } else {
          cssObj = dynFn(getDynamicVariableValue(variantName));
        }
      } else {
        variantKey = getStaticVariantKey(variantName, variantValue);
        cssObj = cssObjOrDynamicFn as CSSPropertiesComplex;
      }
      const className = `${variantKey}-${toHash(cssObj)}`;
      res[variantKey] = {
        cssGenText: css(cssObj, [`.${className}`], [], config),
        cssRawObj: cssObj,
        className: className,
      };
    }
  }
  //===========================================================
  // 2.处理compoundVariants
  //===========================================================
  const compoundVariants = styling["compoundVariants"] || [];
  for (const cv of compoundVariants) {
    const cssObj = cv.css;
    const name = Object.entries(cv)
      .filter(([k, v]) => k !== "css")
      .map(([k, v]) => `${k}-${v}`)
      .join("-");
    const variantsKey = `compoundVariants-${name}`;
    const className = `${variantsKey}-${toHash(cssObj)}`;
    res[variantsKey] = {
      cssGenText: css(cssObj, [`.${className}`], [], config),
      cssRawObj: cssObj,
      className: className,
    };
  }
  //===========================================================
  // 3.deal width default  value
  //===========================================================

  //===========================================================
  // 4.处理baseStyle
  //===========================================================
  const keys = Object.keys(styling);
  const baseStyleCssObject = _.pick(
    styling,
    keys.filter(key => !["variants", "compoundVariants"].includes(key))
  );
  const baseStyleSelector = getBaseStyleSelector(
    baseStylePrefix,
    toHash(baseStyleCssObject)
  );
  res.baseStyle = {
    cssGenText: css(baseStyleCssObject, [`.${baseStyleSelector}`], [], config),
    cssRawObj: baseStyleCssObject,
    className: baseStyleSelector,
  };

  //===========================================================
  // 返回结果
  //===========================================================
  return res;
};

/**
 * <Button css={{color:'red'}}></Button>
 * @param cssPropObj
 * @param componentName
 * @returns
 */
export const parseCssProp = (
  cssPropObj: CSSPropertiesComplex,
  config: Config
): CSSInfo => {
  const empty = Object.keys(cssPropObj).length === 0;
  if (empty) {
    return {
      cssGenText: "",
      cssRawObj: {},
      className: "",
    };
  }
  const className = `css-${toHash(cssPropObj)}`;
  return {
    cssGenText: css(cssPropObj, [`.${className}`], [], config),
    cssRawObj: cssPropObj,
    className,
  };
};
