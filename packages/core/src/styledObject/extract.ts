import { toHash } from "@colliejs/shared";
import _ from "lodash";
import { getCssText } from "../cssObject/cssObject";
import { CSSObject } from "../cssObject/type";
import { type BaseConfig } from "../type";
import { canAddPx } from "./canAddPx";
import { StyledObject, StyledObjectResult, VariantDeclBlock } from "./types";
import {
  CompoundVariantKeyPrefix,
  DynamicVariantFn,
  ReadOnlyCSSVariableValue,
  ReadOnlyCSSVariableValueBP,
  VariantValue,
  VariantsType,
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
  // 1.处理variants
  //===========================================================
  const variants = styledObject["variants"];
  for (const variantName in variants) {
    const variantDeclBlock: VariantDeclBlock<Config> = variants[variantName];
    for (const variantValue in variantDeclBlock) {
      // let cssObj = {} as CSSObject<Config>;
      let cssObjOrDynamicFn = variantDeclBlock[variantValue];
      const isDynamicVariantFn = typeof cssObjOrDynamicFn === "function";
      if (isDynamicVariantFn) {
        const variantKey = getVariantKey(variantName, "dynamic", true);
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
          cssGenText: getCssText(cssObj, [`.${className}`], [], config),
          cssRawObj: cssObj,
          className: className,
          canAddPx: canAddPx(cssObj, config),
        };
      } else {
        const variantKey = getVariantKey(
          variantName,
          variantValue,
          false
        ) as VariantsType["staticKey"];
        const cssObj = cssObjOrDynamicFn as CSSObject<Config>;
        const className = getVariantClassName(
          variantName,
          variantValue,
          toHashObject(cssObj),
          false
        );
        res[variantKey] = {
          cssGenText: getCssText(cssObj, [`.${className}`], [], config),
          cssRawObj: cssObj,
          className: className,
        };
      }
    }
  }
  //===========================================================
  // 2.处理compoundVariants
  //===========================================================
  const compoundVariants = styledObject["compoundVariants"] || [];
  for (const cv of compoundVariants) {
    const cssObj = cv.css;
    //@ts-ignore
    const compoundName = Object.entries(cv)
      .filter(([k, v]) => k !== "css")
      .map(([k, v]) => `${k}-${v}`)
      .join("-");
    const variantsKey = `${CompoundVariantKeyPrefix}-${compoundName}`;
    const className = `${variantsKey}-${toHashObject(cssObj)}`;
    res[variantsKey] = {
      cssGenText: getCssText(cssObj, [`.${className}`], [], config),
      cssRawObj: cssObj,
      className: className,
    };
  }
  //===========================================================
  // 3.deal with defaultVariant
  //===========================================================
  const defaultVariants = styledObject["defaultVariants"] || {};
  const classeNames = [];
  for (const [variantName, variantValue] of Object.entries(defaultVariants)) {
    const key = getVariantKey(variantName, variantValue as VariantValue, false);
    classeNames.push(res[key].className);
  }
  res["defaultVariants"] = {
    cssGenText: "",
    cssRawObj: {} as CSSObject<Config>,
    className: classeNames.join(" "),
  };

  //===========================================================
  // 4.处理baseStyle
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
  // 返回结果
  //===========================================================
  return res;
};
