import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import log from "npmlog";
import { evalStyling } from "../styling";
import { ImportsByName } from "../utils/types";
import { getPathOfValueForStyledElement } from "./getNodePathOfStyling";
import { getAttr } from "./prop";
import { evalIdentifer } from "../utils/eval/evalIdentifier";
import { assert } from "@c3/utils";

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
    log.info("prop", `prop ${propName} is not existed`);
    return undefined;
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
      const ipath = getPathOfValueForStyledElement(path, propName);
      assert(!!ipath && ipath.isObjectExpression(), "ipath is not object", {
        propName,
        ipath,
        exp,
      });
      return evalStyling(ipath, importsByName);
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
      const ipath = getPathOfValueForStyledElement(
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
