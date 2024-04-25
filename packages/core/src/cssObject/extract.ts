import { BaseConfig, CSSObject, CSSObjectResult, css, getCssText } from "..";

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
