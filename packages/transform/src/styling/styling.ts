import {
  type BaseConfig,
  css,
  getDynamicVariableValue,
  getDynamicVariantKey,
  getStaticVariantKey,
  toHash,
  DynamicVariantFnName,
  DynamicVariantFn,
  CSSObject,
} from "@colliejs/core";
import _ from "lodash";
import {
  CSSInfo,
  Styling,
  StylingParsed,
  VariantDeclBlock,
  VariantParsed,
} from "./types";
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

export const parseStyling = <Config extends BaseConfig>(
  styling: Styling<Config>,
  config: Config,
  baseStylePrefix = ""
): StylingParsed<Config> => {
  const res = {} as StylingParsed<Config>;
  //===========================================================
  // 1.处理variants
  //===========================================================
  const variants = styling["variants"];
  for (const variantName in variants) {
    const variantDeclBlock: VariantDeclBlock<Config> = variants[variantName];
    for (const variantValue in variantDeclBlock) {
      let variantKey: string;
      let cssObj = {} as CSSObject<Config>;
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
            config.breakpoints?.map(e =>
              getDynamicVariableValue(variantName, e)
            )
          );
        } else {
          cssObj = dynFn(getDynamicVariableValue(variantName));
        }
      } else {
        variantKey = getStaticVariantKey(variantName, variantValue);
        cssObj = cssObjOrDynamicFn as CSSObject<Config>;
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
    //@ts-ignore
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
  ) as CSSObject<Config>;
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
export const parseCssProp = <Config extends BaseConfig>(
  cssPropObj: CSSObject<Config>,
  config: Config
): CSSInfo<Config> => {
  const empty = Object.keys(cssPropObj).length === 0;
  if (empty) {
    return {
      cssGenText: "",
      cssRawObj: {} as CSSObject<Config>,
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
