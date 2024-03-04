import { BaseConfig } from "@colliejs/core";
import { Alias, transform } from "@colliejs/transform";
import { defaultConfig } from "@colliejs/config";
import { LoaderContext } from "webpack";
import { FilterPattern, createFilter } from "@rollup/pluginutils";
import path from "node:path";
import {
  getCssFileName,
  shouldSkip,
  writeFile,
  writeThemeCssFile,
} from "@colliejs/shared";

type LoaderOption<Config extends BaseConfig> = {
  styledConfig?: Config;
  alias?: Alias;
  root?: string;
  include?: FilterPattern;
  exclude?: FilterPattern;
  entry: string;
};
export default function collieWebpackLoader<Config extends BaseConfig>(
  this: LoaderContext<LoaderOption<Config>>,
  source: string
) {
  const options = this.getOptions();
  const {
    styledConfig = defaultConfig,
    alias = {},
    root = process.cwd(),
    include,
    exclude,
    entry,
  } = options;
  // const callback = this.async();
  const filter = createFilter(include, exclude);
  const url = this.resourcePath || "";
  if (shouldSkip(url, filter)) {
    return source;
  } 
  let { code } = transform(source, url, styledConfig, alias, root);
  return code;
}
