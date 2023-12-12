//@ts-nocheck
import { BaseConfig } from "./type";
import { toTailDashed } from "./utils/toTailDashed.js";
import { toTokenizedValue } from "./utils/toTokenizedValue.js";

/** Returns returns tokens of that theme. */
export const createTheme = (config: BaseConfig) => {
  const theme = config.theme;
  //   const themeObject = {};
  const cssProps: string[] = [];
  for (const scale in theme) {
    // themeObject[scale] = {};

    for (const token in theme[scale]) {
      const propertyName = `--${toTailDashed(config.prefix)}${scale}-${token}`;
      const propertyValue = toTokenizedValue(
        String(theme[scale][token]),
        config.prefix,
        scale
      );

      //   themeObject[scale][token] = new ThemeToken(
      //     token,
      //     propertyValue,
      //     scale,
      //     config.prefix
      //   );

      cssProps.push(`${propertyName}:${propertyValue}`);
    }
  }
  return `:root{${cssProps.join(";")}}`;
};
