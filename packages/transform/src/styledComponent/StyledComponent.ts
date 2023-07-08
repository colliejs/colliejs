import * as t from "@babel/types";
import { Config, StaticVariantKey } from "@colliejs/core";
import log from "npmlog";
import { Component } from "../component/Component";
import CustomComponent from "../component/CustomComponent";
import { HostComponent } from "../component/HostComponent";
import { parseStyling } from "../styling/styling";
import { Styling, StylingParsed } from "../styling/types";

import { buildObjectExpression, isStyledComponentDecl } from "../utils/index";
import { ImportsByName, Stylable, StyledComponentDecl } from "../utils/types";
import { parseStyledComponentDeclaration as parseStyledComponentDecl } from "./parseStyledComponent";
import { NodePath } from "@babel/traverse";
import { ComponentId } from "../component/componentId";

export class StyledComponent extends CustomComponent implements Stylable {
  stylingParsed: StylingParsed;
  dependent: CustomComponent | HostComponent;
  styling: Styling;

  constructor(
    public path: NodePath<t.VariableDeclaration>,
    moduleId: string,
    moduleIdByName: ImportsByName,
    config: Config
  ) {
    if (!isStyledComponentDecl) {
      log.error("not a styledComponentDecl", "ast", path);
      throw new Error("not a styledComponentDecl");
    }

    const { styledComponentName, dependent, styling } =
      parseStyledComponentDecl(path, moduleIdByName, moduleId);
    super(new ComponentId(moduleId, styledComponentName));
    this.stylingParsed = parseStyling(styling, config, styledComponentName);
    this.dependent = dependent;
    this.styling = styling;
  }

  getBaseStyle() {
    return this.stylingParsed.baseStyle;
  }

  getVariantNames() {
    return Object.keys(this.styling["variants"] || {});
  }

  getCssText() {
    let text = "";
    for (const key of Object.keys(this.stylingParsed)) {
      text += this.stylingParsed[key as StaticVariantKey].cssGenText + "\n";
    }
    if (this.dependent instanceof CustomComponent) {
      return `
      @layer ${this.dependent.layerName}, ${this.layerName};\n        
      @layer ${this.layerName} { 
        ${text} 
      }\n`;
    }
    return `@layer ${this.layerName} {${text}}\n`;
  }

  //TODO：三方组件支持自定义LayerName
  cssLayerDep() {
    return {
      [this.layerName]:
        this.dependent instanceof CustomComponent
          ? this.dependent.layerName
          : "", //HostComponent没有LayerName
    };
  }
  /**
   * @description
   * @example
   *  const StyledButton = styled(button,{color:'red'},option)
   *
   *  变为
   *  const StyledButton = styled(
   *    button,
   *    __classNameByVariant:Record<string, string>,
   *    __classNameOfBaseStyle，
   *    option
   * )
   */
  transform() {
    const classNameByVariant: Record<string, string> = {};
    for (const key of Object.keys(this.stylingParsed)) {
      if (key.startsWith("variants-")) {
        classNameByVariant[key] =
          this.stylingParsed[key as StaticVariantKey].className;
      }
    }

    let classNameOfBaseStyle = "";
    if (Object.keys(this.stylingParsed.baseStyle.cssRawObj).length !== 0) {
      classNameOfBaseStyle = `${this.stylingParsed.baseStyle.className}`;
    }

    const args = (this.path.node.declarations[0].init as t.CallExpression)
      .arguments;
    args.splice(1, 1);
    args.splice(1, 0, buildObjectExpression(classNameByVariant));
    args.splice(2, 0, t.stringLiteral(classNameOfBaseStyle));

    //emit css file
    return { cssText: this.getCssText(), path: this.path };
  }
}
