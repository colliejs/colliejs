import { createTheme } from "@colliejs/core";
import { writeFile } from "./utils/writeFile";
import { getCssFileName } from "./utils/fileurl";
import fs from "node:fs";
import path from "node:path";

const writeThemeCssFile = async function (
  prefix: string,
  theme: object,
  root: string
) {
  const { absUrl } = getCssFileName("styledTheme")(root);
  const cssText = createTheme(prefix, theme);
  writeFile(absUrl, cssText);
  return absUrl;
};

export async function addThemeToCssEntryFile(
  prefix: string,
  theme: object,
  cssEntryFile: string,
  cssRoot: string
) {
  if (!fs.existsSync(cssEntryFile)) {
    writeFile(cssEntryFile, "");
  }
  const themeFilename = await writeThemeCssFile(prefix, theme, cssRoot);
  let cssEntryFileContent = fs.readFileSync(cssEntryFile, {
    encoding: "utf-8",
  });
  const cssText = `@import "${path.relative(
    path.join(cssEntryFile, ".."),
    themeFilename
  )}";\n`;
  if (cssEntryFileContent.includes(cssText)) {
    return;
  }
  writeFile(cssEntryFile, cssText, { flag: "a" });
}
