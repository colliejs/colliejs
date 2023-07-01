import generate from "@babel/generator";
import * as t from "@babel/types";
import { ImportsByName } from "../types";
import { evalIdentifer } from "./evalIdentifier";

export class MemberExpEval {
  constructor(
    private ast: t.MemberExpression,
    private importsByName: ImportsByName,
    private fileAst: t.File
  ) {
    this.ast = ast;
    this.importsByName = importsByName;
  }
  prepareEval() {
    const { object, property } = this.ast;
    if (t.isIdentifier(object)) {
      const exp = evalIdentifer(object, this.importsByName, this.fileAst);
      const { name } = object;
      // if (importsByName[name]) {
      //   const { source } = importsByName[name];
      //   return `${source}.${property.name}`;
      // }
    } else {
    }
    // return generate(ast).code;
  }
}
