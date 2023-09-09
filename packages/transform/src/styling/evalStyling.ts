import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { ImportsByName, generate } from "../utils";
import { evalExpText } from "../utils/eval/evalText";
import { getCtxOf } from "../utils/eval/getCtx";
import { assert } from "@c3/utils";

export const evalStyling = (
  path: NodePath<t.ObjectExpression>,
  imports: ImportsByName
) => {
  assert(path.isObjectExpression(), "path is not object expression", { path });
  const stylingExp = path.node;
  const ctx = getCtxOf(path, imports);
  const code = generate(stylingExp).code;
  return evalExpText(code, ctx);
};
