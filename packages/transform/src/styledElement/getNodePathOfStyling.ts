import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { getAttr } from "./prop";
/**
 *
 * <Button css={{color:'red'}}>
 * @param path :
 */

//TODO: boolean类型会被当做null
export const getValOfProp = (
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
