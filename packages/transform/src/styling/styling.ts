import {
  CSSPropertiesComplex,
  Config,
  css,
  getDynamicVariantKey,
  getStaticVariantKey,
  toHash,
} from "@colliejs/core";
import _ from "lodash";
import {
  CSSInfo,
  Styling,
  StylingParsed,
  VariantDeclBlock,
  VariantParsed,
} from "./types";

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
      const isDynamic = variantValue === "dynamic";
      const dynamicVariantKey = getDynamicVariantKey(variantName);
      const staticVariantKey = getStaticVariantKey(variantName, variantValue);
      let cssObj = variantDeclBlock[variantValue];
      if (typeof cssObj === "function") {
        cssObj = cssObj(`var(--${dynamicVariantKey})`);
      }
      const variantKey = isDynamic ? dynamicVariantKey : staticVariantKey;

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
    const className = `compoundVariants-${name}-${toHash(cssObj)}`;
    res[className] = {
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
