import { createTheme } from "@colliejs/core";
import fs from "node:fs";
import path from "node:path";
import { getCssThemeFile } from "./utils/fileurl";
import { writeFile } from "./utils/writeFile";

export async function addThemeToCssEntryFile(
  cssEntryFile: string,
  cssThemeFile: string
) {
  if (!fs.existsSync(cssEntryFile)) {
    writeFile(cssEntryFile, "");
  }
  let cssEntryFileContent = fs.readFileSync(cssEntryFile, {
    encoding: "utf-8",
  });
  const cssText = `@import "${path.relative(
    path.join(cssEntryFile, ".."),
    cssThemeFile
  )}";\n`;
  if (cssEntryFileContent.includes(cssText)) {
    return;
  }
  writeFile(cssEntryFile, cssText, { flag: "a" });
}
export function createThemeFile(
  srcRoot: string,
  prefix: string,
  theme: object
) {
  const cssText = createTheme(prefix, theme);
  const absUrl = getCssThemeFile(srcRoot);
  writeFile(absUrl, cssText);
  return absUrl;
}
