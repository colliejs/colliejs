import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { ImportsByName, generate } from "../utils";
import { evalText } from "../utils/eval/evalText";
import { getCtxOf } from "../utils/eval/getCtx";

export const evalStyling = (
  // stylingExp: t.ObjectExpression,
  imports: ImportsByName,
  path: NodePath
) => {
  const stylingExp = path.node;
  const ctx = getCtxOf(path, imports);
  const code = generate(stylingExp).code;
  return evalText(code, ctx);
};
