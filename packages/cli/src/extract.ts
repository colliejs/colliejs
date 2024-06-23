import chokidar from "chokidar";
import path from "path";
import { extractCss } from "./utils/extractCss";
import { getConfig } from "./utils/getConfig";

export function getCssEntryFile(entry: string) {
  return path.resolve(`${entry}/../collie.css`);
}
export async function extractWhen(
  event: string,
  options: { config: string },
  onEvent?: (url) => void
) {
  const { config = "collie.config.ts" } = options;
  const {
    build: { include, exclude, root = process.cwd(), alias = {}, entry },
    css: cssConfig,
  } = await getConfig(path.resolve(config));

  const cssEntryFile = getCssEntryFile(entry);
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
