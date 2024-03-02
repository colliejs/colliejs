import { extract } from "@colliejs/extract";
import chokidar from "chokidar";
import fs from "node:fs";
import { BaseConfig } from "@colliejs/core";
import { getCssFileName } from "./getCssFileName";
import { writeFile } from "./writeFile";

export async function extractCss<T extends BaseConfig>(
  url: string,
  config: T,
  alias: Record<string, string>,
  root: string,
  cssEntryFile: string
) {
  let cssEntryFileContent = fs.readFileSync(cssEntryFile, {
    encoding: "utf-8",
  });
  const sourceCode = fs.readFileSync(url, { encoding: "utf-8" });
  let { styledElementCssTexts, styledComponentCssTexts } = extract(
    sourceCode,
    url,
    config,
    alias,
    root
  );
  if (!styledComponentCssTexts && !styledElementCssTexts) {
    return;
  }

  /**
   * 1.generate individual css file
   */
  const cssFile = getCssFileName(url)(root);
  const cssTexts = `${styledElementCssTexts}\n${styledComponentCssTexts}`;
  writeFile(cssFile, cssTexts);

  /**
   *
   * 2. 加入到entryFile
   */
  const importCss = `@import "${cssFile}";`;
  if (!cssEntryFileContent.includes(importCss)) {
    writeFile(cssEntryFile, `${importCss}\n`, { flag: "a" });
  }
}
