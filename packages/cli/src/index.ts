import { run } from "@scriptbot/cli";
import chokidar from "chokidar";
import { getConfig } from "./utils/getConfig";
import { writeFile } from "./utils/writeFile";
import { writeThemeCssFile } from "./utils/writeThemeCssFile";
import { shouldSkip } from "@colliejs/shared";
import { extractCss } from "./utils/extractCss";
import { FilterPattern, createFilter } from "@rollup/pluginutils";
import path from "path";

run({
  async init() {
    console.log("init");
  },
  async cssgen(options) {
    const { config: _config } = options;
    const {
      build: { include, exclude, root = process.cwd(), alias = {}, entry },
      css: cssConfig,
    } = await getConfig(path.resolve(_config));

    const cssEntryFile = path.resolve(`${entry}/../collie-generated.css`);
    const filename = await writeThemeCssFile(
      cssConfig.prefix,
      cssConfig.theme,
      root
    );

    writeFile(cssEntryFile, "");
    writeFile(cssEntryFile, `@import "${filename}";\n`, { flag: "a" });
    const filter = createFilter(include, exclude);

    chokidar
      .watch("src/**/*.tsx")
      .on("change", async url => {
        console.log("changed:", url);
        if (shouldSkip(url, filter)) {
          return;
        }
        await extractCss(url, cssConfig, alias, root, cssEntryFile);
      })
      .on("add", async url => {
        if (shouldSkip(url, filter)) {
          return;
        }
        await extractCss(url, cssConfig, alias, root, cssEntryFile);
      });
  },
});
