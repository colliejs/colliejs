import * as t from "@babel/types";

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
