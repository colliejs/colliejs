import { BaseConfig, defaultConfig } from "@colliejs/core";
import { Alias, transform } from "@colliejs/transform";
import { LoaderContext } from "webpack";
import { FilterPattern, createFilter } from "@rollup/pluginutils";
import path from "node:path";
import { getCssFileName, writeFile } from "@colliejs/shared";



const __dirname = path.dirname(new URL(import.meta.url).pathname);
const jsFileReg = /\.[cm]?[tj]sx?$/;

type LoaderOption<Config extends BaseConfig> = {
  styledConfig?: Config;
  alias?: Alias;
  root?: string;
  include?: FilterPattern;
  exclude?: FilterPattern;
};
export default function collieWebpackLoader<Config extends BaseConfig>(
  this: LoaderContext<LoaderOption<Config>>,
  code: string
) {
  const options = this.getOptions();

  const {
    styledConfig =defaultConfig,
    alias = {},
    root = process.cwd(),
    include,
    exclude,
  } = options;
  const filter = createFilter(include, exclude);
  const url = this.resourcePath || "";
  if (url.includes("node_modules") || !filter(url) || !jsFileReg.test(url)) {
    return code;
  }

  let {
    code: transformedCode,
    styledComponentCssTexts,
    styledElementCssTexts,
  } = transform(code, url, styledConfig, alias, root);
  const content = styledElementCssTexts + "\n" + styledComponentCssTexts;
  const hasMeaningContent = content.replace(/\s/g, "").length > 0;
  if (!hasMeaningContent) {
    return code;
  }
  const cssFile = getCssFileName(url)(root);
  writeFile(cssFile, content);
  return `import "${cssFile}"; ${transformedCode}`;
}
