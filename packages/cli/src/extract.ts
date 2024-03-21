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
  onExec?: (url) => void
) {
  const { config = "collie.config.ts" } = options;
  const {
    build: { include, exclude, root = process.cwd(), alias = {}, entry },
    css: cssConfig,
  } = getConfig(path.resolve(config));

  const cssEntryFile = getCssEntryFile(entry);
  const filter = createFilter(include, exclude);
  chokidar
    .watch(root, {
      ignored: /node_modules|dist|^\./,
    })
    .on(event, async url => {
      onEvent?.(url);
      if (shouldSkip(url, filter)) {
        return;
      }
      onExec?.(url);
      await extractCss(url, cssConfig, alias, root, cssEntryFile);
    });
}
