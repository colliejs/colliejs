import { toHash } from "@c3/utils";
import { BaseConfig, CSSObject, css } from "@colliejs/core";
import { CSSInfo } from "../type";

/**
 * <Button css={{color:'red'}}></Button>
 * @param cssPropObj
 * @param componentName
 * @returns
 */
export const convertCssProp = <Config extends BaseConfig>(
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
  const className = `css-${toHash(JSON.stringify(cssPropObj))}`;
  return {
    cssGenText: css(cssPropObj, [`.${className}`], [], config),
    cssRawObj: cssPropObj,
    className,
  };
};
