import { type BaseConfig, css, CSSObject } from "@colliejs/core";
import _ from "lodash";
import { StyledObject, StyledObjectParsed, VariantDeclBlock } from "./types";
import {
  DynamicVariantFn,
  getCSSVariableValue,
  getCSSVariableValueByMedia,
  getVariantKey,
} from "./variants";
import { toHash } from "@c3/utils";
const toHashObject = (obj: any) => toHash(JSON.stringify(obj));

export type Props = { [k: string]: any };

export const getBaseStyleSelector = (prefix: string, hash: string) => {
  if (prefix) {
    return `baseStyle-${prefix}-${hash}`;
  }
  return `baseStyle-${hash}`;
};

export const convertStyledObject = <Config extends BaseConfig>(
  styling: StyledObject<Config>,
  config: Config,
  baseStylePrefix = ""
): StyledObjectParsed<Config> => {
  const res = {} as StyledObjectParsed<Config>;
  //===========================================================
  // 1.处理variants
  //===========================================================
  const variants = styling["variants"];
  for (const variantName in variants) {
    const variantDeclBlock: VariantDeclBlock<Config> = variants[variantName];
    for (const variantValue in variantDeclBlock) {
      let cssObj = {} as CSSObject<Config>;
      let cssObjOrDynamicFn = variantDeclBlock[variantValue];
      const isDynamicVariantFn = typeof cssObjOrDynamicFn === "function";
      if (isDynamicVariantFn) {
        const variantKey = getVariantKey(variantName, variantValue, true);
        cssObj = cssObjOrDynamicFn(
          getCSSVariableValueByMedia(variantName, config)
        );
        const className = `${variantKey}-${toHashObject(cssObj)}`;
        res[variantKey] = {
          cssGenText: css(cssObj, [`.${className}`], [], config),
          cssRawObj: cssObj,
          className: className,
          canWithoutPx: true,
        };
      } else {
        const variantKey = getVariantKey(variantName, "dynamic", true);
        cssObj = cssObjOrDynamicFn as CSSObject<Config>;
        const className = `${variantKey}-${toHashObject(cssObj)}`;
        res[variantKey] = {
          cssGenText: css(cssObj, [`.${className}`], [], config),
          cssRawObj: cssObj,
          className: className,
        };
      }
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
    const className = `${variantsKey}-${toHashObject(cssObj)}`;
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
    toHashObject(baseStyleCssObject)
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
