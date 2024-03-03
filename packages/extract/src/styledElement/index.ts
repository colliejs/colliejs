import * as t from "@babel/types";
import { type BaseConfig, extractFromCssObject } from "@colliejs/core";
import log from "npmlog";

import { NodePath } from "@babel/traverse";
import { getPropValue } from "../utils/jsx/getPropVal";
import { ImportsByName } from "../utils/types";
import { STYLE_ELEMENT_PROP_NAME } from "../const";

export function extractCssTextFromCssProps<Config extends BaseConfig>(
  path: NodePath<t.JSXElement>,
  importsByName: ImportsByName,
  config: Config
) {
  if (!path.isJSXElement()) {
    log.error("StyledElement must be a JSXElement", path);
    throw new Error("StyledElement must be a JSXElement");
  }
  const cssObject = getPropValue(path, STYLE_ELEMENT_PROP_NAME, importsByName);
  if (typeof cssObject !== "object") {
    throw new Error("css prop must be an object");
  }
  return extractFromCssObject(cssObject, config);
}
