import { createTheme } from "@colliejs/core";
import { run } from "@colliejs/shared";
import fg from "fast-glob";
import log from "npmlog";
import path from "path";
import { extractWhen } from "./extract";
import { contentOfStyledFile, contentOfCollieConfigFile } from "./template";
import { addThemeToCssEntryFile, createThemeFile } from "./theme";
import { extractCss } from "./utils/extractCss";
import { getCssEntryFile, getCssRoot } from "./utils/fileurl";
import { getConfig } from "./utils/getConfig";
import { writeFile } from "./utils/writeFile";
import { pathExistsSync, existsSync } from "fs-extra";

run({
  async init() {
    const filename = "collie.config.ts";
    if (!existsSync(filename)) {
      writeFile("collie.config.ts", contentOfCollieConfigFile);
    }
    const {
      build: { entry },
    } = await getConfig(path.resolve(filename));
    if (!existsSync(entry)) {
      log.error("init", `entry file not found: ${entry}`);
      process.exit(1);
    }

    const cssEntryFile = getCssEntryFile(entry);
    writeFile(cssEntryFile, "");

    const cssRoot = path.dirname(entry);
    const styleFile = path.resolve(cssRoot, "styled.ts");
    writeFile(styleFile, contentOfStyledFile);
    writeFile(".gitignore", `${cssRoot}/.collie/\n`);
    //TODO: add `npx collie watch` to your package.json scripts automatically
    console.log(
      'add `npx collie watch` to your package.json scripts like this `"dev": "vite & npx collie watch & wait"`'
    );
  },
  async createTheme({ config = "collie.config.ts" }) {
    const {
      css: { prefix, theme },
    } = await getConfig(path.resolve(config));
    return createTheme(prefix, theme);
  },

  async cssgen({ config = "collie.config.ts" }) {
    const {
      build: { entry, include, exclude, alias, root },
      css: cssConfig,
    } = await getConfig(path.resolve(config));
    const cssEntryFile = getCssEntryFile(entry);
    const themeFile = createThemeFile(
      getCssRoot(entry),
      cssConfig.prefix,
      cssConfig.theme
    );
    await addThemeToCssEntryFile(cssEntryFile, themeFile);

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
  async watch({ config = "collie.config.ts" }) {
    await this.cssgen({ config });
    await extractWhen("change", { config }, url => {
      log.info("watch", `changed file:${url} `);
    });
  },
});
