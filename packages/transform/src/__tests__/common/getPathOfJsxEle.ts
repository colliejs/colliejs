import * as t from "@babel/types";
import { parseCode } from "../../parse";
import { traverse } from "../../utils/module";
import { getImports, isStyledComponentDecl } from "../../utils";

export const getPathOfJSXElement = (source: string) => {
  const file = parseCode(source);
  let path;
  traverse(file, {
    JSXElement(ipath) {
      path = ipath;
      ipath.stop();
    },
  });
  return path;
};
export const getPathOfStyledComponentDecl = (
  source: string,
  componentName = undefined
) => {
  const file = parseCode(source);
  let path;
  traverse(file, {
    VariableDeclaration(ipath) {
      if (isStyledComponentDecl(ipath.node)) {
        if (componentName) {
          const name = (ipath.node.declarations[0].id as t.Identifier).name;
          if (name !== componentName) {
            return;
          }
        }
        path = ipath;
        ipath.stop();
      }
    },
  });
  return path;
};
export const getImportFromSource = (source: string, curFile: string) => {
  const file = parseCode(source);
  return getImports(file.program, curFile);
};
