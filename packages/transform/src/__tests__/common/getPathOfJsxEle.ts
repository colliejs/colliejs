import { is } from "@babel/types";
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
export const getPathOfStyledComponentDecl = (source: string) => {
  const file = parseCode(source);
  let path;
  traverse(file, {
    VariableDeclaration(ipath) {
      if (isStyledComponentDecl(ipath.node)) {
        path = ipath;
        ipath.stop();
      }
    },
  });
  return path;
};
export const getImportFromSource = (source: string,modlePath:string) => {
  const file = parseCode(source);
  return getImports(file.program, modlePath);
};
