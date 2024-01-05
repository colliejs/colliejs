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
  code: string
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
  const filter = createFilter(include, exclude);
  const url = this.resourcePath || "";
  if (shouldSkip(url, filter)) {
    return code;
  }

  //===========================================================
  // entry文件变动后，重新生成theme 样式文件
  //===========================================================
  const isEntryFile = path.resolve(root, entry) === url;
  let themeCssFile = "";
  if (isEntryFile) {
    themeCssFile = writeThemeCssFile(
      styledConfig.theme,
      styledConfig.prefix,
      root
    );
  }
  const importThemeCssText = isEntryFile ? `import "${themeCssFile}";` : "";

  //===========================================================
  // 普通文件
  //===========================================================
  let {
    code: transformedCode,
    styledComponentCssTexts,
    styledElementCssTexts,
  } = transform(code, url, styledConfig, alias, root);
  const cssText = styledElementCssTexts + "\n" + styledComponentCssTexts;
  const hasMeaningCss = cssText.replace(/\s/g, "").length > 0;
  if (!hasMeaningCss && !isEntryFile) {
    return code;
  }
  const cssFile = getCssFileName(url)(root);
  writeFile(cssFile, cssText);

  return `import "${cssFile}"; ${importThemeCssText};
   ${transformedCode};`;
}
