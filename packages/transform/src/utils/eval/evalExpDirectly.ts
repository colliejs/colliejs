import { generate } from "../module";
import * as t from "@babel/types";
import { evalExpText } from "./evalText";

export const evalExpDirectly = (exp: t.Expression, ctx: object) => {
  const code = generate(exp).code;
  return evalExpText(code, ctx);
};
