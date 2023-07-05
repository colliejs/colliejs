import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import log from "npmlog";
import { evalStyling } from "../styling";
import { ImportsByName } from "../utils/types";
import { getNodePathOfValueForStyledElement } from "./getNodePathOfStyling";
import { getProp } from "./prop";
import { evalIdentifer } from "../utils/eval/evalIdentifier";
import { assert } from "@c3/utils";

export const evalPropValue = (
  ele: t.JSXElement,
  propName: string,
  importsByName: ImportsByName = {},
  path: NodePath<t.JSXElement>
) => {
  const prop = getProp(ele, propName);
  if (!prop) {
    log.info("prop", `prop ${propName} is not existed`);
    return undefined;
  }
  const val = prop.value;

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
      const ipath = getNodePathOfValueForStyledElement(path, propName);
      return evalStyling(importsByName, ipath);
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
      const ipath = getNodePathOfValueForStyledElement<t.Identifier>(
        path,
        propName
      );
      assert(!!ipath, "ipath should be existed");
      //@ts-ignore
      return evalIdentifer(ipath, importsByName);

    default:
      log.error("Unknown element", "", exp);
      throw new Error(`Unknown element type`);
  }
};
