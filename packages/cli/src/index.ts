import { createTheme } from "@colliejs/core";
import { run } from "@colliejs/shared";
import fg from "fast-glob";
import fs from "fs";
import log from "npmlog";
import path from "path";
import { extractWhen, getCssEntryFile } from "./extract";
import { extractCss } from "./utils/extractCss";
import { getConfig } from "./utils/getConfig";
import { writeFile } from "./utils/writeFile";
import { writeThemeCssFile } from "./utils/writeThemeCssFile";

async function importThemeCssFile(
  prefix: string,
  theme: object,
  cssEntryFile: string,
  root: string
) {
  if (!fs.existsSync(cssEntryFile)) {
    writeFile(cssEntryFile, "");
  }
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
  async init(options) {
    const { config = "collie.config.ts" } = options;
    const {
      build: { entry, root },
    } = await getConfig(path.resolve(config));
    const cssEntryFile = getCssEntryFile(entry);
    fs.writeFileSync(cssEntryFile, "");
    fs.writeFileSync(`${root}/collie.config.ts`, "export default {} as const;");
    // fs.writeFileSync(entry, "import './collie.css';");
  },
  async createTheme(options) {
    const { config = "collie.config.ts" } = options;
    const {
      css: { prefix, theme },
    } = await getConfig(path.resolve(config));
    return createTheme(prefix, theme);
  },

  async cssgen(options) {
    const { config = "collie.config.ts" } = options;
    const {
      build: {
        root = process.cwd(),
        entry,
        include,
        exclude = ["node_modules"],
        alias,
      },
      css: cssConfig,
    } = await getConfig(path.resolve(config));
    const cssEntryFile = getCssEntryFile(entry);
    await importThemeCssFile(
      cssConfig.prefix,
      cssConfig.theme,
      cssEntryFile,
      root
    );
    const ignore =
      typeof exclude === "string"
        ? [exclude, "node_modules"]
        : [...exclude, "node_modules"];
    fg.globSync(include, {
      ignore: ignore,
    }).forEach(async url => {
      await extractCss(url, cssConfig, alias, root, cssEntryFile);
    });
  },
  async watch(options: { config: string }) {
    await extractWhen("change", options, url => {
      log.info("watch", `changed file:${url} `);
    });
  },
});
