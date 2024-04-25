import path from "path";
import { getConfig } from "./utils/getConfig";
import { FilterPattern, createFilter } from "@rollup/pluginutils";
import chokidar from "chokidar";
import { shouldSkip } from "@colliejs/shared";
import { extractCss } from "./utils/extractCss";
import log from "npmlog";

export function getCssEntryFile(entry: string) {
  return path.resolve(`${entry}/../collie-generated.css`);
}
export function extractWhen(
  event: string,
  options: { config: string },
  onEvent?: (url) => void,
) {
  const { config = "collie.config.ts" } = options;
  const {
    build: { include, exclude, root = process.cwd(), alias = {}, entry },
    css: cssConfig,
  } = getConfig(path.resolve(config));

  const cssEntryFile = getCssEntryFile(entry);
  // const filter = createFilter(include, exclude);
  const excludeArray = typeof exclude === "string" ? [exclude] : exclude;
  return chokidar
    .watch(include, {
      ignored: [/node_modules|dist/, ...excludeArray],
    })
    .on(event, async url => {
      onEvent?.(url);
      await extractCss(url, cssConfig, alias, root, cssEntryFile);
    });
}
