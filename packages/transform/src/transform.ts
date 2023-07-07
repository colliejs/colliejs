import { Config } from "@colliejs/core";
import { StyledComponent, StyledElement } from "./component";
import { parseCode } from "./parse";
import {
  ImportsByName,
  generate,
  isStyledComponentDecl,
  isStyledElement,
  traverse,
} from "./utils";

export const transform = (
  source: string,
  moduleId: string,
  modulesByName: ImportsByName,
  config: Config
) => {
  const fileAst = parseCode(source);
  let cssTexts = "";
  const cssLayerDep: Record<string, string> = {};

  traverse(fileAst, {
    //===========================================================
    // 1.transform styled component
    //===========================================================
    VariableDeclaration(path) {
      if (!isStyledComponentDecl(path.node)) {
        return;
      }
      const styledComponent = new StyledComponent(
        path,
        moduleId,
        modulesByName,
        config
      );
      const { cssText } = styledComponent.transform();
      cssTexts += cssText + "\n";
      Object.assign(cssLayerDep, styledComponent.cssLayerDep());
    },
    //===========================================================
    // 2.transform styled element
    //===========================================================
    JSXElement(path) {
      if (!isStyledElement(path, config.styledElementProp)) {
        return;
      }
      const styledElement = new StyledElement(path, modulesByName, config);
      const { cssText } = styledElement.transform();
      cssTexts += cssText + "\n";
    },
  });

  //===========================================================
  // 4. generate code
  //===========================================================
  const { code } = generate(fileAst);

  return { code, cssText: cssTexts.trim().replace("\n", ""), cssLayerDep };
};
