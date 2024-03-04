import { generate } from "../module";
import * as t from "@babel/types";
import { evalExpText } from "./evalText";

export const evalExpDirectly = (exp: t.Node, ctx: object) => {
  return evalExpText(generate(exp).code, ctx);
};
