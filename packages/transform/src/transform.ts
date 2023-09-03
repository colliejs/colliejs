import { removeTypeAnnotation } from "./utils/removeType";
import { StyledElement } from "./styledElement";
import { Config } from "@colliejs/core";
import { parseCode } from "./parse";
import {
  ImportsByName,
  generate,
  isStyledComponentDecl,
  isStyledElement,
  traverse,
} from "./utils";
import { StyledComponent } from "./styledComponent";
import { NodePath } from "@babel/traverse";
import { VariableDeclaration } from "@babel/types";

export const transform = (
  source: string,
  moduleId: string,
  modulesByName: ImportsByName,
  config: Config
) => {
  const fileAst = parseCode(source);
  let styledComponentCssMap = {};
  let styledElementCssTexts = "";
  const cssLayerDep: Record<string, string> = {};

  traverse(fileAst, {
    //===========================================================
    // 1.transform styled component
    //===========================================================
    VariableDeclaration(path) {
      if (!isStyledComponentDecl(path.node)) {
        return;
      }
      removeTypeAnnotation(path);
      const styledComponent = new StyledComponent(
        path,
        moduleId,
        modulesByName,
        config
      );
      const { cssText } = styledComponent.transform();
      styledComponentCssMap[styledComponent.layerName] = cssText;
      // cssTexts += cssText + "\n";
      Object.assign(cssLayerDep, styledComponent.cssLayerDep());
    },
    //===========================================================
    // 2.transform styled element
    //===========================================================
    JSXElement(path) {
      if (!isStyledElement(path, config.styledElementProp)) {
        return;
      }
      removeTypeAnnotation(path);
      const styledElement = new StyledElement(path, modulesByName, config);
      const { cssText } = styledElement.transform();
      styledElementCssTexts += cssText + "\n";
    },
  });

  //===========================================================
  // 4. generate code
  //===========================================================
  const { code } = generate(fileAst);

  return {
    code,
    styledElementCssTexts: styledElementCssTexts.trim().replace("\n", ""),
    cssLayerDep,
    styledComponentCssMap,
  };
};
