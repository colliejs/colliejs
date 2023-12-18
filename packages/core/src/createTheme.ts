//@ts-nocheck
import { BaseConfig } from "./type";
import { toTailDashed } from "./utils/toTailDashed.js";
import { toTokenizedValue } from "./utils/toTokenizedValue.js";

export const createTheme = (prefix: string, theme: object) => {
  const cssProps: string[] = [];
  for (const scale in theme) {
    for (const token in theme[scale]) {
      const propertyName = `--${toTailDashed(prefix)}${scale}-${token}`;
      const propertyValue = toTokenizedValue(
        String(theme[scale][token]),
        prefix,
        scale
      );
      cssProps.push(`${propertyName}:${propertyValue}`);
    }
  }
  return `:root{${cssProps.join(";")}}`;
};
