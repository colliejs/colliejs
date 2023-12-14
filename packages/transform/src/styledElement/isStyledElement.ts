import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { isPropExisted } from "./prop";

export const isStyledElement = (
  path: NodePath<t.JSXElement>,
  propsName: string
) => {
  return isPropExisted(path, propsName);
};
