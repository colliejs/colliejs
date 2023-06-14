import * as t from "@babel/types";
import dbg from "npmlog";
import { generate } from "./module";
import { ImportsByName } from "./types";

export const evalText = (
  code: string,
  args: any[] = [],
  values: any[] = []
) => {
  const body = `return ${code};`;
  try {
    return new Function(...args, body)(...values);
  } catch (e) {
    dbg.error("eval", "source code=", code);
    throw e;
  }
};

export const evalAst = (ast: t.Node, args: any[] = [], values: any[] = []) => {
  const code = generate(ast).code;
  return evalText(code, args, values);
};
