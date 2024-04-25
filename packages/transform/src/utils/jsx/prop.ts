import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { assert } from "@colliejs/shared";

export function isPropExisted(
  jsxPath: NodePath<t.JSXElement>,
  propName: string
) {
  try {
    return !!getAttr(jsxPath, propName);
  } catch (e) {
    return false;
  }
}

/**
 * TODO:考虑props是JSXSpreadAttribute的情况
 */
export const getAttr = (path: NodePath<t.JSXElement>, prop: string) => {
  let ret: NodePath<t.JSXAttribute>;
  path
    .get("openingElement")
    .get("attributes")
    .forEach(attr => {
      if (attr.isJSXAttribute() && attr.node.name.name === prop) {
        ret = attr;
      }
    });
  return ret;
};
export const getSpreadAttr = (path: NodePath<t.JSXElement>) => {
  let ret: t.JSXSpreadAttribute;
  path
    .get("openingElement")
    .get("attributes")
    .forEach(attr => {
      if (attr.isJSXSpreadAttribute()) {
        ret = attr.node;
      }
    });
  return ret;
};
export const isClassNameInSpreadAttr = (path: NodePath<t.JSXElement>) => {};

export const delAttr = (path: NodePath<t.JSXElement>, prop: string) => {
  getAttr(path, prop).remove();
};

export const getValPathOfProp = (
  path: NodePath<t.JSXElement>,
  propsName: string
) => {
  let res: NodePath | undefined = undefined;
  const attr = getAttr(path, propsName);
  switch (attr.node.value.type) {
    case "JSXExpressionContainer":
      res = attr.get("value.expression") as NodePath;
      break;
    default:
      res = attr.get("value");
  }
  return res;
};

export const getValExpOfAttr = (
  path: NodePath<t.JSXElement>,
  name: string
): t.Expression => {
  const attr = getAttr(path, name);
  assert(!!attr, "attr.node is null", { attr });
  const val = attr.node.value;
  if (!val) {
    // return t.isLiteral(true);
    throw new Error("i dont know how to construct true literal");
  }
  let exp = val as t.Expression | t.JSXEmptyExpression;
  if (val.type === "JSXExpressionContainer") {
    exp = (val as t.JSXExpressionContainer).expression;
  }
  assert(t.isExpression(exp), "exp is not expression", { exp });
  //@ts-ignore
  return exp;
};
