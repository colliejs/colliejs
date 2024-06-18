import { toHash } from "@colliejs/shared";
import _ from "lodash";
import { omit } from "lodash-es";
import { getCssText } from "../cssObject/css";
import { CSSObject } from "../cssObject/type";
import { type BaseConfig } from "../type";
import { canAddPx } from "./canAddPx";
import type { StyledObject, StyledObjectResult, VariantDeclBlock } from "./types";
import {
  DynamicVariantFn,
  ReadOnlyCSSVariableValue,
  ReadOnlyCSSVariableValueBP,
  getCSSVariableValue,
  getVariantClassName,
  getVariantKey
} from "./variants";
const toHashObject = (obj: any) => {
  try {
    return toHash(JSON.stringify(obj));
  } catch (e) {
    console.log("===>error", obj);
    throw e;
  }
};
export type Props = { [k: string]: any };
export const getBaseStyleSelector = (prefix: string, hash: string) => {
  if (prefix) {
    return `baseStyle-${prefix}-${hash}`;
  }
  return `baseStyle-${hash}`;
};

export const extractFromStyledObject = <Config extends BaseConfig>(
  styledObject: StyledObject<Config>,
  config: Config,
  baseStylePrefix = ""
): StyledObjectResult<Config> => {
  const res = {} as StyledObjectResult<Config>;
  
  //===========================================================
  // 1.处理baseStyle
  //===========================================================
  const keys = Object.keys(styledObject);
  const baseStyleCssObject = _.pick(
    styledObject,
    keys.filter(
      key => !["variants", "compoundVariants", "defaultVariants"].includes(key)
    )
  ) as CSSObject<Config>;
  const hasBaseStyle = Object.keys(baseStyleCssObject).length > 0;
  const baseStyleSelector = hasBaseStyle
    ? getBaseStyleSelector(baseStylePrefix, toHashObject(baseStyleCssObject))
    : "";
  res.baseStyle = {
    cssGenText: hasBaseStyle
      ? getCssText(baseStyleCssObject, [`.${baseStyleSelector}`], [], config)
      : "",
    cssRawObj: baseStyleCssObject,
    className: baseStyleSelector,
  };
  //===========================================================
  // 2.处理variants
  //===========================================================
  const variants = styledObject["variants"];
  for (const variantName in variants) {
    const specifiedVariantObject: VariantDeclBlock<Config> =
      variants[variantName];
    for (const variantValue in specifiedVariantObject) {
      let cssObjOrDynamicFn = specifiedVariantObject[variantValue];
      const variantKey = getVariantKey(variantName, variantValue);
      const isDynamicVariantFn = typeof cssObjOrDynamicFn === "function";
      if (isDynamicVariantFn) {
        const cssVariable:
          | ReadOnlyCSSVariableValue
          | ReadOnlyCSSVariableValueBP[] =
          (config.breakpoints?.length || 0) > 0
            ? (config.breakpoints || [])?.map(
                (e: number) =>
                  getCSSVariableValue(
                    variantName,
                    e
                  ) as ReadOnlyCSSVariableValueBP
              )
            : getCSSVariableValue(variantName);
        const cssObj = (cssObjOrDynamicFn as DynamicVariantFn<Config>)(
          cssVariable
        );

        const className = getVariantClassName(
          variantName,
          "dynamic",
          toHashObject(cssObj),
          true
        );
        res[variantKey] = {
          cssGenText: getCssText(
            omit(cssObj, "mixins"),
            [`.${className}`],
            [],
            config
          ),
          cssRawObj: cssObj,
          className: className,
          canAddPx: canAddPx(cssObj, config),
        };
      } else {
        const cssObj = cssObjOrDynamicFn as CSSObject<Config>;
        const className = getVariantClassName(
          variantName,
          variantValue,
          toHashObject(cssObj),
          false
        );
        res[variantKey] = {
          cssGenText: getCssText(
            omit(cssObj, "mixins"),
            [`.${className}`],
            [],
            config
          ),
          cssRawObj: cssObj,
          className: className,
        };
      }
    }
  }
  
  //===========================================================
  // 3.deal with defaultVariant
  //===========================================================
  const defaultVariants = styledObject["defaultVariants"] || {};
  res["defaultVariants"] = {
    getClassName(overrides: string[]) {
      const classeNames = [];
      for (const [variantName, variantValue] of Object.entries(
        defaultVariants
      )) {
        if (overrides.includes(variantName)) {
          continue;
        }
        classeNames.push(
          res[getVariantKey(variantName, variantValue)].className
        );
      }
      return classeNames;
    },
  };

  //===========================================================
  // 4.返回结果
  //===========================================================
  return res;
};
