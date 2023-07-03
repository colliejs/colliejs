import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { ImportsByName, generate } from "../utils";
import { evalText } from "../utils/eval/evalText";
import { getCtx } from "../utils/eval/getCtx";

export const evalStyling = (
  stylingExp: t.ObjectExpression,
  imports: ImportsByName,
  path: NodePath
) => {
  const ctx = getCtx(stylingExp, imports, path);
  const code = generate(stylingExp).code;
  return evalText(code, ctx);
};
