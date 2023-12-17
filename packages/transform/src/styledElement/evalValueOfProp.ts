import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import log from "npmlog";
import { ImportsByName } from "../utils/types";
import { getValOfProp } from "./getNodePathOfStyling";
import { getAttr } from "./prop";
import { evalIdentifer } from "../utils/eval/evalIdentifier";
import { assert } from "@c3/utils";
import { evalObjectExp } from "../utils/eval/evalObjectExp";

export const evalValueOfProp = (
  path: NodePath<t.JSXElement>,
  propName: string,
  importsByName: ImportsByName = {}
) => {
  try {
    return _evalPropValue(path, propName, importsByName);
  } catch (e) {
    log.error("===>error", "evalPropValue", {
      function: "evalPropValue",
      path,
      propName,
      importsByName,
    });
    throw e;
  }
};

const _evalPropValue = (
  path: NodePath<t.JSXElement>,
  propName: string,
  importsByName: ImportsByName = {}
) => {
  const ele = path.node;
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
      const ipath = getValOfProp(path, propName);
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
      const ipath = getValOfProp(
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
