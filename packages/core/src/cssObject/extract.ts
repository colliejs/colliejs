import { type BaseConfig } from "../type";
import { getCssText, css } from "./css";
import { CSSObject, CSSObjectResult } from "./type";

export const extractFromCssObject = <Config extends BaseConfig>(
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
  const className = css(cssObject);
  return {
    cssGenText: getCssText(cssObject, [`.${className}`], [], config),
    cssRawObj: cssObject,
    className,
  };
};
