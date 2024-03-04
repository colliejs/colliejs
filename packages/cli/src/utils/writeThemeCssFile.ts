import { getCssFileName } from "./getCssFileName";
import { createTheme } from "@colliejs/core";
import { writeFile } from "./writeFile";
export const writeThemeCssFile = async function (
  prefix: string,
  theme: object,
  root: string
) {
  const themeCssFile = getCssFileName("styledTheme.css")(root);
  const cssText = createTheme(prefix, theme);
  writeFile(themeCssFile, cssText);
  return themeCssFile;
};
