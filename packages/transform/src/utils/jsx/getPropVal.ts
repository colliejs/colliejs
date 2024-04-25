import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import log from "npmlog";
import { ImportsByName } from "../types";
import { getAttr, getValPathOfProp } from "./prop";
import { evalIdentifer } from "../eval/evalIdentifier";
import { assert } from "@colliejs/shared";
import { evalObjectExp } from "../eval/evalObjectExp";

export const getPropValue = (
  path: NodePath<t.JSXElement>,
  propName: string,
  importsByName: ImportsByName = {}
) => {
  const prop = getAttr(path, propName);
  if (!prop) {
    throw new Error(`prop ${propName} is not existed`);
  }
  const val = prop.node.value;

  /**
   * @example
   * <Button disabled/>
   */
  if (!val) {
    return true;
  }

  let exp = val as t.Expression | t.JSXEmptyExpression;
  if (val.type === "JSXExpressionContainer") {
    exp = (val as t.JSXExpressionContainer).expression;
  }
  switch (exp.type) {
    case "ObjectExpression": {
      const ipath = getValPathOfProp(path, propName);
      assert(!!ipath && ipath.isObjectExpression(), "ipath is not object", {
        propName,
        ipath,
        exp,
      });
      return evalObjectExp(ipath, importsByName);
    }
    case "StringLiteral":
    case "NumericLiteral":
    case "BooleanLiteral":
      return exp.value;
    case "NullLiteral":
      return null;
    case "Identifier":
      if (exp.name === "undefined") {
        return undefined;
      }
      const ipath = getValPathOfProp(
        path,
        propName
      ) as unknown as NodePath<t.Identifier>;
      assert(!!ipath && ipath.isIdentifier(), "ipath is not identifier", {
        ipath,
        propName,
      });
      return evalIdentifer(ipath, importsByName);

    default:
      log.error("Unknown element", "", exp);
      throw new Error(`Unknown element type`);
  }
};
