import { toHash } from "@c3/utils";
import {
  BaseConfig,
  CSSObject,
  CSSObjectResult,
  getCssText,
  getClassName,
} from "@colliejs/core";

export const extract = <Config extends BaseConfig>(
  cssObject: CSSObject<Config>,
  config: Config
): CSSObjectResult<Config> => {
  const empty = Object.keys(cssObject).length === 0;
  if (empty) {
    return {
      cssGenText: "",
      cssRawObj: {} as CSSObject<Config>,
      className: "",
    };
  }
  const className = `css-${getClassName(cssObject)}`;
  return {
    cssGenText: getCssText(cssObject, [`.${className}`], [], config),
    cssRawObj: cssObject,
    className,
  };
};
