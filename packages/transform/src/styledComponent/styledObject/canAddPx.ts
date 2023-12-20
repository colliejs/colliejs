import { pxProps } from "@c3/css";
import type { BaseConfig, CSSObject } from "@colliejs/core";
import { toArray, s } from "@c3/utils";

export const canAddPx = <Config extends BaseConfig>(
  cssObject: CSSObject<Config>,
  config: Config
) => {
  for (const [key, value] of Object.entries(cssObject)) {
    const val = toArray(s(value));
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
