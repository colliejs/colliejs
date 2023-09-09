import { removeTypeAnnotation } from "./utils/removeType";
import { StyledElement } from "./styledElement";
import { Config } from "@colliejs/core";
import { parseCode } from "./parse";
import { dirname } from "node:path";
import {
  Alias,
  ImportsByName,
  generate,
  getImports,
  isStyledComponentDecl,
  isStyledElement,
  traverse,
} from "./utils";
import { StyledComponent } from "./styledComponent";
import { NodePath } from "@babel/traverse";
import { VariableDeclaration } from "@babel/types";

/**
 * NOTE: the module should be convert commonjs first
 */
export const transform = (
  source: string,
  moduleId: string,
  config: Config,
  alias = {},
  root = process.cwd()
) => {
  const fileAst = parseCode(source);
  let styledComponentCssMap = {};
  let styledElementCssTexts = "";
  const cssLayerDep: Record<string, string> = {};
  let modulesByName = {};

  traverse(fileAst, {
    //===========================================================
    // 1.transform styled component
    //===========================================================
    VariableDeclaration(path) {
      if (!isStyledComponentDecl(path.node)) {
        return;
      }
      if (Object.keys(modulesByName).length === 0) {
        modulesByName = getImports(
          parseCode(source).program,
          dirname(moduleId),
          alias,
          root
        );
      }
      modulesByName

      removeTypeAnnotation(path);
      const styledComponent = new StyledComponent(
        path,
        moduleId,
        modulesByName,
        config
      );
      const { cssText } = styledComponent.transform();
      styledComponentCssMap[styledComponent.layerName] = cssText;
      Object.assign(cssLayerDep, styledComponent.cssLayerDep());
    },

    //===========================================================
    // 2.transform styled element
    //===========================================================
    JSXElement(path) {
      if (!isStyledElement(path, config.styledElementProp)) {
        return;
      }
      if (Object.keys(modulesByName).length === 0) {
        modulesByName = getImports(
          parseCode(source).program,
          dirname(moduleId),
          alias,
          root
        );
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
