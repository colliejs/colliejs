import { run } from "@scriptbot/cli";
import chokidar from "chokidar";
import { extractCss } from "./utils/extractCss";
import { getConfig } from "./utils/getConfig";
import { writeFile } from "./utils/writeFile";
import { writeThemeCssFile } from "./utils/writeThemeCssFile";
import { shouldSkip } from "./utils/shouldSkip";

run({
  async init() {
    console.log("init");
  },
  async cssgen(options) {
    const root = options.root || process.cwd();
    const cssEntryFile = options.entry || process.cwd() + "/entry.css";
    // const filter = options.filter || (() => false);
    const alias = {};
    const config = await getConfig(options.config);
    const filename = await writeThemeCssFile(config.prefix, config.theme, root);
    writeFile(cssEntryFile, "");
    writeFile(cssEntryFile, `@import "${filename}";\n`, { flag: "a" });

    chokidar
      .watch("src/**/*.tsx")
      .on("change", async url => {
        console.log("changed:", url);
        // if (shouldSkip(url, filter)) return;
        await extractCss(url, config, alias, root, cssEntryFile);
      })
      .on("add", async url => {
        // if (shouldSkip(url, filter)) return;
        // console.log(url);
        await extractCss(url, config, alias, root, cssEntryFile);
      });
  },
});
