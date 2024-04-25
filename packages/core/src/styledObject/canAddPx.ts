import { pxProps } from "@colliejs/shared";
import { type BaseConfig } from "../type";
import { type CSSObject } from "../cssObject/type";
import { arrayify, s } from "@colliejs/shared";

export const canAddPx = <Config extends BaseConfig>(
  cssObject: CSSObject<Config>,
  config: Config
) => {
  for (const [key, value] of Object.entries(cssObject)) {
    const val = arrayify(s(value));
    const isVariantsCssVariable = val.every(e =>
      e.startsWith("var(--variants-")
    );
    if (!isVariantsCssVariable) {
      continue;
    }
    if (key in pxProps) {
      return true;
    }
    if (key in config.utils) {
      const style = config.utils[key](value);
      const ok = canAddPx(style, config);
      if (ok) {
        return true;
      }
    }
  }
  return false;
};
