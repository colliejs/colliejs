import { run } from "@scriptbot/cli";
import path from "path";
import { extractWhen, getCssEntryFile } from "./extract";
import { getConfig } from "./utils/getConfig";
import { writeFile } from "./utils/writeFile";
import { writeThemeCssFile } from "./utils/writeThemeCssFile";
import log from "npmlog";
import { noop } from "@c3/utils";
import fg from "fast-glob";
import { createFilter } from "@rollup/pluginutils";
import { extractCss } from "./utils/extractCss";
import { shouldSkip } from "@colliejs/shared";
import fs from "fs";

async function importThemeCssFile(
  prefix: string,
  theme: object,
  cssEntryFile: string,
  root: string
) {
  const themeFilename = await writeThemeCssFile(prefix, theme, root);
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
run({
  async cssgen(options) {
    const { config = "collie.config.ts" } = options;
    const {
      build: { root = process.cwd(), entry, include, exclude, alias },
      css: cssConfig,
    } = await getConfig(path.resolve(config));
    const cssEntryFile = getCssEntryFile(entry);
    await importThemeCssFile(
      cssConfig.prefix,
      cssConfig.theme,
      cssEntryFile,
      root
    );
    const filter = createFilter(include, exclude);
    fg.globSync(`${root}/**/*`, {
      ignore: [`${root}/**/node_modules/**/*`, `${root}/**/dist/**/*`],
    }).forEach(async url => {
      if (shouldSkip(url, filter)) {
        return;
      }
      await extractCss(url, cssConfig, alias, root, cssEntryFile);
    });
  },
  async watch(options) {
    extractWhen("change", options, noop, url => {
      log.info("watch", `to process changed file:${url} `);
    });
  },
});
