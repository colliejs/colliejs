import * as t from "@babel/types";
import log from "npmlog";
import { generate } from "../module";
import { ImportsByName } from "../types";

export const evalCodeText = (code: string, context: object) => {
  const body = `return ${code};`;
  try {
    // return new Function(...args, body)(...values);
    return new Function(...Object.keys(context), body)(
      ...Object.values(context)
    );
  } catch (e) {
    log.error("eval", "source code=", code, "context=", context);
    throw e;
  }
};

export const evalExp = (ast: t.Node, context: object) => {
  const code = generate(ast).code;
  return evalCodeText(code, context);
};
// eval
