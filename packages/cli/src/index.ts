import { run } from "@scriptbot/cli";
import path from "path";
import { extractWhen, getCssEntryFile } from "./extract";
import { getConfig } from "./utils/getConfig";
import { writeFile } from "./utils/writeFile";
import { writeThemeCssFile } from "./utils/writeThemeCssFile";
import log from "npmlog";

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
      build: { root = process.cwd(), entry },
      css: cssConfig,
    } = await getConfig(path.resolve(config));

    await genThemeCssFile(
      cssConfig.prefix,
      cssConfig.theme,
      getCssEntryFile(entry),
      root
    );
    await extractWhen("add", { config });
  },
  async watch(options) {
    extractWhen("change", options, url => {
      log.info("changed url is: ", url);
    });
  },
});
