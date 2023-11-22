import * as t from "@babel/types";
import { Config, StaticVariantKey } from "@colliejs/core";
import log from "npmlog";
import { Component } from "../component/Component";
import CustomComponent from "../component/CustomComponent";
import { HostComponent } from "../component/HostComponent";
import { parseStyling } from "../styling/styling";
import { Styling, StylingParsed } from "../styling/types";

import { buildObjectExpression, isStyledComponentDecl } from "../utils/index";
import {
  Alias,
  ImportsByName,
  Stylable,
  StyledComponentDecl,
} from "../utils/types";
import { parseStyledComponentDeclaration as parseStyledComponentDecl } from "./parseStyledComponent";
import { NodePath } from "@babel/traverse";
import { ComponentId } from "../component/componentId";
import { findLayerDeps } from "./findDeps";

export class StyledComponent extends CustomComponent implements Stylable {
  stylingParsed: StylingParsed;
  dependent: CustomComponent | HostComponent;
  styling: Styling;
  layerDeps: string[];

  constructor(
    public path: NodePath<t.VariableDeclaration>,
    moduleId: string,
    moduleIdByName: ImportsByName,
    public config: Config,
    alias: Alias = {},
    root: string = process.cwd(),
    getDeps = false
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
    if (getDeps) {
      this.layerDeps = findLayerDeps(this, alias, root);
    }
  }

  getCssText() {
    let cssText = this.stylingParsed.baseStyle.cssGenText;
    //NOTE: should make sure the order
    const keys = Object.keys(this.stylingParsed);
    for (const key of keys) {
      if (key.startsWith("variants-")) {
        cssText += this.stylingParsed[key].cssGenText + "\n";
      }
    }
    for (const key of keys) {
      if (key.startsWith("compoundVariants-")) {
        cssText += this.stylingParsed[key].cssGenText + "\n";
      }
    }
    const thisLayerName = this.config.layername
      ? `${this.config.layername}.${this.layerName}`
      : this.layerName;
    if (this.dependent instanceof CustomComponent) {
      return `
      @layer ${this.layerDeps
        .reverse()
        .map(e => (this.config.layername ? `${this.config.layername}.${e}` : e))
        .join(",")}, ${thisLayerName};
      @layer ${thisLayerName} {
        ${cssText}
      }\n`;
    }
    return `@layer ${thisLayerName} {${cssText}}\n`;
  }

  //TODO：三方组件支持自定义LayerName
  // cssLayerDep() {
  //   return {
  //     [this.layerName]:
  //       this.dependent instanceof CustomComponent
  //         ? this.dependent.layerName
  //         : "", //HostComponent没有LayerName
  //   };
  // }
  /**
   * @description
   * @example
   * change ```javascript
   *  const StyledButton = styled(button,{color:'red'},option)
   * ```
   *
   *  变为
   *  const StyledButton = styled(
   *    button,
   *    __classNameOfBaseStyle，
   *    __classNameOfVariant:Record<string, string>,
   *    __classNameOfCompoundVariants，
   *    option
   * )
   */
  transform() {
    const classNameOfVariant: Record<string, string> = {};
    const classNamesOfCompoundVariants: Record<string, string> = {};
    for (const key of Object.keys(this.stylingParsed)) {
      //===========================================================
      // 1.variants
      //===========================================================
      if (key.startsWith("variants-")) {
        classNameOfVariant[key] =
          this.stylingParsed[key as StaticVariantKey].className;
      }
      //===========================================================
      // 2.compoundVariants
      //===========================================================
      if (key.startsWith("compoundVariants")) {
        classNamesOfCompoundVariants[key] = this.stylingParsed[key].className;
      }
    }

    //===========================================================
    // 3.classnameOfbaseStyle
    //===========================================================
    let classNameOfBaseStyle = "";
    if (Object.keys(this.stylingParsed.baseStyle.cssRawObj).length !== 0) {
      classNameOfBaseStyle = `${this.stylingParsed.baseStyle.className}`;
    }

    //===========================================================
    // 4. replace styling to classNames
    //===========================================================
    const args = (this.path.node.declarations[0].init as t.CallExpression)
      .arguments;
    args.splice(1, 1); //remove styling
    args.splice(1, 0, t.stringLiteral(classNameOfBaseStyle)); //add classNameOfBaseStyle
    args.splice(2, 0, buildObjectExpression(classNameOfVariant)); //add classNameOfVariant
    args.splice(3, 0, buildObjectExpression(classNamesOfCompoundVariants)); //add classNamesOfCompoundVariants

    //5. return
    return { cssText: this.getCssText(), path: this.path };
  }
}
