import { Config } from "@colliejs/core";
import { parseCode } from "./parse";
import { StyledComponent } from "./styledComponent";
import { StyledElement } from "./styledElement";
import {
  generate,
  getImports,
  isStyledComponentDecl,
  isStyledElement,
  traverse,
} from "./utils";
import { removeTypeAnnotation } from "./utils/removeType";

/**
 * NOTE: the module should be convert commonjs first
 */
export const transform = (
  source: string,
  curFile: string,
  config: Config,
  alias = {},
  root = process.cwd()
) => {
  const fileAst = parseCode(source);
  // let styledComponentCssMap = {};
  let styledComponentCssTexts = "";
  let styledElementCssTexts = "";
  // const cssLayerDepsMap: Record<string, string> = {};
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
        modulesByName = getImports(fileAst.program, curFile, alias, root);
      }
      modulesByName;

      removeTypeAnnotation(path);
      const styledComponent = new StyledComponent(
        path,
        curFile,
        modulesByName,
        config,
        alias,
        root,
        true
      );
      const { cssText } = styledComponent.transform();
      styledComponentCssTexts += cssText + "\n";
      // styledComponentCssMap[styledComponent.layerName] = cssText;
      // Object.assign(cssLayerDepsMap, styledComponent.cssLayerDep());
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
          curFile,
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
    styledComponentCssTexts: styledComponentCssTexts.trim().replace("\n", ""),
    // cssLayerDep: cssLayerDepsMap,
    // styledComponentCssMap,
  };
};
