import log from "npmlog";
import * as t from "@babel/types";
import { ObjectExpressionEval } from "../styling/objectExpressionEval";
import { ImportsByName } from "./types";
import { getFileModuleImport } from "./importer";

export const getPropValue = (
  ele: t.JSXElement,
  propName: string,
  importsByName: ImportsByName = {},
  fileAst: t.File
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
  switch (val.type) {
    case "JSXExpressionContainer": {
      const exp = (val as t.JSXExpressionContainer).expression;
      switch (exp.type) {
        case "ObjectExpression":
          const { args, values } = getFileModuleImport(importsByName);
          return new ObjectExpressionEval(exp)
            .prepareEvaluableObjectExp(importsByName, fileAst)
            .eval(args, values);
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
          //TODO:标志符可能是一个对象。
          const x = ObjectExpressionEval.getVariableValue(
            exp,
            importsByName,
            fileAst
          );
          if (!x) {
            throw new Error(`indentifer ${exp.name} is not found`);
          }
          if (x.type === "ObjectExpression") {
            const { args, values } = getFileModuleImport(importsByName);
            return new ObjectExpressionEval(x)
              .prepareEvaluableObjectExp(importsByName, fileAst)
              .eval(args, values);
          } else {
            console.log("maybe something wrong");
          }
          break;
        default:
          log.error("Unknown element", "", exp);
          throw new Error(`Unknown element type`);
      }
    }
    case "StringLiteral":
      return (val as t.StringLiteral).value;
    default:
      throw new Error(`element type ${val?.type} is not supported`);
  }
};

export function isPropExisted(ele: t.JSXElement, propName: string) {
  return getProp(ele, propName) !== undefined;
}

/**
 * TODO:考虑props是JSXSpreadAttribute的情况
 */
export const getProp = (ele: t.JSXElement, prop: string) => {
  const attr = ele.openingElement.attributes.find(
    e =>
      t.isJSXAttribute(e) && t.isJSXIdentifier(e.name) && e.name.name === prop
  ) as t.JSXAttribute | undefined;
  return attr;
};

export const delProp = (ele: t.JSXElement, prop: string) => {
  const index = ele.openingElement.attributes.findIndex(
    e =>
      t.isJSXAttribute(e) && t.isJSXIdentifier(e.name) && e.name.name === prop
  );
  if (index !== -1) {
    ele.openingElement.attributes.splice(index, 1);
  }
};
