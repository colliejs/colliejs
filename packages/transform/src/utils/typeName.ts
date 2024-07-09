import * as t from "@babel/types";
export function getJSXElementName(element: t.JSXElement) {
  const openingElementName = element.openingElement.name;
  switch (openingElementName.type) {
    case "JSXIdentifier":
      return openingElementName.name;
    case "JSXMemberExpression":
      return openingElementName.property.name;
    case "JSXNamespacedName":
      throw new Error("not support now");
    default:
      throw new Error("Unknown element type");
  }
}
