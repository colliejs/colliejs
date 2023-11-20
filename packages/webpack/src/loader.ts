import { transform, Alias } from "@colliejs/transform";
import { urlToRequest } from "loader-utils";
import { Config, defaultConfig, toHash } from "@colliejs/core";
import {
  LoaderContext,
  LoaderDefinition,
  LoaderDefinitionFunction,
} from "webpack";

import { FilterPattern, createFilter } from "@rollup/pluginutils";
import path from "node:path";
import fs from "node:fs";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * 
 * @param code   styledConfig?: Config;
  alias?: Alias;
  root?: string;
 * @returns 
 */
type LoaderOption = {
  styledConfig?: Config;
  alias?: Alias;
  root?: string;
  include?: FilterPattern;
  exclude?: FilterPattern;
};
export default function collieWebpackLoader(
  this: LoaderContext<LoaderOption>,
  code: string
) {
  const options = this.getOptions();

  const {
    styledConfig = defaultConfig,
    alias = {},
    root = process.cwd(),
    include,
    exclude,
  } = options;
  const filter = createFilter(include, exclude);
  const url = urlToRequest(this.resourcePath);
  if (
    url.includes("node_modules") ||
    !filter(url) ||
    !/\.[cm]?[tj]sx?$/.test(url)
  ) {
    return code;
  }

  console.log("===>url", url);
  let {
    code: transformedCode,
    styledComponentCssTexts,
    styledElementCssTexts,
  } = transform(code, url, styledConfig, alias, root);
  const prefix = path.resolve(__dirname, "collie-cache");
  if (!fs.existsSync(prefix)) {
    fs.mkdirSync(prefix);
  }
  const cssFile = `${prefix}/${path.basename(url)}-${toHash(url)}.css`;
  console.log("===>cssFile", cssFile);
  fs.writeFileSync(
    cssFile,
    styledElementCssTexts + "\n" + styledComponentCssTexts,
    { encoding: "utf-8" }
  );

  return `import "${cssFile}"; ${transformedCode}`;
}
