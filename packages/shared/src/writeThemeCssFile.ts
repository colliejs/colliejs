import { getCssFileName } from "./getCssFileName";
import { createTheme } from "@colliejs/core";
import { writeFile } from "./writeFile";
export const writeThemeCssFile = (
  theme: object,
  prefix: string,
  root: string
) => {
  const themeCssFile = getCssFileName("styledTheme.css")(root);
  const cssText = createTheme(prefix, theme);
  writeFile(themeCssFile, cssText);
  return themeCssFile;
};
