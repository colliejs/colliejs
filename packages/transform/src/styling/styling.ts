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
  const keys = Object.keys(styling);
  const variants = styling["variants"];
  const retVariants = {} as VariantParsed;
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
      retVariants[variantKey] = {
        cssGenText: css(cssObj, [`.${className}`], [], config),
        cssRawObj: cssObj,
        className: className,
      };
    }
    // }
  }
  const baseStyleCssObject = _.pick(
    styling,
    keys.filter(key => key !== "variants")
  );
  const baseStyleSelector = getBaseStyleSelector(
    baseStylePrefix,
    toHash(baseStyleCssObject)
  );
  return {
    baseStyle: {
      cssGenText: css(baseStyleCssObject, [`.${baseStyleSelector}`], [], config),
      cssRawObj: baseStyleCssObject,
      className: baseStyleSelector,
    },
    ...retVariants,
  };
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
