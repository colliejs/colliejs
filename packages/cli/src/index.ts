import { createTheme } from "@colliejs/core";
import { run } from "@colliejs/shared";
import fg from "fast-glob";
import fs from "fs";
import log from "npmlog";
import path from "path";
import { extractWhen } from "./extract";
import { addThemeToCssEntryFile } from "./theme";
import { extractCss } from "./utils/extractCss";
import { getCssEntryFile } from "./utils/fileurl";
import { getConfig } from "./utils/getConfig";
import { contentOfCollieConfigFile, contentOfStyledFile } from "./template";

run({
  async init({ config = "collie.config.ts" }) {
    const {
      build: { entry, root },
    } = await getConfig(path.resolve(config));
    const cssEntryFile = getCssEntryFile(entry);
    const srcRoot = path.dirname(entry);
    const collieConfFile = path.resolve(root, "collie.config.ts");
    const styleFile = path.resolve(srcRoot, "styled.ts");
    fs.writeFileSync(cssEntryFile, "");
    fs.writeFileSync(collieConfFile, contentOfCollieConfigFile);
    fs.writeFileSync(styleFile, contentOfStyledFile);
  },
  async createTheme({ config = "collie.config.ts" }) {
    const {
      css: { prefix, theme },
    } = await getConfig(path.resolve(config));
    return createTheme(prefix, theme);
  },

  async cssgen({ config = "collie.config.ts" }) {
    const {
      build: { entry, include, exclude, alias },
      css: cssConfig,
    } = await getConfig(path.resolve(config));
    const cssRoot = path.resolve(path.dirname(entry));
    const cssEntryFile = getCssEntryFile(entry);
    await addThemeToCssEntryFile(
      cssConfig.prefix,
      cssConfig.theme,
      cssEntryFile,
      cssRoot
    );
    const ignore =
      typeof exclude === "string"
        ? [exclude, "node_modules"]
        : [...exclude, "node_modules"];
    fg.globSync(include, {
      ignore: ignore,
    }).forEach(async url => {
      await extractCss(url, cssConfig, alias, cssRoot, cssEntryFile);
    });
  },
  async watch(options: { config: string }) {
    await extractWhen("change", options, url => {
      log.info("watch", `changed file:${url} `);
    });
  },
});
