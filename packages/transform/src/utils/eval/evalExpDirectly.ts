import { generate } from "../module";
import * as t from "@babel/types";
import { evalText } from "./evalText";

export const evalExpDirectly = (exp: t.Node, ctx: object) => {
  const code = generate(exp).code;
  return evalText(code, ctx);
};
