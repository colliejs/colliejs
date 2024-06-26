import { extractCss as _extractCss } from "@colliejs/transform";
import fs from "node:fs";
import { BaseConfig } from "@colliejs/core";
import { getCssFileNameFromJs } from "./fileurl";
import { writeFile } from "./writeFile";
import path from "node:path";

export async function extractCss<T extends BaseConfig>(
  url: string,
  config: T,
  alias: Record<string, string>,
  cssRoot: string,
  cssEntryFile: string
) {
  let cssEntryFileContent = fs.readFileSync(cssEntryFile, {
    encoding: "utf-8",
  });
  const sourceCode = fs.readFileSync(url, { encoding: "utf-8" });
  let { styledElementCssTexts, styledComponentCssTexts } = _extractCss(
    sourceCode,
    url,
    config,
    alias,
    cssRoot
  );
  if (!styledComponentCssTexts && !styledElementCssTexts) {
    return;
  }

  /**
   * 1.generate individual css file
   */
  const { absUrl } = getCssFileNameFromJs(url, cssRoot);
  const cssTexts = `${styledElementCssTexts}\n${styledComponentCssTexts}`;
  writeFile(absUrl, cssTexts);

  /**
   *
   * 2. 加入到entryFile
   */
  const importCss = `@import "${path.relative(
    path.join(cssEntryFile, ".."),
    absUrl
  )}";`;
  if (!cssEntryFileContent.includes(importCss)) {
    writeFile(cssEntryFile, `${importCss}\n`, { flag: "a" });
  }
}
