import { run } from "@scriptbot/cli";
import { extract } from "@colliejs/extract";

run({
  async watch() {
    //for each file changed
    let {
      styledElementCssTexts,
      styledComponentCssTexts,
    } = extract(code, url, styledConfig, alias, root);
    const cssFile = getCssFileName(url)(root);
    const cssTexts = `${styledElementCssTexts}\n${styledComponentCssTexts}`;
    const hasCssText = cssTexts.replace(/\s/g, "").length > 0;
    writeFile(cssFile, cssTexts);
  },
});
