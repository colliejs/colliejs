import log from "npmlog";
import * as t from "@babel/types";
import { ImportsByName } from "../utils/types";
import { getFileModuleImport } from "../utils/importer";
import { evalIdentifer } from "../utils/eval/evalIdentifier";
import { evalCodeText } from "../utils/eval/eval";
import { generate } from "../utils/module";
import { NodePath } from "@babel/traverse";
import { evalStyling } from "../styling";
import { getNodePathOfValueForStyledElement } from "./getNodePathOfStyling";


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
