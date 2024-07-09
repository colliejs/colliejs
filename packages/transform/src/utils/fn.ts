import * as tt from "@babel/types";
import { generate } from "./module";
import log from "consola";

export type Fun =
  | tt.FunctionDeclaration
  | tt.FunctionExpression
  | tt.ArrowFunctionExpression;

export const fnUtils = {
  getRetValue(f: Fun) {
    const { body } = f;
    if (tt.isBlockStatement(body)) {
      for (let statement of body.body) {
        if (tt.isReturnStatement(statement)) {
          return (statement as tt.ReturnStatement).argument;
        }
      }
    } else {
      //形如()=>(<div>hello</div>)
      return body;
    }
  },
  getFnName(
    f: tt.FunctionDeclaration | tt.FunctionExpression | tt.VariableDeclaration
  ) {
    if (tt.isVariableDeclaration(f)) {
      const { declarations } = f;
      if (declarations.length > 0) {
        const { id } = declarations[0];
        if (tt.isIdentifier(id)) {
          return id.name;
        }
      }
    } else {
      const { id } = f;
      if (tt.isIdentifier(id)) {
        return id.name;
      }
    }
    log.error("does not find function name ", "f=", f);
    throw new Error("does not find function name");
  },
  makeFnRunable(
    ast: tt.FunctionDeclaration | tt.FunctionExpression | tt.VariableDeclaration
  ) {
    const fnText = generate(ast).code;
    const fn = Function(`return ${fnText};`);
    return fn();
  },
};
