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

async function genThemeCssFile(
  prefix: string,
  theme: object,
  cssEntryFile: string,
  root: string
) {
  const themeFilename = await writeThemeCssFile(prefix, theme, root);
  writeFile(cssEntryFile, `@import "${themeFilename}";\n`, { flag: "a" });
}
run({
  async cssgen(options) {
    const { config = "collie.config.ts" } = options;
    const {
      build: { root = process.cwd(), entry, include, exclude, alias },
      css: cssConfig,
    } = await getConfig(path.resolve(config));
    const cssEntryFile = getCssEntryFile(entry);
    await genThemeCssFile(
      cssConfig.prefix,
      cssConfig.theme,
      cssEntryFile,
      root
    );
    // await extractWhen("add", { config });
    const filter = createFilter(include, exclude);
    fg.globSync(`${root}/**/*`, {
      ignore: ["node_modules/**", "dist/**", "**/.**"],
    }).forEach(async url => {
      if (filter(url)) {
        await extractCss(url, cssConfig, alias, root, cssEntryFile);
      }
    });
  },
  async watch(options) {
    extractWhen("change", options, noop, url => {
      log.info("watch", `to process changed file:${url} `);
    });
  },
});
