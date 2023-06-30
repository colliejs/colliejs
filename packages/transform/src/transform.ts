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

//TODO: ast 到处传递的是引用
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

    //1.transform styled component
    VariableDeclaration(path) {
      if (isStyledComponentDecl(path.node)) {
        const styledComponent = new StyledComponent(
          path.node,
          moduleId,
          modulesByName,
          fileAst,
          config
        );
        const { cssText } = styledComponent.transform();
        cssTexts += cssText + "\n";
        Object.assign(cssLayerDep, styledComponent.cssLayerDep());
      }
    },
    //2.transform styled element
    JSXElement(path) {
      if (isStyledElement(path.node)) {
        const styledElement = new StyledElement(
          path.node,
          modulesByName,
          fileAst,
          config
        );
        const { cssText } = styledElement.transform();
        cssTexts += cssText + "\n";
      }
    },
  });

  // //2. transform styled component
  //4. generate code
  // const gen = typeof generate === 'function' ? generate : generate.default;
  const { code } = generate(fileAst);

  return { code, cssText: cssTexts.trim().replace("\n", ""), cssLayerDep };
};
